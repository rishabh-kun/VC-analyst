/**
 * Shared context state representing the VCPipelineContext Pydantic model
 * from memory/context_manager.py.
 */

import {
  StartupResearchOutput,
  FounderEvaluationOutput,
  MarketAnalysisOutput,
  FinancialAnalysisOutput,
  RiskAssessmentOutput,
  InvestmentMemoOutput,
} from './agents';

export interface VCPipelineContext {
  startup_name: string;
  research_output?: StartupResearchOutput | null;
  founder_output?: FounderEvaluationOutput | null;
  market_output?: MarketAnalysisOutput | null;
  financial_output?: FinancialAnalysisOutput | null;
  risk_output?: RiskAssessmentOutput | null;
  memo_output?: InvestmentMemoOutput | null;
  current_step: string;
}
