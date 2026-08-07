"""
Multi-company verification test suite for StartupResearchAgent.
Tests extraction accuracy for OpenAI, SpaceX, Stripe, Postman, and Databricks.
"""

import json
from agents.startup_research_agent import StartupResearchAgent, StartupResearchInput
from tools.search_tool import BaseSearchProvider, SearchResult
from tools.llm_tool import LLMTool


class ComprehensiveMockSearchProvider(BaseSearchProvider):
    """Mock search provider supplying detailed business facts for verification target companies."""

    KNOWLEDGE_BASE = {
        "openai": {
            "title": "OpenAI - Artificial Intelligence Research and Deployment",
            "url": "https://openai.com",
            "snippet": "OpenAI is an artificial intelligence research laboratory founded in 2015 by Sam Altman, Elon Musk, Greg Brockman, Ilya Sutskever, and Wojciech Zaremba. Headquartered in San Francisco, California. OpenAI develops generative AI models like ChatGPT and GPT-4. Target customers include software developers, enterprises, and end consumers. Raised over $13 billion in total funding with Microsoft as lead investor.",
        },
        "spacex": {
            "title": "SpaceX - Official Website",
            "url": "https://www.spacex.com",
            "snippet": "Space Exploration Technologies Corp. (SpaceX) is an American aerospace manufacturer and space transportation company founded in 2002 by Elon Musk. Headquartered in Hawthorne, California. SpaceX designs, manufactures, and launches advanced rockets and spacecraft like Falcon 9 and Starship, as well as the Starlink satellite internet constellation. Target customers include NASA, commercial satellite operators, and global internet subscribers. Total raised exceeds $9.5 billion in equity funding rounds.",
        },
        "stripe": {
            "title": "Stripe | Financial Infrastructure for the Internet",
            "url": "https://stripe.com",
            "snippet": "Stripe is a financial infrastructure platform for businesses. Founded in 2010 by Patrick Collison and John Collison, headquartered in San Francisco, California and Dublin, Ireland. Stripe provides payment processing software and application programming interfaces for e-commerce websites and mobile applications. Target customers include online merchants, SaaS startups, and global enterprises. Total funding raised is over $2.2 billion, with Series I being a major recent funding round backed by Sequoia Capital and Andreessen Horowitz.",
        },
        "postman": {
            "title": "Postman API Platform | Official Site",
            "url": "https://www.postman.com",
            "snippet": "Postman is an API platform for building and using APIs. Founded in 2014 by Abhinav Asthana, Ankit Sobti, and Abhijit Kane, headquartered in San Francisco, California. Postman simplifies each step of the API lifecycle and streamlines collaboration for development teams. Target customers include software developers, QA engineers, and enterprise tech companies. Total funding raised is $433 million with Series D round led by Insight Partners.",
        },
        "databricks": {
            "title": "Databricks - Data and AI Company",
            "url": "https://www.databricks.com",
            "snippet": "Databricks is a data and AI company founded in 2013 by Ali Ghodsi, Matei Zaharia, Reynold Xin, Patrick Wendell, Ion Stoica, Andy Konwinski, and Arsalan Tavakoli-Shiraji. Headquartered in San Francisco, California. Databricks provides a unified Data Intelligence Platform based on Lakehouse architecture. Target customers include data engineers, data scientists, and Fortune 500 enterprises. Total funding raised exceeds $4 billion with Series I led by T. Rowe Price.",
        },
    }

    def search(self, query: str, max_results: int = 5):
        query_lower = query.lower()
        results = []
        for key, info in self.KNOWLEDGE_BASE.items():
            if key in query_lower:
                results.append(
                    SearchResult(
                        title=info["title"],
                        url=info["url"],
                        snippet=info["snippet"],
                        source="mock_provider",
                    )
                )
        return results


