"""
Pipeline Test: Startup Research Agent -> Founder Evaluation Agent -> Market Analysis Agent
Input: OpenAI
"""

import json
from agents.startup_research_agent import StartupResearchAgent
from agents.founder_evaluation_agent import FounderEvaluationAgent
from agents.market_analysis_agent import MarketAnalysisAgent


def run_pipeline():
    startup_input = "OpenAI"
    print(f"Starting Multi-Agent Pipeline for Input: '{startup_input}'\n")

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
    print("=" * 70)

    # Validations
    assert market_output.status == "SUCCESS"
    assert 0.0 <= market_output.market_score <= 10.0
    assert len(market_output.major_competitors) > 0
    assert len(market_output.market_trends) > 0
    assert len(market_output.market_opportunities) > 0
    assert len(market_output.market_challenges) > 0

    print("\n[SUCCESS] Market Analysis Agent integration test passed successfully!")


if __name__ == "__main__":
    run_pipeline()
