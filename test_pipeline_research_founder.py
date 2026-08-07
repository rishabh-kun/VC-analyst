"""
Pipeline Test: Startup Research Agent -> Founder Evaluation Agent
Input: OpenAI
"""

import json
from agents.startup_research_agent import StartupResearchAgent
from agents.founder_evaluation_agent import FounderEvaluationAgent


def run_pipeline():
    startup_input = "OpenAI"
    print(f"Starting Multi-Agent Pipeline for Input: '{startup_input}'\n")

    # Step 1: Startup Research Agent
    print("=" * 70)
    print("STEP 1: STARTUP RESEARCH AGENT OUTPUT")
    print("=" * 70)
    research_agent = StartupResearchAgent()
    research_output = research_agent.run({"startup_name": startup_input})

    # Print formatted JSON output from Agent 1
    research_json_str = json.dumps(research_output.model_dump(), indent=2)
    print(research_json_str)

    # Step 2: Founder Evaluation Agent (receives output of Agent 1)
    print("\n" + "=" * 70)
    print("STEP 2: FOUNDER EVALUATION AGENT OUTPUT (Chained Input)")
    print("=" * 70)
    founder_agent = FounderEvaluationAgent()
    founder_output = founder_agent.run(research_output)

    # Print formatted JSON output from Agent 2
    founder_json_str = json.dumps(founder_output.model_dump(), indent=2)
    print(founder_json_str)
    print("=" * 70)

    print("\nPipeline completed successfully!")


if __name__ == "__main__":
    run_pipeline()
