import os
from typing import Dict, Any
from app.utils.parser import strict_parse_json
from groq import Groq

async def classify_and_reply(prompt: str) -> Dict[str, Any]:
    api_key = os.getenv("GROQ_API_KEY")
    model_name = os.getenv("GROQ_MODEL_NAME")
    client = Groq(api_key=api_key)

    completion = client.chat.completions.create(
        model=model_name,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6,
    )
    content = completion.choices[0].message.content
    data = strict_parse_json(content)
    tokens_used = (
        completion.usage.total_tokens if getattr(completion, "usage", None) else None
    )
    return {
        "category": data.get("category", "Improdutivo"),
        "reply": data.get("reply", ""),
        "model": model_name,
        "tokens_used": tokens_used,
    }