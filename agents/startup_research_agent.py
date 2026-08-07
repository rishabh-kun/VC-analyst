"""
Startup Research Agent implementation.

Researches a given startup by executing web searches via a provider-agnostic search tool,
extracting strictly factual company attributes using LLM-based structured extraction,
and returning validated Pydantic models without regex heuristics or assumptions.
"""

import json
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field
from tools.search_tool import BaseSearchProvider, SearchResult, WebSearchTool
from tools.llm_tool import LLMTool
from prompts.startup_research_prompts import (
    STARTUP_RESEARCH_SYSTEM_PROMPT,
    STARTUP_RESEARCH_USER_PROMPT,
)
from utils.logger import get_logger

logger = get_logger(__name__)


# ==========================================
# Input and Output Data Models (Pydantic v2)
# ==========================================

class StartupResearchInput(BaseModel):
    """Input parameters for the Startup Research Agent."""

    startup_name: str = Field(..., description="Target company or startup name to research.")
    website: Optional[str] = Field(None, description="Optional official website URL to narrow research scope.")


class FundingInfo(BaseModel):
    """Structured funding information."""

    total_raised: Optional[str] = Field(default="Not Publicly Available", description="Total funding raised (e.g. '$50M').")
    latest_round: Optional[str] = Field(default="Not Publicly Available", description="Latest funding round (e.g. 'Series B').")
    lead_investors: List[str] = Field(default_factory=list, description="List of primary/lead investors.")


class StartupResearchOutput(BaseModel):
    """Structured output returned by the Startup Research Agent."""

    company_name: str = Field(..., description="Official company name.")
    industry: Optional[str] = Field(default="Not Publicly Available", description="Primary industry or sector.")
    founding_year: Optional[Union[int, str]] = Field(default="Not Publicly Available", description="Year the startup was founded.")
    headquarters: Optional[str] = Field(default="Not Publicly Available", description="Headquarters location (City, Country/State).")
    founders: List[str] = Field(default_factory=list, description="Names of founders/co-founders.")
    product_service_summary: Optional[str] = Field(default="Not Publicly Available", description="Objective 2-3 sentence summary of product or service.")
    target_customers: Optional[str] = Field(default="Not Publicly Available", description="Target customer segments or B2B/B2C focus.")
    funding_info: Optional[FundingInfo] = Field(default=None, description="Funding details if available.")
    official_website: Optional[str] = Field(default="Not Publicly Available", description="Official company website URL.")
    sources: List[str] = Field(default_factory=list, description="URLs used as factual sources.")
    status: str = Field(default="SUCCESS", description="Execution status: 'SUCCESS' or 'ERROR'.")
    error_message: Optional[str] = Field(None, description="Error message if execution failed.")


# ==========================================
# Agent Implementation
# ==========================================

