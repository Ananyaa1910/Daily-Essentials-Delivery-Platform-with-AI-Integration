import json
import logging

import google.generativeai as genai

from app.config import GEMINI_MODEL

logger = logging.getLogger(__name__)


class GeminiService:

    @staticmethod
    async def generate(prompt: str) -> dict:
        """
        Send prompt to Gemini and return parsed JSON.
        """

        try:

            model = genai.GenerativeModel(GEMINI_MODEL)

            response = model.generate_content(
                prompt,
                generation_config={
                    "response_mime_type": "application/json"
                }
            )

            text = response.text.strip()

            logger.info(f"Gemini Response:\n{text}")

            return json.loads(text)

        except Exception as e:

            logger.exception("Gemini generation failed")

            raise Exception(f"Gemini Error: {e}")