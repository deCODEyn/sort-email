import pytest
from unittest.mock import MagicMock, patch
from app.services.openai_service import classify_and_reply
from openai.types.chat.chat_completion import ChatCompletion, ChatCompletionMessage, Choice
from openai.types.completion_usage import CompletionUsage

# Mock de resposta JSON válida da API OpenAI.
MOCK_OPENAI_RESPONSE_CONTENT = '{"category": "Produtivo", "reply": "Claro, vamos começar por priorizar as tarefas."}'
MOCK_MESSAGE = ChatCompletionMessage(
    content=MOCK_OPENAI_RESPONSE_CONTENT,
    role="assistant"
)
MOCK_USAGE = CompletionUsage(
    completion_tokens=15,
    prompt_tokens=10,
    total_tokens=25
)
MOCK_COMPLETION_CHOICE = Choice(
    finish_reason="stop",
    index=0,
    message=MOCK_MESSAGE
)
MOCK_COMPLETION = ChatCompletion(
    id="chatcmpl-123",
    choices=[MOCK_COMPLETION_CHOICE],
    created=1677652288,
    model="gpt-3.5-turbo",
    object="chat.completion",
    usage=MOCK_USAGE
)

@pytest.mark.asyncio
@patch("app.services.openai_service.os.getenv")
@patch("app.services.openai_service.OpenAI")
async def test_classify_and_reply_success(mock_openai_client, mock_getenv):

    # Configura os mocks para imitar a API e as variáveis de ambiente.
    mock_getenv.side_effect = ["dummy_api_key", "dummy_model_name"]
    
    # Configura o mock do cliente para retornar a resposta mockada
    mock_openai_client.return_value.chat.completions.create.return_value = MOCK_COMPLETION

    # Testa função
    result = await classify_and_reply("Preciso organizar minha lista de afazeres.")

    # Verificar o resultado.
    assert result["category"] == "Produtivo"
    assert result["reply"] == "Claro, vamos começar por priorizar as tarefas."
    assert result["model"] == "dummy_model_name"
    assert result["tokens_used"] == 25
