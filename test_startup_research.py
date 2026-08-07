"""
Verification script for StartupResearchAgent.
"""

import json
from agents.startup_research_agent import StartupResearchAgent, StartupResearchInput
from tools.search_tool import BaseSearchProvider, SearchResult


class CustomMockSearchProvider(BaseSearchProvider):
    """Custom Mock Search Provider to demonstrate provider-agnostic injection."""

    def search(self, query: str, max_results: int = 5):
        return [
            SearchResult(
                title="Stripe Official Website & Profile",
                url="https://stripe.com",
                snippet="Stripe is a financial infrastructure platform for businesses. Millions of companies use Stripe to accept payments, grow revenue, and manage their businesses online. Founded in 2010 by Patrick and John Collison, headquartered in San Francisco, CA.",
                source="mock_provider",
            )
        ]


def test_agent_with_default_provider():
    print("\n--- Test 1: Default Search Tool Provider ---")
    agent = StartupResearchAgent()
    result = agent.run({"startup_name": "Stripe"})
    print("Agent Output JSON:")
    print(json.dumps(result.model_dump(), indent=2))
    assert result.status == "SUCCESS"
    assert result.company_name == "Stripe"


def test_agent_with_custom_provider_injection():
    print("\n--- Test 2: Injected Custom Mock Search Provider ---")
    custom_provider = CustomMockSearchProvider()
    agent = StartupResearchAgent(search_provider=custom_provider)
    result = agent.run(StartupResearchInput(startup_name="Stripe", website="https://stripe.com"))
    print("Agent Output JSON:")
    print(json.dumps(result.model_dump(), indent=2))
    assert result.status == "SUCCESS"
    assert "https://stripe.com" in result.sources


if __name__ == "__main__":
    test_agent_with_default_provider()
    test_agent_with_custom_provider_injection()
    print("\n[SUCCESS] All Startup Research Agent tests passed successfully!")
