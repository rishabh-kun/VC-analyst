"""
End-to-end integration test suite for VCOrchestrator.
"""

import json
from orchestrator import VCOrchestrator, SharedContextManager
from agents.startup_research_agent import StartupResearchOutput


def test_successful_orchestration():
    print("\n--- Test 1: Successful VCOrchestrator Workflow Execution ---")
    orchestrator = VCOrchestrator()
    memo_result = orchestrator.analyze_startup("OpenAI")

    print("\nOrchestrator Result JSON:")
    print(json.dumps(memo_result, indent=2))

    assert memo_result["status"] == "SUCCESS"
    assert memo_result["company_name"] == "OpenAI"
    assert memo_result["recommendation"] in ("Strong Invest", "Invest", "Watch", "Do Not Invest")
    assert 0.0 <= memo_result["overall_investment_score"] <= 10.0
    print("[SUCCESS] Test 1 Passed: Orchestration workflow completed successfully.")


def test_failure_halting():
    print("\n--- Test 2: Workflow Halting on Agent Failure ---")
    orchestrator = VCOrchestrator()

    # Simulate agent failure by overriding research agent to return ERROR status
    def mock_failing_research(input_data):
        return StartupResearchOutput(
            company_name="FailCorp",
            status="ERROR",
            error_message="Simulated connection timeout during research stage.",
        )

    orchestrator.research_agent.run = mock_failing_research
    result = orchestrator.analyze_startup("FailCorp")

    print("\nFailure Payload JSON:")
    print(json.dumps(result, indent=2))

    assert result["status"] == "ERROR"
    assert result["failed_step"] == "STARTUP_RESEARCH"
    assert "Simulated connection timeout" in result["error_message"]
    print("[SUCCESS] Test 2 Passed: Workflow halted cleanly on agent failure.")


if __name__ == "__main__":
    test_successful_orchestration()
    test_failure_halting()
    print("\n[SUCCESS] All VCOrchestrator integration tests passed successfully!")
