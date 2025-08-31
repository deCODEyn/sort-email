import pytest
from unittest.mock import patch, AsyncMock
from app.services import ai_service


# Mock saída dos serviços de IA
MOCK_GEMINI_SUCCESS = {
    "category": "Produtivo",
    "reply": "Resposta do Gemini.",
    "model": "gemini",
    "tokens_used": 10,
}
MOCK_GROQ_SUCCESS = {
    "category": "Produtivo",
    "reply": "Resposta do Groq.",
    "model": "groq",
    "tokens_used": 20,
}

@pytest.mark.asyncio
@patch("app.services.ai_service.os.getenv")
@patch("app.services.ai_service.gemini_service.classify_and_reply", new_callable=AsyncMock)
@patch("app.services.ai_service.groq_service.classify_and_reply", new_callable=AsyncMock)
async def test_ai_classify_gemini_success(mock_groq, mock_gemini, mock_getenv):

    # Configura os mocks
    mock_getenv.side_effect = ["dummy_key_gemini", "dummy_key_groq"]
    mock_gemini.return_value = MOCK_GEMINI_SUCCESS
    mock_groq.return_value = MOCK_GROQ_SUCCESS
    
    # Testa função de sucesso do modelo Gemini
    result = await ai_service.ai_classify_and_reply("email de teste", "gemini")

    assert result == MOCK_GEMINI_SUCCESS
    mock_gemini.assert_called_once()
    mock_groq.assert_not_called()

@pytest.mark.asyncio
@patch("app.services.ai_service.os.getenv")
@patch("app.services.ai_service.gemini_service.classify_and_reply", new_callable=AsyncMock)
@patch("app.services.ai_service.groq_service.classify_and_reply", new_callable=AsyncMock)
async def test_ai_classify_groq_success(mock_groq, mock_gemini, mock_getenv):
    
    # Configura os mocks
    mock_getenv.side_effect = ["dummy_key_gemini", "dummy_key_groq"]
    mock_groq.return_value = MOCK_GROQ_SUCCESS
    mock_gemini.return_value = MOCK_GEMINI_SUCCESS
    
    # Testa função de sucesso do modelo Groq
    result = await ai_service.ai_classify_and_reply("email de teste", "groq")

    assert result == MOCK_GROQ_SUCCESS
    mock_groq.assert_called_once()
    mock_gemini.assert_not_called()
    
@pytest.mark.asyncio
@patch("app.services.ai_service.os.getenv")
@patch("app.services.ai_service.gemini_service.classify_and_reply", new_callable=AsyncMock)
@patch("app.services.ai_service.groq_service.classify_and_reply", new_callable=AsyncMock)
async def test_ai_classify_gemini_fallback_to_groq_on_error(mock_groq, mock_gemini, mock_getenv):
    
    # Configura os mocks
    mock_getenv.side_effect = ["dummy_key_gemini", "dummy_key_groq"]
    mock_gemini.side_effect = Exception("Erro na API do Gemini.")
    mock_groq.return_value = MOCK_GROQ_SUCCESS
    
    # Chama função do Gemini
    result = await ai_service.ai_classify_and_reply("email de teste", "gemini")
    
    # Verifica fallback Groq
    assert result == MOCK_GROQ_SUCCESS
    mock_gemini.assert_called_once()
    mock_groq.assert_called_once()
    
@pytest.mark.asyncio
@patch("app.services.ai_service.os.getenv")
@patch("app.services.ai_service.gemini_service.classify_and_reply", new_callable=AsyncMock)
@patch("app.services.ai_service.groq_service.classify_and_reply", new_callable=AsyncMock)
async def test_ai_classify_groq_fallback_to_gemini_on_error(mock_groq, mock_gemini, mock_getenv):
    
    # Configura os mocks
    mock_getenv.side_effect = ["dummy_key_gemini", "dummy_key_groq"]
    mock_groq.side_effect = Exception("Erro na API do Groq.")
    mock_gemini.return_value = MOCK_GEMINI_SUCCESS
    
    # Chama função Groq
    result = await ai_service.ai_classify_and_reply("email de teste", "groq")
    
    # Verifica fallback Gemini
    assert result == MOCK_GEMINI_SUCCESS
    mock_groq.assert_called_once()
    mock_gemini.assert_called_once()

@pytest.mark.asyncio
@patch("app.services.ai_service.os.getenv")
@patch("app.services.ai_service.gemini_service.classify_and_reply", new_callable=AsyncMock)
@patch("app.services.ai_service.groq_service.classify_and_reply", new_callable=AsyncMock)
@patch("app.services.ai_service.rule_based_category")
@patch("app.services.ai_service.get_fallback_reply")
async def test_ai_classify_fallback_to_rule_based_on_all_errors(
    mock_get_fallback, mock_rule_based, mock_groq, mock_gemini, mock_getenv):

    # Configura os mocks
    mock_getenv.side_effect = ["dummy_key_gemini", "dummy_key_groq"]
    mock_gemini.side_effect = Exception("Erro na API do Gemini.")
    mock_groq.side_effect = Exception("Erro na API do Groq.")
    mock_rule_based.return_value = "Spam"
    mock_get_fallback.return_value = "Resposta de fallback."

    # Chama função do Gemini
    result = await ai_service.ai_classify_and_reply("email de teste", "gemini")

    # Verifica lógica de fallback
    assert result["category"] == "Spam"
    assert result["reply"] == "Resposta de fallback."
    assert result["model"] == "rule_based_fallback"
    assert result["tokens_used"] == 0
    mock_gemini.assert_called_once()
    mock_groq.assert_called_once()
    mock_rule_based.assert_called_once()
    mock_get_fallback.assert_called_once()
