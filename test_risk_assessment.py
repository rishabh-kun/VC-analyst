"""
Pipeline Test: 5-Agent Pipeline
Startup Research Agent -> Founder Evaluation Agent -> Market Analysis Agent -> Financial Analysis Agent -> Risk Assessment Agent
Input: OpenAI
"""

import json
from agents.startup_research_agent import StartupResearchAgent
from agents.founder_evaluation_agent import FounderEvaluationAgent
from agents.market_analysis_agent import MarketAnalysisAgent
from agents.financial_analysis_agent import FinancialAnalysisAgent
from agents.risk_assessment_agent import RiskAssessmentAgent


def run_pipeline():
    startup_input = "OpenAI"
    print(f"Starting 5-Agent Pipeline for Input: '{startup_input}'\n")

    # Step 1: Startup Research Agent
    print("=" * 70)
    print("STEP 1: STARTUP RESEARCH AGENT OUTPUT")
    print("=" * 70)
    research_agent = StartupResearchAgent()
    research_output = research_agent.run({"startup_name": startup_input})
    print(json.dumps(research_output.model_dump(), indent=2))

    # Step 2: Founder Evaluation Agent
    print("\n" + "=" * 70)
    print("STEP 2: FOUNDER EVALUATION AGENT OUTPUT")
    print("=" * 70)
    founder_agent = FounderEvaluationAgent()
    founder_output = founder_agent.run(research_output)
    print(json.dumps(founder_output.model_dump(), indent=2))

    # Step 3: Market Analysis Agent
    print("\n" + "=" * 70)
    print("STEP 3: MARKET ANALYSIS AGENT OUTPUT")
    print("=" * 70)
    market_agent = MarketAnalysisAgent()
    market_output = market_agent.run(
        research_output=research_output,
        founder_output=founder_output,
    )
    print(json.dumps(market_output.model_dump(), indent=2))

    # Step 4: Financial Analysis Agent
    print("\n" + "=" * 70)
    print("STEP 4: FINANCIAL ANALYSIS AGENT OUTPUT")
    print("=" * 70)
    financial_agent = FinancialAnalysisAgent()
    financial_output = financial_agent.run(
        research_output=research_output,
        founder_output=founder_output,
        market_output=market_output,
    )
    print(json.dumps(financial_output.model_dump(), indent=2))

    # Step 5: Risk Assessment Agent
    print("\n" + "=" * 70)
    print("STEP 5: RISK ASSESSMENT AGENT OUTPUT")
    print("=" * 70)
    risk_agent = RiskAssessmentAgent()
    risk_output = risk_agent.run(
        research_output=research_output,
        founder_output=founder_output,
        market_output=market_output,
        financial_output=financial_output,
    )
    print(json.dumps(risk_output.model_dump(), indent=2))
    print("=" * 70)

    # Validations matching required output schema
    assert risk_output.status == "SUCCESS"
    assert 0.0 <= risk_output.overall_risk_score <= 10.0
    assert risk_output.founder_risk in ("Low", "Medium", "High")
    assert risk_output.market_risk in ("Low", "Medium", "High")
    assert risk_output.financial_risk in ("Low", "Medium", "High")
    assert risk_output.operational_risk in ("Low", "Medium", "High")
    assert risk_output.legal_regulatory_risk in ("Low", "Medium", "High")

    print("\n[SUCCESS] Risk Assessment Agent 5-agent pipeline test passed successfully!")


if __name__ == "__main__":
    run_pipeline()
