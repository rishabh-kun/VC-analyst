"""
Shared Context Manager for Multi-Agent VC Analyst.

Provides in-memory dictionary-backed state management with strict Pydantic validation,
enabling step-by-step state saving, loading, updating, clearing, and cross-agent data sharing.
"""

from typing import Any, Dict, Optional, Union
from pydantic import BaseModel, Field

from agents.startup_research_agent import StartupResearchOutput
from agents.founder_evaluation_agent import FounderEvaluationOutput
from agents.market_analysis_agent import MarketAnalysisOutput
from agents.financial_analysis_agent import FinancialAnalysisOutput
from agents.risk_assessment_agent import RiskAssessmentOutput
from agents.investment_memo_agent import InvestmentMemoOutput
from utils.logger import get_logger

logger = get_logger(__name__)


# ==========================================
# Pydantic Context State Data Models
# ==========================================

class VCPipelineContext(BaseModel):
    """Pydantic model storing and validating pipeline state outputs across all 6 agents."""

    startup_name: str = Field(..., description="Name of the target startup or company.")
    research_output: Optional[StartupResearchOutput] = Field(None, description="Output from StartupResearchAgent.")
    founder_output: Optional[FounderEvaluationOutput] = Field(None, description="Output from FounderEvaluationAgent.")
    market_output: Optional[MarketAnalysisOutput] = Field(None, description="Output from MarketAnalysisAgent.")
    financial_output: Optional[FinancialAnalysisOutput] = Field(None, description="Output from FinancialAnalysisAgent.")
    risk_output: Optional[RiskAssessmentOutput] = Field(None, description="Output from RiskAssessmentAgent.")
    memo_output: Optional[InvestmentMemoOutput] = Field(None, description="Output from InvestmentMemoAgent.")
    current_step: str = Field(default="INIT", description="Active workflow execution step name.")


# ==========================================
# Shared Context Manager Implementation
# ==========================================

class SharedContextManager:
    """Manages in-memory storage, validation, retrieval, updates, and clearing of agent contexts."""

    # In-memory dictionary storage mapping session_id / company_name to VCPipelineContext
    _store: Dict[str, VCPipelineContext] = {}

    @classmethod
    def save(cls, session_id: str, context_data: Union[dict, VCPipelineContext]) -> VCPipelineContext:
        """Validates and saves context for a given session ID in memory.

        Args:
            session_id (str): Unique identifier or startup name.
            context_data (dict | VCPipelineContext): Context object or dictionary.

        Returns:
            VCPipelineContext: Validated context instance.
        """
        if isinstance(context_data, dict):
            validated_context = VCPipelineContext(**context_data)
        elif isinstance(context_data, VCPipelineContext):
            validated_context = context_data
        else:
            raise ValueError(f"Invalid context data type provided for session '{session_id}'.")

        cls._store[session_id] = validated_context
        logger.info(f"Saved context state in memory for session '{session_id}' [Step: {validated_context.current_step}].")
        return validated_context

    @classmethod
    def load(cls, session_id: str) -> Optional[VCPipelineContext]:
        """Loads stored context for a given session ID from memory.

        Args:
            session_id (str): Unique identifier or startup name.

        Returns:
            Optional[VCPipelineContext]: Stored context or None if not found.
        """
        context = cls._store.get(session_id)
        if context:
            logger.info(f"Loaded context state for session '{session_id}' from memory.")
        else:
            logger.warning(f"No context found in memory for session '{session_id}'.")
        return context

    @classmethod
    def update(cls, session_id: str, agent_name: str, agent_output: Any) -> VCPipelineContext:
        """Updates a specific agent's output in the session context and re-validates the state.

        Args:
            session_id (str): Session identifier / startup name.
            agent_name (str): Name of agent ('research', 'founder', 'market', 'financial', 'risk', 'memo').
            agent_output (Any): Output model or dictionary from the specified agent.

        Returns:
            VCPipelineContext: Updated and validated context object.
        """
        context = cls.load(session_id)
        if not context:
            context = VCPipelineContext(startup_name=session_id)

        field_map = {
            "research": "research_output",
            "startup_research": "research_output",
            "founder": "founder_output",
            "founder_evaluation": "founder_output",
            "market": "market_output",
            "market_analysis": "market_output",
            "financial": "financial_output",
            "financial_analysis": "financial_output",
            "risk": "risk_output",
            "risk_assessment": "risk_output",
            "memo": "memo_output",
            "investment_memo": "memo_output",
        }

        target_field = field_map.get(agent_name.lower())
        if not target_field:
            raise ValueError(f"Unknown agent_name '{agent_name}'. Supported agents: {list(field_map.keys())}")

        setattr(context, target_field, agent_output)
        context.current_step = agent_name.upper()

        # Re-save and return validated state
        return cls.save(session_id, context)

    @classmethod
    def clear(cls, session_id: Optional[str] = None) -> None:
        """Clears memory context for a specific session ID or resets all stored sessions.

        Args:
            session_id (Optional[str]): Target session ID to clear. If None, clears all sessions.
        """
        if session_id:
            if session_id in cls._store:
                del cls._store[session_id]
                logger.info(f"Cleared memory context for session '{session_id}'.")
            else:
                logger.warning(f"Session '{session_id}' not found to clear.")
        else:
            cls._store.clear()
            logger.info("Cleared all memory contexts.")

    @classmethod
    def get_agent_output(cls, session_id: str, agent_name: str) -> Optional[Any]:
        """Convenience method for agents to retrieve specific previous outputs from shared context.

        Args:
            session_id (str): Session identifier / startup name.
            agent_name (str): Agent key ('research', 'founder', 'market', 'financial', 'risk', 'memo').

        Returns:
            Optional[Any]: Stored agent output model or None.
        """
        context = cls.load(session_id)
        if not context:
            return None

        field_map = {
            "research": context.research_output,
            "founder": context.founder_output,
            "market": context.market_output,
            "financial": context.financial_output,
            "risk": context.risk_output,
            "memo": context.memo_output,
        }
        return field_map.get(agent_name.lower())
