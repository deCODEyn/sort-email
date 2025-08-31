import pytest
from unittest.mock import MagicMock, patch
from app.services.groq_service import classify_and_reply
from groq import Groq

# Mock de resposta JSON válida da API Groq.
class MockChoice:
    def __init__(self, content):
        self.message = MagicMock()
        self.message.content = content
class MockCompletion:
    def __init__(self, content, tokens):
        self.choices = [MockChoice(content)]
        self.usage = MagicMock()
        self.usage.total_tokens = tokens

@pytest.mark.asyncio
@patch("app.services.groq_service.os.getenv")
@patch("app.services.groq_service.Groq")
async def test_classify_and_reply_success(mock_groq_client, mock_getenv):

    # Configura os mocks para imitar a API e as variáveis de ambiente.
    mock_getenv.side_effect = ["dummy_api_key", "dummy_model_name"]
    mock_groq_client.return_value.chat.completions.create.return_value = MockCompletion(
        '{"category": "Produtivo", "reply": "Claro, vamos começar por priorizar as tarefas."}',
        500
    )

    # Testa função
    result = await classify_and_reply("Preciso organizar minha lista de afazeres.")

    # Verificar o resultado.
    assert result["category"] == "Produtivo"
    assert result["reply"] == "Claro, vamos começar por priorizar as tarefas."
    assert result["model"] == "dummy_model_name"
    assert result["tokens_used"] == 500