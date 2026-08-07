"""
Test script running StartupResearchAgent followed by FounderEvaluationAgent for OpenAI.
"""

import json
from agents.startup_research_agent import StartupResearchAgent
from agents.founder_evaluation_agent import FounderEvaluationAgent


def main():
    print("============================================================")
    print("STEP 1: Executing Startup Research Agent")
    print("============================================================")
    research_agent = StartupResearchAgent()
    research_output = research_agent.run({"startup_name": "OpenAI"})

    print("\nStartup Research Output JSON:")
    print(json.dumps(research_output.model_dump(), indent=2))

    print("\n============================================================")
    print("STEP 2: Executing Founder Evaluation Agent")
    print("============================================================")
    founder_agent = FounderEvaluationAgent()
    founder_output = founder_agent.run(research_output)

    print("\nFounder Evaluation Output JSON:")
    print(json.dumps(founder_output.model_dump(), indent=2))
    print("============================================================")

    # Validations
    assert founder_output.status == "SUCCESS"
    assert 0.0 <= founder_output.founder_score <= 10.0
    assert len(founder_output.founder_profiles) > 0

    print("\n[SUCCESS] Founder Evaluation Agent integration test passed successfully!")


if __name__ == "__main__":
    main()
