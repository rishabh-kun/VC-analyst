"""
Main entry point for the Multi-Agent AI Venture Capital Analyst.
"""

import json
import sys
from dotenv import load_dotenv

load_dotenv()
from orchestrator import VCOrchestrator


def main():
    """Main CLI entry point for running venture capital due diligence."""
    startup_name = sys.argv[1] if len(sys.argv) > 1 else "OpenAI"

    print("=" * 70)
    print("      MULTI-AGENT AI VENTURE CAPITAL ANALYST      ")
    print("=" * 70)
    print(f"Target Startup: '{startup_name}'\n")

    orchestrator = VCOrchestrator()
    result = orchestrator.analyze_startup(startup_name)

    print("\n" + "=" * 70)
    print("FINAL VC INVESTMENT MEMO OUTPUT (JSON):")
    print("=" * 70)
    print(json.dumps(result, indent=2))
    print("=" * 70)


if __name__ == "__main__":
    main()
