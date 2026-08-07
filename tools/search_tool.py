"""
Provider-agnostic Web Search Tool interface and implementations for VC Analyst.
"""

from abc import ABC, abstractmethod
import json
import os
from typing import Any, Dict, List, Optional
import requests
from pydantic import BaseModel, Field
from utils.logger import get_logger

logger = get_logger(__name__)


class SearchResult(BaseModel):
    """Normalized search result data model across all search providers."""

    title: str = Field(..., description="Title of the search result page")
    url: str = Field(..., description="URL of the web page")
    snippet: str = Field(..., description="Text snippet or abstract content")
    source: str = Field(default="unknown", description="Search provider name")


class BaseSearchProvider(ABC):
    """Abstract Base Class for Web Search Providers.

    All search providers (Tavily, Serper, Google, DuckDuckGo) must inherit from this
    class and implement the search method.
    """

    @abstractmethod
    def search(self, query: str, max_results: int = 5) -> List[SearchResult]:
        """Execute web search for a given query string.

        Args:
            query (str): The search term.
            max_results (int): Maximum number of search results to return.

        Returns:
            List[SearchResult]: List of normalized SearchResult objects.
        """
        pass


class TavilySearchProvider(BaseSearchProvider):
    """Tavily AI Search API Provider implementation."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("TAVILY_API_KEY")
        self.api_url = "https://api.tavily.com/search"

    def search(self, query: str, max_results: int = 5) -> List[SearchResult]:
        if not self.api_key:
            logger.warning("Tavily API key not found. Falling back to empty results.")
            return []

        logger.info(f"Executing Tavily search for query: '{query}'")
        payload = {
            "api_key": self.api_key,
            "query": query,
            "max_results": max_results,
            "search_depth": "advanced",
            "include_answer": False,
        }

        try:
            response = requests.post(self.api_url, json=payload, timeout=10)
            response.raise_for_status()
            data = response.json()

            results = []
            for item in data.get("results", []):
                results.append(
                    SearchResult(
                        title=item.get("title", ""),
                        url=item.get("url", ""),
                        snippet=item.get("content", ""),
                        source="tavily",
                    )
                )
            return results
        except Exception as e:
            logger.error(f"Tavily search failed for query '{query}': {str(e)}")
            return []


class DuckDuckGoSearchProvider(BaseSearchProvider):
    """Fallback DuckDuckGo Instant Answer & Web Search Provider implementation."""

    def search(self, query: str, max_results: int = 5) -> List[SearchResult]:
        logger.info(f"Executing DuckDuckGo search fallback for query: '{query}'")
        results = []
        try:
            url = f"https://api.duckduckgo.com/?q={requests.utils.quote(query)}&format=json"
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
            response = requests.get(url, headers=headers, timeout=10)
            if response.ok:
                data = response.json()
                abstract = data.get("AbstractText") or data.get("Abstract")
                abstract_url = data.get("AbstractURL") or data.get("OfficialWebsite")
                heading = data.get("Heading", query)

                if abstract:
                    results.append(
                        SearchResult(
                            title=f"{heading} - Overview",
                            url=abstract_url or f"https://duckduckgo.com/?q={requests.utils.quote(query)}",
                            snippet=abstract,
                            source="duckduckgo",
                        )
                    )

                # Add main results links
                for res in data.get("Results", []):
                    if res.get("FirstURL") and res.get("Text"):
                        results.append(
                            SearchResult(
                                title=f"{heading} - Main Result",
                                url=res.get("FirstURL", ""),
                                snippet=res.get("Text", ""),
                                source="duckduckgo",
                            )
                        )

                # Add related topic snippets
                for topic in data.get("RelatedTopics", [])[:max_results]:
                    if isinstance(topic, dict) and topic.get("Text"):
                        results.append(
                            SearchResult(
                                title=f"{heading} - Related Info",
                                url=topic.get("FirstURL", ""),
                                snippet=topic.get("Text", ""),
                                source="duckduckgo",
                            )
                        )
            return results
        except Exception as e:
            logger.error(f"DuckDuckGo search failed: {str(e)}")
            return []


class SerperSearchProvider(BaseSearchProvider):
    """Placeholder for Serper.dev Google Search API Provider."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("SERPER_API_KEY")

    def search(self, query: str, max_results: int = 5) -> List[SearchResult]:
        # Easily pluggable in the future
        logger.info("SerperSearchProvider requested (placeholder).")
        return []


class GoogleCustomSearchProvider(BaseSearchProvider):
    """Placeholder for Google Custom Search JSON API Provider."""

    def search(self, query: str, max_results: int = 5) -> List[SearchResult]:
        # Easily pluggable in the future
        logger.info("GoogleCustomSearchProvider requested (placeholder).")
        return []


class WebSearchTool:
    """Wrapper & Factory for provider-agnostic search tool execution."""

    def __init__(self, provider: Optional[BaseSearchProvider] = None):
        if provider:
            self.provider = provider
        elif os.getenv("TAVILY_API_KEY"):
            self.provider = TavilySearchProvider()
        else:
            logger.info("No Tavily API key set. Defaulting to DuckDuckGo fallback provider.")
            self.provider = DuckDuckGoSearchProvider()

    def search(self, query: str, max_results: int = 5) -> List[SearchResult]:
        """Runs search through the configured provider.

        Args:
            query (str): The search query.
            max_results (int): Maximum results count.

        Returns:
            List[SearchResult]: Normalized search results.
        """
        return self.provider.search(query, max_results=max_results)
