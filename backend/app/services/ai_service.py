import os
import logging
from typing import Dict, Any
from app.utils.nlp import rule_based_category
from app.utils.fallback import get_fallback_reply
from app.utils.prompt_builder import email_classification_prompt
from app.services import gemini_service, groq_service

logger = logging.getLogger(__name__)

async def ai_classify_and_reply(email_text: str, model_name: str) -> Dict[str, Any]:
    lowered = model_name.lower()
    prompt = email_classification_prompt(email_text)

    async def try_gemini():
        if not os.getenv("GEMINI_API_KEY"):
            raise ValueError("Chave de API do Gemini não encontrada.")
        return await gemini_service.classify_and_reply(prompt)

    async def try_groq():
        if not os.getenv("GROQ_API_KEY"):
            raise ValueError("Chave de API do Groq não encontrada.")
        return await groq_service.classify_and_reply(prompt)

    if "gemini" in lowered:
        try:
            return await try_gemini()
        except Exception as e:
            logger.error(f"[Gemini] erro: {e} → tentando Groq")
            try:
                return await try_groq()
            except Exception as e2:
                logger.error(f"[Groq e Gemini] erro: {e2}")
    elif "groq" in lowered:
        try:
            return await try_groq()
        except Exception as e:
            logger.error(f"[Groq] erro: {e} → tentando Gemini")
            try:
                return await try_gemini()
            except Exception as e2:
                logger.error(f"[Gemini e Groq] erro: {e2}")
    else:
        raise ValueError("Modelo inválido ou não suportado.")

    logger.error(f"Erro no acesso a IA → fallback rule_based")
    category = rule_based_category(email_text)
    reply = get_fallback_reply(category)
    return {
        "category": category,
        "reply": reply,
        "model": "rule_based_fallback",
        "tokens_used": 0,
    }
