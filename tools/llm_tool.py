"""
LLM Tool Interface - Gemini / Universal Model Wrapper

Provides a unified interface for agents to execute prompts against Gemini/OpenAI
and return structured outputs.
"""

import json
import os
import re
from typing import Any, Dict, Optional
from utils.logger import get_logger

logger = get_logger(__name__)


class LLMTool:
    """Wrapper around Gemini / OpenAI LLM APIs for structured extraction and text generation."""

    def __init__(self, model_name: Optional[str] = None, api_key: Optional[str] = None):
        """Initialize LLMTool with API credentials and target model.

        Args:
            model_name (Optional[str]): Model identifier (defaults to gemini-2.5-flash).
            api_key (Optional[str]): API key for Gemini or OpenAI.
        """
        self.api_key = (
            api_key
            or os.getenv("GEMINI_API_KEY")
            or os.getenv("GOOGLE_API_KEY")
            or os.getenv("OPENAI_API_KEY")
        )
        self.model_name = model_name or os.getenv("LLM_MODEL", "gemini-2.5-flash")
        self._genai_client = None

        if self.api_key:
            if os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or not os.getenv("OPENAI_API_KEY"):
                try:
                    from google import genai
                    self._genai_client = genai.Client(api_key=self.api_key)
                    logger.info(f"LLMTool successfully initialized with Google GenAI (model: '{self.model_name}').")
                except Exception as err:
                    logger.warning(f"Could not initialize Google GenAI client: {err}")

    def extract_json(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        """Executes LLM call and returns parsed JSON dictionary.

        Args:
            system_prompt (str): System instruction prompt.
            user_prompt (str): User prompt containing search snippets and query details.

        Returns:
            Dict[str, Any]: Parsed JSON data dictionary.
        """
        response_text = self.generate_text(system_prompt, user_prompt)

        clean_json_str = response_text.strip()
        if clean_json_str.startswith("```"):
            clean_json_str = re.sub(r"^```(?:json)?\n?", "", clean_json_str)
            clean_json_str = re.sub(r"\n?```$", "", clean_json_str).strip()

        try:
            return json.loads(clean_json_str)
        except json.JSONDecodeError as err:
            logger.error(f"Failed to parse LLM response as JSON: {err}. Response text snippet: '{clean_json_str[:200]}'")
            # Attempt regex extraction of first embedded JSON object
            match = re.search(r"(\{[\s\S]*\})", clean_json_str)
            if match:
                try:
                    return json.loads(match.group(1))
                except Exception:
                    pass
            return {}

    def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        """Call LLM provider API to generate text response.

        Args:
            system_prompt (str): System instruction prompt.
            user_prompt (str): User prompt.

        Returns:
            str: Response string from LLM provider.
        """
        # 1. Try Gemini GenAI Client
        if self._genai_client:
            try:
                from google.genai import types
                logger.info(f"Executing Gemini LLM request with model '{self.model_name}'...")
                response = self._genai_client.models.generate_content(
                    model=self.model_name,
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        temperature=0.1,
                        response_mime_type="application/json",
                    ),
                )
                if response and response.text:
                    return response.text
            except Exception as err:
                logger.error(f"Gemini API call failed: {err}")

        # 2. Fallback to OpenAI API if OPENAI_API_KEY is present
        openai_key = os.getenv("OPENAI_API_KEY")
        if openai_key:
            try:
                import requests
                logger.info("Executing OpenAI REST API request fallback...")
                url = "https://api.openai.com/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {openai_key}",
                    "Content-Type": "application/json",
                }
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.1,
                    "response_format": {"type": "json_object"},
                }
                res = requests.post(url, headers=headers, json=payload, timeout=30)
                res.raise_for_status()
                data = res.json()
                return data["choices"][0]["message"]["content"]
            except Exception as err:
                logger.error(f"OpenAI API call failed: {err}")

        logger.warning("No LLM API key available or API calls failed.")
        return "{}"
