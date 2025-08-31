import pytest
from unittest.mock import AsyncMock, patch
from app.services.gemini_service import classify_and_reply

# Mock de resposta JSON válida da API Gemini.
MOCK_GEMINI_RESPONSE = AsyncMock()
MOCK_GEMINI_RESPONSE.text = '{"category": "Produtivo", "reply": "Ótima ideia. Qual o próximo passo?"}'

@pytest.mark.asyncio
@patch("app.services.gemini_service.os.getenv")
@patch("app.services.gemini_service.genai.GenerativeModel")
async def test_classify_and_reply_success(mock_model, mock_getenv):

    # Configura os mocks para imitar a API e as variáveis de ambiente.
    mock_getenv.side_effect = ["dummy_api_key", "dummy_model_name"]
    mock_model.return_value.generate_content_async = AsyncMock(return_value=MOCK_GEMINI_RESPONSE)

    # Testa função
    result = await classify_and_reply("Me ajude a organizar a agenda da semana.")

    #Verificar o resultado.
    assert result["category"] == "Produtivo"
    assert result["reply"] == "Ótima ideia. Qual o próximo passo?"
    assert result["model"] == "dummy_model_name"
    assert result["tokens_used"] is None