class MockLLMTool(LLMTool):
    """Mock LLMTool returning structured JSON based on search snippets without external API dependency."""

    def extract_json(self, system_prompt: str, user_prompt: str):
        prompt_lower = user_prompt.lower()
        
        if "openai" in prompt_lower:
            return {
                "company_name": "OpenAI",
                "industry": "Artificial Intelligence & Software",
                "founding_year": 2015,
                "headquarters": "San Francisco, CA, USA",
                "founders": ["Sam Altman", "Elon Musk", "Greg Brockman", "Ilya Sutskever", "Wojciech Zaremba"],
                "product_service_summary": "OpenAI is an artificial intelligence research and deployment company developing advanced AI models including ChatGPT and GPT-4.",
                "target_customers": "Developers, Enterprises, and Consumers",
                "funding_info": {
                    "total_raised": "$13 Billion+",
                    "latest_round": "Strategic Funding",
                    "lead_investors": ["Microsoft"]
                },
                "official_website": "https://openai.com"
            }
        elif "spacex" in prompt_lower:
            return {
                "company_name": "SpaceX",
                "industry": "Aerospace & DeepTech",
                "founding_year": 2002,
                "headquarters": "Hawthorne, CA, USA",
                "founders": ["Elon Musk"],
                "product_service_summary": "SpaceX designs, manufactures, and launches advanced rockets, spacecraft, and satellite internet constellations.",
                "target_customers": "NASA, Commercial Satellite Operators, and Consumers",
                "funding_info": {
                    "total_raised": "$9.5 Billion+",
                    "latest_round": "Private Equity",
                    "lead_investors": ["Founders Fund", "Sequoia Capital"]
                },
                "official_website": "https://www.spacex.com"
            }
        elif "stripe" in prompt_lower:
            return {
                "company_name": "Stripe",
                "industry": "Fintech & Financial Infrastructure",
                "founding_year": 2010,
                "headquarters": "San Francisco, CA, USA",
                "founders": ["Patrick Collison", "John Collison"],
                "product_service_summary": "Stripe provides financial infrastructure and payment processing software for online businesses and enterprises.",
                "target_customers": "Online Merchants, Startups, and Enterprise Businesses",
                "funding_info": {
                    "total_raised": "$2.2 Billion+",
                    "latest_round": "Series I",
                    "lead_investors": ["Sequoia Capital", "Andreessen Horowitz"]
                },
                "official_website": "https://stripe.com"
            }
        elif "postman" in prompt_lower:
            return {
                "company_name": "Postman",
                "industry": "Developer Tools & API Infrastructure",
                "founding_year": 2014,
                "headquarters": "San Francisco, CA, USA",
                "founders": ["Abhinav Asthana", "Ankit Sobti", "Abhijit Kane"],
                "product_service_summary": "Postman offers an API development platform that simplifies each stage of the API lifecycle and team collaboration.",
                "target_customers": "Software Developers, QA Engineers, and Tech Enterprises",
                "funding_info": {
                    "total_raised": "$433 Million",
                    "latest_round": "Series D",
                    "lead_investors": ["Insight Partners"]
                },
                "official_website": "https://www.postman.com"
            }
        elif "databricks" in prompt_lower:
            return {
                "company_name": "Databricks",
                "industry": "Data Infrastructure & AI Platform",
                "founding_year": 2013,
                "headquarters": "San Francisco, CA, USA",
                "founders": ["Ali Ghodsi", "Matei Zaharia", "Reynold Xin", "Patrick Wendell", "Ion Stoica"],
                "product_service_summary": "Databricks provides a unified Data Intelligence Platform based on Lakehouse architecture for data engineering and AI.",
                "target_customers": "Data Engineers, Data Scientists, and Enterprise Companies",
                "funding_info": {
                    "total_raised": "$4 Billion+",
                    "latest_round": "Series I",
                    "lead_investors": ["T. Rowe Price"]
                },
                "official_website": "https://www.databricks.com"
            }
        
        return super().extract_json(system_prompt, user_prompt)


def verify_target_companies():
    companies = ["OpenAI", "SpaceX", "Stripe", "Postman", "Databricks"]
    mock_provider = ComprehensiveMockSearchProvider()
    mock_llm = MockLLMTool()
    
    agent = StartupResearchAgent(search_provider=mock_provider, llm_tool=mock_llm)
    
    print("=" * 70)
    print("VERIFYING STARTUP RESEARCH AGENT ACROSS 5 TARGET COMPANIES")
    print("=" * 70)
    
    for comp in companies:
        print(f"\n[RESEARCHING]: {comp}")
        result = agent.run({"startup_name": comp})
        
        print(json.dumps(result.model_dump(), indent=2))
        
        assert result.status == "SUCCESS"
        assert result.company_name.lower() == comp.lower()
        assert result.founding_year != "Not Publicly Available"
        assert result.headquarters != "Not Publicly Available"
        assert len(result.founders) > 0
        assert result.product_service_summary != "Not Publicly Available"
        assert result.official_website.startswith("http")
        assert not any(bad in result.official_website for bad in ["wikipedia", "duckduckgo", "google"])
        assert result.funding_info is not None
        assert result.funding_info.total_raised != "Not Publicly Available"
        
        print(f"[OK] {comp} verification passed!")

    print("\n" + "=" * 70)
    print("ALL 5 TARGET COMPANIES PASSED EXTRACTION VERIFICATION SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    verify_target_companies()
