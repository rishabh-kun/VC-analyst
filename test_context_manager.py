"""
Unit test suite for SharedContextManager (memory/context_manager.py).
"""

import json
from memory.context_manager import SharedContextManager, VCPipelineContext
from agents.startup_research_agent import StartupResearchOutput
from agents.founder_evaluation_agent import FounderEvaluationOutput


def test_context_manager_crud():
    print("\n--- Test 1: Testing save(), load(), update(), clear() ---")
    session_id = "TestStartup"

    # 1. Clear session
    SharedContextManager.clear(session_id)
    assert SharedContextManager.load(session_id) is None

    # 2. Save new context
    initial_ctx = SharedContextManager.save(session_id, {"startup_name": session_id, "current_step": "INIT"})
    assert initial_ctx.startup_name == session_id
    assert initial_ctx.current_step == "INIT"

    # 3. Load context
    loaded_ctx = SharedContextManager.load(session_id)
    assert loaded_ctx is not None
    assert loaded_ctx.startup_name == session_id

    # 4. Update agent output (Research)
    research_obj = StartupResearchOutput(
        company_name=session_id,
        industry="SaaS",
        official_website="https://teststartup.com",
        sources=["https://teststartup.com"],
        status="SUCCESS",
    )
    updated_ctx = SharedContextManager.update(session_id, "research", research_obj)
    assert updated_ctx.research_output is not None
    assert updated_ctx.research_output.company_name == session_id
    assert updated_ctx.research_output.industry == "SaaS"

    # 5. Get agent output helper
    fetched_research = SharedContextManager.get_agent_output(session_id, "research")
    assert fetched_research is not None
    assert fetched_research.official_website == "https://teststartup.com"

    # 6. Update founder output
    founder_obj = FounderEvaluationOutput(
        company_name=session_id,
        founder_profiles=[],
        founder_score=8.5,
        score_justification="Strong experience",
        status="SUCCESS",
    )
    SharedContextManager.update(session_id, "founder", founder_obj)
    fetched_founder = SharedContextManager.get_agent_output(session_id, "founder")
    assert fetched_founder is not None
    assert fetched_founder.founder_score == 8.5

    # 7. Clear context
    SharedContextManager.clear(session_id)
    assert SharedContextManager.load(session_id) is None

    print("[SUCCESS] Test 1 Passed: SharedContextManager CRUD operations verified.")


if __name__ == "__main__":
    test_context_manager_crud()
    print("\n[SUCCESS] All SharedContextManager tests passed successfully!")
