"""
Main Orchestrator and Shared Context Manager for Multi-Agent VC Analyst.

Coordinates agent handoffs, maintains shared context, logs pipeline execution steps,
validates step outputs, and handles errors gracefully.
"""

import json
import time
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

from agents.startup_research_agent import StartupResearchAgent, StartupResearchOutput
from agents.founder_evaluation_agent import FounderEvaluationAgent, FounderEvaluationOutput
from agents.market_analysis_agent import MarketAnalysisAgent, MarketAnalysisOutput
from agents.financial_analysis_agent import FinancialAnalysisAgent, FinancialAnalysisOutput
from agents.risk_assessment_agent import RiskAssessmentAgent, RiskAssessmentOutput
from agents.investment_memo_agent import InvestmentMemoAgent, InvestmentMemoOutput
from memory.context_manager import SharedContextManager, VCPipelineContext
from tools.search_tool import BaseSearchProvider
from utils.logger import get_logger

logger = get_logger(__name__)


# ==========================================
# Main Workflow Orchestrator
# ==========================================

class VCOrchestrator:
    """Orchestrates multi-agent venture capital analysis workflow."""

    def __init__(self, search_provider: Optional[BaseSearchProvider] = None):
        """Initialize all 6 specialized agents with search tool provider.

        Args:
            search_provider (Optional[BaseSearchProvider]): Search provider instance.
        """
        self.search_provider = search_provider
        self.research_agent = StartupResearchAgent(search_provider=search_provider)
        self.founder_agent = FounderEvaluationAgent(search_provider=search_provider)
        self.market_agent = MarketAnalysisAgent(search_provider=search_provider)
        self.financial_agent = FinancialAnalysisAgent(search_provider=search_provider)
        self.risk_agent = RiskAssessmentAgent(search_provider=search_provider)
        self.memo_agent = InvestmentMemoAgent(search_provider=search_provider)

        logger.info("VCOrchestrator successfully initialized with all 6 agents.")

    def analyze_startup(self, startup_name: str) -> Dict[str, Any]:
        """Executes full 6-agent venture capital analysis workflow.

        Args:
            startup_name (str): Startup or company name.

        Returns:
            Dict[str, Any]: Dictionary containing final InvestmentMemoOutput or error details.
        """
        start_time = time.time()
        logger.info(f"============================================================")
        logger.info(f"STARTING VENTURE CAPITAL ANALYSIS FOR: '{startup_name}'")
        logger.info(f"============================================================")

        session_id = startup_name
        SharedContextManager.clear(session_id)
        SharedContextManager.save(session_id, {"startup_name": startup_name, "current_step": "INIT"})

        # ----------------------------------------------------
        # STEP 1: Startup Research Agent
        # ----------------------------------------------------
        research_out = self.research_agent.run({"startup_name": startup_name})
        context = SharedContextManager.update(session_id, "research", research_out)

        if research_out.status != "SUCCESS":
            return self._handle_step_failure("STARTUP_RESEARCH", research_out.error_message, session_id)

        # ----------------------------------------------------
        # STEP 2: Founder Evaluation Agent
        # ----------------------------------------------------
        founder_out = self.founder_agent.run(research_out)
        context = SharedContextManager.update(session_id, "founder", founder_out)

        if founder_out.status != "SUCCESS":
            return self._handle_step_failure("FOUNDER_EVALUATION", founder_out.error_message, session_id)

        # ----------------------------------------------------
        # STEP 3: Market Analysis Agent
        # ----------------------------------------------------
        market_out = self.market_agent.run(
            research_output=research_out,
            founder_output=founder_out,
        )
        context = SharedContextManager.update(session_id, "market", market_out)

        if market_out.status != "SUCCESS":
            return self._handle_step_failure("MARKET_ANALYSIS", market_out.error_message, session_id)

        # ----------------------------------------------------
        # STEP 4: Financial Analysis Agent
        # ----------------------------------------------------
        financial_out = self.financial_agent.run(
            research_output=research_out,
            founder_output=founder_out,
            market_output=market_out,
        )
        context = SharedContextManager.update(session_id, "financial", financial_out)

        if financial_out.status != "SUCCESS":
            return self._handle_step_failure("FINANCIAL_ANALYSIS", financial_out.error_message, session_id)

        # ----------------------------------------------------
        # STEP 5: Risk Assessment Agent
        # ----------------------------------------------------
        risk_out = self.risk_agent.run(
            research_output=research_out,
            founder_output=founder_out,
            market_output=market_out,
            financial_output=financial_out,
        )
        context = SharedContextManager.update(session_id, "risk", risk_out)

        if risk_out.status != "SUCCESS":
            return self._handle_step_failure("RISK_ASSESSMENT", risk_out.error_message, session_id)

        # ----------------------------------------------------
        # STEP 6: Investment Memo Agent
        # ----------------------------------------------------
        memo_out = self.memo_agent.run(
            research_output=research_out,
            founder_output=founder_out,
            market_output=market_out,
            financial_output=financial_out,
            risk_output=risk_out,
        )
        context = SharedContextManager.update(session_id, "memo", memo_out)

        if memo_out.status != "SUCCESS":
            return self._handle_step_failure("INVESTMENT_MEMO", memo_out.error_message, session_id)

        elapsed = time.time() - start_time
        context.current_step = "COMPLETED"
        SharedContextManager.save(session_id, context)

        logger.info(f"============================================================")
        logger.info(f"ANALYSIS WORKFLOW COMPLETED SUCCESSFULLY IN {elapsed:.2f}s")
        logger.info(f"Recommendation: {memo_out.recommendation} | Score: {memo_out.overall_investment_score}/10")
        logger.info(f"============================================================")

        return memo_out.model_dump()

    def _handle_step_failure(self, step_name: str, error_msg: Optional[str], session_id: str) -> Dict[str, Any]:
        """Logs error, halts workflow execution, and returns structured error details.

        Args:
            step_name (str): Name of failing step.
            error_msg (Optional[str]): Error message details.
            session_id (str): Target session ID.

        Returns:
            Dict[str, Any]: Error payload dictionary.
        """
        err_detail = error_msg or f"Execution failed at step: {step_name}"
        logger.error(f"[ERROR] WORKFLOW HALTED: Agent step [{step_name}] failed. Cause: {err_detail}")

        context = SharedContextManager.load(session_id)
        partial_dump = context.model_dump() if context else {}

        return {
            "company_name": session_id,
            "status": "ERROR",
            "failed_step": step_name,
            "error_message": err_detail,
            "partial_context": partial_dump,
        }
