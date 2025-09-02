import os
from typing import Dict, Any
from app.utils.parser import strict_parse_json
import google.generativeai as genai

async def classify_and_reply(prompt: str) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    model_name = os.getenv("GEMINI_MODEL_NAME")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)

    response = await model.generate_content_async(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    content = response.text
    data = strict_parse_json(content)
    
    return {
        "category": data.get("category", "Improdutivo"),
        "reply": data.get("reply", ""),
        "model": model_name,
        "tokens_used": None,
    }