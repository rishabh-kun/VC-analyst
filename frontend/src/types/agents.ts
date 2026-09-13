/**
 * Confirmed Pydantic schemas for the 6 VC Analyst domain agents.
 * Sourced directly from agents/*.py with zero invented fields.
 */

// ==========================================
// Agent 1: Startup Research
// ==========================================

export interface FundingInfo {
  total_raised?: string;
  latest_round?: string;
  lead_investors: string[];
}

export interface StartupResearchOutput {
  company_name: string;
  industry?: string;
  founding_year?: number | string;
  headquarters?: string;
  founders: string[];
  product_service_summary?: string;
  target_customers?: string;
  funding_info?: FundingInfo | null;
  official_website?: string;
  sources: string[];
  status: 'SUCCESS' | 'ERROR';
  error_message?: string | null;
}

// ==========================================
// Agent 2: Founder Evaluation
// ==========================================

export interface FounderProfile {
  name: string;
  education: string[];
  previous_companies: string[];
  previous_startups: string[];
  relevant_experience?: string | null;
  public_achievements: string[];
}

export interface FounderEvaluationOutput {
  company_name: string;
  founder_profiles: FounderProfile[];
  founder_score: number; // 0.0 - 10.0
  score_justification: string;
  status: 'SUCCESS' | 'ERROR';
  error_message?: string | null;
}

// ==========================================
// Agent 3: Market Analysis & Competitors
// ==========================================

export interface CompetitorInfo {
  name: string;
  description?: string | null;
  key_differentiator?: string | null;
}

export interface MarketAnalysisOutput {
  company_name: string;
  industry_market: string;
  tam_estimate?: string | null;
  major_competitors: CompetitorInfo[];
  market_trends: string[];
  market_growth_estimate?: string | null;
  market_opportunities: string[];
  market_challenges: string[];
  market_score: number; // 0.0 - 10.0
  score_justification: string;
  status: 'SUCCESS' | 'ERROR';
  error_message?: string | null;
}

// ==========================================
// Agent 4: Financial Analysis
// ==========================================

export interface FinancialAnalysisOutput {
  company_name: string;
  company_type: 'Public' | 'Private' | string;
  total_funding: string;
  latest_funding_round: string;
  lead_investors: string[];
  estimated_revenue: string; // STRICT: Not "ARR"
  profitability: string;
  financial_strengths: string[];
  financial_risks: string[];
  financial_score: number; // 0.0 - 10.0
  score_justification: string;
  status: 'SUCCESS' | 'ERROR';
  error_message?: string | null;
}

// ==========================================
// Agent 5: Risk Assessment
// ==========================================

export type RiskLevel = 'Low' | 'Medium' | 'High' | string;

export interface RiskAssessmentOutput {
  company_name: string;
  founder_risk: RiskLevel;
  market_risk: RiskLevel;
  financial_risk: RiskLevel;
  operational_risk: RiskLevel;
  legal_regulatory_risk: RiskLevel;
  /**
   * Overall risk score (0.0 to 10.0).
   * IMPORTANT: HIGHER score = HIGHER risk (more dangerous).
   * LOWER score = LOWER risk (safer).
   */
  overall_risk_score: number;
  risk_summary: string;
  status: 'SUCCESS' | 'ERROR';
  error_message?: string | null;
}

// ==========================================
// Agent 6: Investment Memo
// ==========================================

export type VCRecommendation =
  | 'Strong Invest'
  | 'Invest'
  | 'Watch'
  | 'Do Not Invest'
  | string;

export interface InvestmentMemoOutput {
  company_name: string;
  executive_summary: string;
  startup_summary: string;
  founder_summary: string;
  market_summary: string;
  financial_summary: string;
  risk_summary: string;
  overall_investment_score: number; // 0.0 - 10.0
  recommendation: VCRecommendation;
  confidence_score: number; // 0 - 100
  reasoning: string;
  status: 'SUCCESS' | 'ERROR';
  error_message?: string | null;
}
