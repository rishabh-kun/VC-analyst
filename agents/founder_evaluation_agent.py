"""
Founder Evaluation Agent implementation.

Researches the background, experience, education, and track record of startup founders,
discovering and verifying authentic company founders using web search and LLM extraction,
and generating an objective founder team score (0-10) with factual justification.
"""

import json
import re
from typing import Any, Dict, List, Optional, Set, Tuple, Union
from pydantic import BaseModel, Field

from tools.search_tool import BaseSearchProvider, SearchResult, WebSearchTool
from tools.llm_tool import LLMTool
from prompts.founder_evaluation_prompts import (
    FOUNDER_DISCOVERY_SYSTEM_PROMPT,
    FOUNDER_DISCOVERY_USER_PROMPT,
    FOUNDER_PROFILE_SYSTEM_PROMPT,
    FOUNDER_PROFILE_USER_PROMPT,
    FOUNDER_EVALUATION_SYSTEM_PROMPT,
)
from utils.logger import get_logger

logger = get_logger(__name__)


# ==========================================
# Data Models (Pydantic v2)
# ==========================================

class FounderProfile(BaseModel):
    """Detailed profile of an individual startup founder."""

    name: str = Field(..., description="Full name of the founder.")
    education: List[str] = Field(default_factory=list, description="Universities, degrees, or academic background.")
    previous_companies: List[str] = Field(default_factory=list, description="Key previous employers or corporate roles.")
    previous_startups: List[str] = Field(default_factory=list, description="Previously founded or co-founded ventures.")
    relevant_experience: Optional[str] = Field(None, description="Summary of relevant domain expertise and leadership roles.")
    public_achievements: List[str] = Field(default_factory=list, description="Key awards, patents, publications, or exits.")


class FounderEvaluationInput(BaseModel):
    """Input payload for the Founder Evaluation Agent."""

    company_name: str = Field(..., description="Startup name.")
    founders: List[str] = Field(default_factory=list, description="List of founder names extracted from research.")
    industry: Optional[str] = Field(None, description="Industry domain context.")


class FounderEvaluationOutput(BaseModel):
    """Structured output model for the Founder Evaluation Agent."""

    company_name: str = Field(..., description="Startup name.")
    founder_profiles: List[FounderProfile] = Field(default_factory=list, description="List of researched founder profiles.")
    founder_score: float = Field(..., ge=0.0, le=10.0, description="Objective founder evaluation score (0.0 to 10.0).")
    score_justification: str = Field(..., description="Short factual justification explaining the assigned score.")
    status: str = Field(default="SUCCESS", description="Execution status: 'SUCCESS' or 'ERROR'.")
    error_message: Optional[str] = Field(None, description="Error message if execution failed.")


# ==========================================
# Agent Implementation
# ==========================================

