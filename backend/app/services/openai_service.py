import json
import os
from typing import Dict, Any
from ..utils.parser import strict_parse_json
from openai import OpenAI

async def classify_and_reply(prompt: str) -> Dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    model_name = os.getenv("OPENAI_MODEL_NAME")
    client = OpenAI(api_key=api_key)

    completion = client.chat.completions.create(
        model=model_name,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.2,
    )
    content = completion.choices[0].message.content
    data = strict_parse_json(content)
    tokens_used = completion.usage.total_tokens if getattr(completion, "usage", None) else None
    
    return {
        "category": data.get("category", "Improdutivo"),
        "reply": data.get("reply", ""),
        "model": model_name,
        "tokens_used": tokens_used,
    }