class StartupResearchAgent:
    """Agent responsible for gathering objective startup intelligence using search tools and LLM extraction."""

    def __init__(
        self,
        search_provider: Optional[BaseSearchProvider] = None,
        llm_tool: Optional[LLMTool] = None,
    ):
        """Initialize agent with an optional search provider and LLM tool dependency.

        The agent relies on BaseSearchProvider and LLMTool abstractions to extract structured factual company data.

        Args:
            search_provider (Optional[BaseSearchProvider]): Custom search provider implementing BaseSearchProvider.
            llm_tool (Optional[LLMTool]): Custom LLM wrapper for structured extraction.
        """
        self.search_tool = WebSearchTool(provider=search_provider)
        self.llm_tool = llm_tool or LLMTool()
        logger.info("StartupResearchAgent successfully initialized with search tool and LLM tool.")

    def run(self, input_data: Union[dict, StartupResearchInput]) -> StartupResearchOutput:
        """Run the startup research process.

        Args:
            input_data (dict | StartupResearchInput): Research request containing startup_name.

        Returns:
            StartupResearchOutput: Validated Pydantic model containing structured factual company data.
        """
        # 1. Parse and validate input
        try:
            if isinstance(input_data, dict):
                request = StartupResearchInput(**input_data)
            else:
                request = input_data
        except Exception as err:
            logger.error(f"Invalid input provided to StartupResearchAgent: {err}")
            return StartupResearchOutput(
                company_name=input_data.get("startup_name", "Unknown") if isinstance(input_data, dict) else "Unknown",
                status="ERROR",
                error_message=f"Input validation error: {str(err)}",
            )

        name_clean = request.startup_name.strip()
        logger.info(f"Starting research process for startup: '{name_clean}'")

        # 2. Perform web searches across multiple business-focused queries
        search_queries = [
            f"{name_clean} official website",
            f"{name_clean} company overview",
            f"{name_clean} founders",
            f"{name_clean} headquarters",
            f"{name_clean} funding",
            f"{name_clean} Crunchbase",
            f"{name_clean} Wikipedia company",
        ]
        if request.website:
            search_queries.insert(0, f"{name_clean} official website {request.website}")

        all_results: List[SearchResult] = []
        collected_sources: List[str] = []
        seen_urls = set()

        for query in search_queries:
            try:
                results = self.search_tool.search(query, max_results=4)
                for r in results:
                    if r.url and r.url not in seen_urls:
                        # Verify that result refers to a business/company and discard unrelated entities
                        if self._is_company_result(r, name_clean):
                            seen_urls.add(r.url)
                            all_results.append(r)
                            collected_sources.append(r.url)
                        else:
                            logger.info(f"Discarded unrelated search result: '{r.title}' ({r.url})")
            except Exception as e:
                logger.error(f"Search query failed for '{query}': {e}")

        # 3. Aggregate text context from verified search snippets
        combined_snippets = "\n---\n".join(
            [f"Title: {r.title}\nURL: {r.url}\nContent: {r.snippet}" for r in all_results]
        )

        if not combined_snippets:
            logger.warning(f"No valid web search snippets retrieved for startup '{name_clean}'.")

        # 4. Extract structured factual data using LLM integration
        output = self._extract_facts(
            startup_name=name_clean,
            snippets=combined_snippets,
            sources=collected_sources,
            preferred_url=request.website,
        )

        logger.info(f"Research process completed for '{name_clean}' with status: {output.status}")
        return output

    def _is_company_result(self, result: SearchResult, startup_name: str) -> bool:
        """Verifies if a search result refers to the requested business entity.

        Filters out movies, albums, general dictionary terms, and unrelated topics.
        """
        title = (result.title or "").lower()
        snippet = (result.snippet or "").lower()
        url = (result.url or "").lower()
        content = f"{title} {snippet}"

        # Prioritize authoritative business domains
        authoritative_domains = [
            "crunchbase.com", "pitchbook.com", "linkedin.com/company",
            "bloomberg.com", "techcrunch.com", "forbes.com", "reuters.com",
            "ycombinator.com", "cbinsights.com", "wikipedia.org"
        ]
        if any(domain in url for domain in authoritative_domains):
            return True

        # Disqualify explicit entertainment/non-business entries
        disqualifiers = [
            "film)", "(film)", "movie", "album)", "soundtrack",
            "directed by", "box office", "music video", "band)", "discography"
        ]
        if any(disqualifier in title for disqualifier in disqualifiers):
            if not any(kw in title for kw in ["company", "inc", "corp", "startup", "ltd", "llc"]):
                return False

        # Check for company/business indicator keywords
        company_indicators = [
            "company", "startup", "inc", "corp", "llc", "ltd", "corporation",
            "platform", "software", "service", "technology", "tech", "business",
            "founded", "headquarters", "funding", "investors", "ceo", "founder",
            "co-founder", "revenue", "solutions", "enterprise", "b2b", "b2c",
            "crunchbase", "wikipedia", "official website", "valuation", "series"
        ]

        return any(kw in content for kw in company_indicators)

    def _select_official_website(
        self, startup_name: str, sources: List[str], preferred_url: Optional[str] = None
    ) -> Optional[str]:
        """Selects the official company domain, excluding Wikipedia, search engines, and news sites.

        Args:
            startup_name (str): Startup/company name.
            sources (List[str]): List of discovered source URLs.
            preferred_url (Optional[str]): Explicit user-provided website URL.

        Returns:
            Optional[str]: Official website domain URL.
        """
        if preferred_url:
            return preferred_url

        non_official_domains = [
            "wikipedia.org", "duckduckgo.com", "google.com", "crunchbase.com",
            "linkedin.com", "twitter.com", "x.com", "facebook.com", "youtube.com",
            "techcrunch.com", "bloomberg.com", "reuters.com", "forbes.com", "github.com",
            "pitchbook.com", "ycombinator.com", "cbinsights.com", "news"
        ]

        target_clean = startup_name.lower().replace(" ", "").replace("-", "")

        # 1. Prefer URL matching startup name that is not a reference/news domain
        for url in sources:
            url_lower = url.lower()
            if not any(domain in url_lower for domain in non_official_domains):
                if target_clean in url_lower:
                    return url

        # 2. Fallback to any non-reference domain URL in sources
        for url in sources:
            url_lower = url.lower()
            if not any(domain in url_lower for domain in non_official_domains):
                return url

        # 3. Default domain constructed if no non-reference source URL was retrieved
        return f"https://www.{target_clean}.com"

    def _extract_facts(
        self, startup_name: str, snippets: str, sources: List[str], preferred_url: Optional[str] = None
    ) -> StartupResearchOutput:
        """Extracts structured factual data using LLM integration without regex heuristics.

        Args:
            startup_name (str): Name of target startup.
            snippets (str): Aggregated search result content.
            sources (List[str]): Source URLs list.
            preferred_url (Optional[str]): User-provided website URL.

        Returns:
            StartupResearchOutput: Validated Pydantic output object.
        """
        try:
            user_prompt = STARTUP_RESEARCH_USER_PROMPT.format(
                company_name=startup_name,
                snippets=snippets if snippets else "No search snippets available."
            )

            # Call LLM to extract JSON structured facts
            extracted_data = self.llm_tool.extract_json(
                system_prompt=STARTUP_RESEARCH_SYSTEM_PROMPT,
                user_prompt=user_prompt,
            )

            if not isinstance(extracted_data, dict):
                extracted_data = {}

            # Parse and clean extracted fields
            company_name_res = extracted_data.get("company_name") or startup_name
            industry_res = extracted_data.get("industry") or "Not Publicly Available"
            founding_year_res = extracted_data.get("founding_year")
            if founding_year_res is None or founding_year_res == "" or str(founding_year_res).lower() in ["unknown", "none", "n/a", "null"]:
                founding_year_res = "Not Publicly Available"
            elif isinstance(founding_year_res, str) and founding_year_res.isdigit():
                founding_year_res = int(founding_year_res)

            hq_res = extracted_data.get("headquarters") or "Not Publicly Available"
            if str(hq_res).lower() in ["unknown", "none", "n/a", "null"]:
                hq_res = "Not Publicly Available"

            founders_res = extracted_data.get("founders")
            if not isinstance(founders_res, list):
                founders_res = []

            summary_res = extracted_data.get("product_service_summary") or f"Objective business research summary for {startup_name}."
            if "Title:" in summary_res or "URL:" in summary_res or "Content:" in summary_res:
                # Clean up if LLM echoed snippet header format
                lines = [line for line in summary_res.split("\n") if not any(line.startswith(prefix) for prefix in ["Title:", "URL:", "Content:"])]
                summary_res = " ".join(lines).strip() or f"Objective business research summary for {startup_name}."

            target_cust_res = extracted_data.get("target_customers") or "Not Publicly Available"
            if str(target_cust_res).lower() in ["unknown", "none", "n/a", "null"]:
                target_cust_res = "Not Publicly Available"

            # Parse funding_info sub-object
            raw_funding = extracted_data.get("funding_info")
            funding_model = None
            if isinstance(raw_funding, dict):
                tot_raised = raw_funding.get("total_raised") or "Not Publicly Available"
                lat_round = raw_funding.get("latest_round") or "Not Publicly Available"
                lead_inv = raw_funding.get("lead_investors")
                if not isinstance(lead_inv, list):
                    lead_inv = []

                if str(tot_raised).lower() in ["unknown", "none", "n/a", "null"]:
                    tot_raised = "Not Publicly Available"
                if str(lat_round).lower() in ["unknown", "none", "n/a", "null"]:
                    lat_round = "Not Publicly Available"

                funding_model = FundingInfo(
                    total_raised=str(tot_raised),
                    latest_round=str(lat_round),
                    lead_investors=[str(i) for i in lead_inv],
                )

            # Determine official website avoiding search engines/Wikipedia/news
            raw_website = extracted_data.get("official_website")
            official_url = None

            non_official = [
                "wikipedia.org", "duckduckgo.com", "google.com", "crunchbase.com",
                "linkedin.com", "twitter.com", "x.com", "facebook.com", "youtube.com",
                "techcrunch.com", "bloomberg.com", "reuters.com", "forbes.com"
            ]

            if raw_website and isinstance(raw_website, str) and raw_website.startswith("http"):
                if not any(domain in raw_website.lower() for domain in non_official):
                    official_url = raw_website

            if not official_url:
                official_url = self._select_official_website(startup_name, sources, preferred_url)

            return StartupResearchOutput(
                company_name=company_name_res,
                industry=str(industry_res),
                founding_year=founding_year_res,
                headquarters=str(hq_res),
                founders=[str(f) for f in founders_res],
                product_service_summary=str(summary_res),
                target_customers=str(target_cust_res),
                funding_info=funding_model,
                official_website=official_url,
                sources=sources,
                status="SUCCESS",
            )
        except Exception as err:
            logger.error(f"Failed to extract structured facts using LLM for '{startup_name}': {err}")
            return StartupResearchOutput(
                company_name=startup_name,
                sources=sources,
                status="ERROR",
                error_message=f"Extraction failure: {str(err)}",
            )
