from typing import Dict, Any

async def ai_classify_and_reply(email_text: str, model_name: str) -> Dict[str, Any]:

    return {
        "category": "Teste",
        "reply": f"MODELO: {model_name}. Resposta de teste da IA TEXTO: {email_text}.",
        "model": "teste",
        "tokens_used": 0,
    }