"""
Test script running StartupResearchAgent for OpenAI.
"""

import json
from agents.startup_research_agent import StartupResearchAgent


def main():
    print("Initializing StartupResearchAgent...")
    agent = StartupResearchAgent()

    print("Running research for startup: 'OpenAI'...\n")
    result = agent.run({"startup_name": "OpenAI"})

    print("=" * 60)
    print("STRUCTURED JSON OUTPUT:")
    print("=" * 60)
    # Output formatted JSON string
    print(json.dumps(result.model_dump(), indent=2))
    print("=" * 60)


if __name__ == "__main__":
    main()