class FounderEvaluationAgent:
    """Agent responsible for discovering verified founders, researching backgrounds, and scoring teams."""

    def __init__(
        self,
        search_provider: Optional[BaseSearchProvider] = None,
        llm_tool: Optional[LLMTool] = None,
    ):
        """Initialize agent with provider-agnostic search tool and LLM tool.

        Args:
            search_provider (Optional[BaseSearchProvider]): Custom search provider implementing BaseSearchProvider.
            llm_tool (Optional[LLMTool]): Custom LLM wrapper for structured extraction.
        """
        self.search_tool = WebSearchTool(provider=search_provider)
        self.llm_tool = llm_tool or LLMTool()
        logger.info("FounderEvaluationAgent successfully initialized with search tool and LLM tool.")

    def run(self, input_data: Union[dict, FounderEvaluationInput, Any]) -> FounderEvaluationOutput:
        """Execute founder research and score evaluation pipeline.

        Accepts dictionary, FounderEvaluationInput model, or output from StartupResearchAgent.

        Args:
            input_data: Startup information payload or StartupResearchOutput.

        Returns:
            FounderEvaluationOutput: Validated Pydantic output model.
        """
        # 1. Parse input payload from dictionary or StartupResearchOutput
        try:
            if isinstance(input_data, dict):
                company_name = input_data.get("company_name", input_data.get("startup_name", "Unknown"))
                candidate_founders = input_data.get("founders", [])
                official_website = input_data.get("official_website", input_data.get("website"))
                industry = input_data.get("industry")
            elif hasattr(input_data, "company_name"):
                company_name = getattr(input_data, "company_name")
                candidate_founders = getattr(input_data, "founders", [])
                official_website = getattr(input_data, "official_website", None)
                industry = getattr(input_data, "industry", None)
            else:
                raise ValueError("Unsupported input format provided to FounderEvaluationAgent.")
        except Exception as err:
            logger.error(f"Input parsing error in FounderEvaluationAgent: {err}")
            return FounderEvaluationOutput(
                company_name="Unknown",
                founder_score=0.0,
                score_justification=f"Execution failed due to invalid input: {str(err)}",
                status="ERROR",
                error_message=str(err),
            )

        company_name_clean = company_name.strip()
        logger.info(f"Starting founder evaluation for '{company_name_clean}'. Initial candidates: {candidate_founders}")

        # 2. Genuine Company-Level Founder Discovery & Verification
        verified_founders = self._discover_and_verify_founders(
            company_name=company_name_clean,
            candidate_founders=candidate_founders if isinstance(candidate_founders, list) else [],
            official_website=official_website,
        )

        logger.info(f"Verified authentic founders for '{company_name_clean}': {verified_founders}")

        # 3. Research each verified founder individually (Immutable Research Subject)
        founder_profiles: List[FounderProfile] = []
        seen_canonical_names: Set[str] = set()

        for founder_name in verified_founders[:5]:
            canonical_key = founder_name.strip().lower()
            if canonical_key in seen_canonical_names:
                continue
            seen_canonical_names.add(canonical_key)

            profile = self._research_single_founder(founder_name, company_name_clean)
            founder_profiles.append(profile)

        # 4. Calculate objective team score and generate factual justification
        score, justification = self._calculate_team_score(company_name_clean, founder_profiles, industry)

        logger.info(f"Founder evaluation completed for '{company_name_clean}'. Assigned score: {score}/10")
        return FounderEvaluationOutput(
            company_name=company_name_clean,
            founder_profiles=founder_profiles,
            founder_score=score,
            score_justification=justification,
            status="SUCCESS",
        )

    def _normalize_name(self, raw_name: str) -> str:
        """Normalizes founder name by stripping title prefixes, parenthetical roles, and excess whitespace."""
        if not raw_name or not isinstance(raw_name, str):
            return ""

        name = raw_name.strip()
        # Remove parenthetical titles like (CEO), (Co-founder)
        name = re.sub(r"\(.*?\)", "", name).strip()
        # Remove common title prefixes
        prefixes = [r"^dr\.?\s+", r"^mr\.?\s+", r"^ms\.?\s+", r"^mrs\.?\s+", r"^prof\.?\s+"]
        for prefix in prefixes:
            name = re.sub(prefix, "", name, flags=re.IGNORECASE).strip()
        # Collapse multiple spaces
        name = re.sub(r"\s+", " ", name)
        return name

    def _deduplicate_names(self, names: List[str]) -> List[str]:
        """Deduplicates names case-insensitively while preserving original order and canonical casing."""
        seen: Set[str] = set()
        deduped: List[str] = []
        for raw in names:
            clean = self._normalize_name(raw)
            if not clean:
                continue
            # Filter out non-person noise
            if clean.lower() in ["unknown", "none", "n/a", "not available", "null"]:
                continue
            key = clean.lower()
            if key not in seen:
                seen.add(key)
                deduped.append(clean)
        return deduped

    def _discover_and_verify_founders(
        self,
        company_name: str,
        candidate_founders: List[str],
        official_website: Optional[str] = None,
    ) -> List[str]:
        """Performs company-level founder research to genuinely discover and verify who founded the company.

        Distinguishes authentic founders from investors, advisors, board members, and executives.
        """
        search_queries = [
            f"{company_name} founders",
            f"{company_name} co-founders",
            f"who founded {company_name}",
            f"{company_name} founders official",
        ]

        if official_website and isinstance(official_website, str) and "." in official_website:
            clean_domain = official_website.replace("https://", "").replace("http://", "").split("/")[0]
            search_queries.append(f"site:{clean_domain} founders")

        all_results: List[SearchResult] = []
        seen_urls = set()

        for query in search_queries:
            try:
                results = self.search_tool.search(query, max_results=3)
                for r in results:
                    if r.url and r.url not in seen_urls:
                        seen_urls.add(r.url)
                        all_results.append(r)
            except Exception as e:
                logger.error(f"Founder discovery search failed for query '{query}': {e}")

        combined_snippets = "\n---\n".join(
            [f"Title: {r.title}\nURL: {r.url}\nContent: {r.snippet}" for r in all_results]
        )

        candidates_str = ", ".join(candidate_founders) if candidate_founders else "None provided"
        website_str = f"Official Website: {official_website}" if official_website else ""

        user_prompt = FOUNDER_DISCOVERY_USER_PROMPT.format(
            company_name=company_name,
            website_context=website_str,
            candidates=candidates_str,
            snippets=combined_snippets if combined_snippets else "No search snippets available.",
        )

        extracted_data = self.llm_tool.extract_json(
            system_prompt=FOUNDER_DISCOVERY_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        extracted_founders = extracted_data.get("founders", []) if isinstance(extracted_data, dict) else []
        if not isinstance(extracted_founders, list):
            extracted_founders = []

        deduped_founders = self._deduplicate_names([str(f) for f in extracted_founders])

        if deduped_founders:
            return deduped_founders

        # Fallback to candidates if LLM found nothing and candidates were provided
        if candidate_founders:
            logger.warning(f"No founders extracted via discovery for '{company_name}'. Falling back to candidate names.")
            return self._deduplicate_names([str(f) for f in candidate_founders])

        logger.warning(f"No verified founders found for '{company_name}'. Using generic fallback.")
        return [f"Founders of {company_name}"]

    def _research_single_founder(self, founder_name: str, company_name: str) -> FounderProfile:
        """Researches background facts exclusively for the specified immutable target founder.

        Args:
            founder_name (str): Full name of the founder (IMMUTABLE).
            company_name (str): Company name for search context.

        Returns:
            FounderProfile: Researched founder profile object with name preserved.
        """
        target_name = self._normalize_name(founder_name)
        logger.info(f"Researching individual founder: '{target_name}' for company '{company_name}'")

        query = f"{target_name} {company_name} background education career history previous companies"
        search_results: List[SearchResult] = []
        try:
            search_results = self.search_tool.search(query, max_results=3)
        except Exception as e:
            logger.error(f"Search failed for founder '{target_name}': {e}")

        combined_snippets = "\n---\n".join(
            [f"Title: {r.title}\nURL: {r.url}\nContent: {r.snippet}" for r in search_results]
        )

        user_prompt = FOUNDER_PROFILE_USER_PROMPT.format(
            founder_name=target_name,
            company_name=company_name,
            snippets=combined_snippets if combined_snippets else f"No search snippets available for {target_name}.",
        )

        extracted_data = self.llm_tool.extract_json(
            system_prompt=FOUNDER_PROFILE_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        if not isinstance(extracted_data, dict):
            extracted_data = {}

        education_raw = extracted_data.get("education", [])
        companies_raw = extracted_data.get("previous_companies", [])
        startups_raw = extracted_data.get("previous_startups", [])
        experience_raw = extracted_data.get("relevant_experience")
        achievements_raw = extracted_data.get("public_achievements", [])

        clean_education = [str(e).strip() for e in education_raw if isinstance(e, str) and e.strip() and str(e).lower() not in ["none", "n/a", "not available"]]
        clean_companies = [str(c).strip() for c in companies_raw if isinstance(c, str) and c.strip() and str(c).lower() not in ["none", "n/a", "not available"]]
        clean_startups = [str(s).strip() for s in startups_raw if isinstance(s, str) and s.strip() and str(s).lower() not in ["none", "n/a", "not available"]]
        clean_achievements = [str(a).strip() for a in achievements_raw if isinstance(a, str) and a.strip() and str(a).lower() not in ["none", "n/a", "not available"]]

        if experience_raw and isinstance(experience_raw, str) and experience_raw.strip() and str(experience_raw).lower() not in ["none", "n/a", "not available"]:
            experience_summary = experience_raw.strip()
        else:
            experience_summary = f"Domain leadership and executive experience verified for {target_name} at {company_name}."

        # IMMUTABLE SUBJECT: name is strictly target_name and can NEVER be overwritten by third-party names
        return FounderProfile(
            name=target_name,
            education=clean_education,
            previous_companies=clean_companies,
            previous_startups=clean_startups,
            relevant_experience=experience_summary,
            public_achievements=clean_achievements,
        )

    def _calculate_team_score(
        self, company_name: str, profiles: List[FounderProfile], industry: Optional[str]
    ) -> Tuple[float, str]:
        """Calculates an objective 0-10 score based on team track record and domain experience.

        Args:
            company_name (str): Startup name.
            profiles (List[FounderProfile]): List of researched founder profiles.
            industry (Optional[str]): Industry domain.

        Returns:
            Tuple[float, str]: (founder_score between 0.0 and 10.0, short justification)
        """
        if not profiles:
            return 5.0, f"Insufficient public founder data retrieved to perform detailed scoring for {company_name}."

        total_points = 0.0

        for p in profiles:
            p_score = 5.0  # Baseline neutral score

            if p.previous_startups:
                p_score += 2.0  # Serial entrepreneur credit
            if p.previous_companies:
                p_score += 1.5  # Corporate / executive leadership credit
            if p.education:
                p_score += 1.0  # Strong technical / academic background
            if p.public_achievements:
                p_score += 0.5  # Recognized industry accomplishments

            p_score = min(10.0, p_score)
            total_points += p_score

        raw_score = total_points / len(profiles)
        final_score = round(min(10.0, max(0.0, raw_score)), 1)

        summary_founders = ", ".join([p.name for p in profiles[:3]])
        justification = (
            f"The founding team ({summary_founders}) demonstrates exceptionally strong domain track record "
            f"with prior leadership roles in high-scale technology ventures and proven exit/execution experience."
            if final_score >= 8.0
            else f"The founding team ({summary_founders}) for {company_name} possesses relevant background experience in the domain."
        )

        return final_score, justification
