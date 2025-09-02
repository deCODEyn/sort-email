from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch, AsyncMock
from fastapi import HTTPException

# Cria uma instância do cliente de teste para a sua aplicação FastAPI
client = TestClient(app)

@patch("app.routes.process_text.ai_classify_and_reply", new_callable=AsyncMock)
def test_process_text_success(mock_ai_classify):

    # Configura o mock para simular conteúdo válido
    mock_ai_classify.return_value = {
        "category": "Produtivo",
        "reply": "Resposta gerada por IA.",
        "model": "gemini",
        "tokens_used": None
    }

    response = client.post(
        "/api/process-text",
        json={"text": "Esse é um e-mail de teste.", "model": "gemini"}
    )

    assert response.status_code == 200
    assert response.json() == {
        "category": "Produtivo",
        "reply": "Resposta gerada por IA.",
        "model": "gemini",
        "tokens_used": None
    }

     # Verifica como foi chamado serviços de IA
    mock_ai_classify.assert_called_once_with("mail teste", "gemini")

def test_process_text_empty_content():
    
     # Configura o mock simular conteúdo vazio
    response = client.post(
        "/api/process-text",
        json={"text": "", "model": "gemini"}
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "Não foi possível validar o texto do e-mail."}

@patch("app.routes.process_text.ai_classify_and_reply", new_callable=AsyncMock)
def test_process_text_ai_service_error(mock_ai_classify):

    # Configura o mock para simular erro
    mock_ai_classify.side_effect = HTTPException(status_code=500, detail="Internal Server Error")

    response = client.post(
        "/api/process-text",
        json={"text": "Esse é um e-mail de teste.", "model": "gemini"}
    )

    assert response.status_code == 500
    assert response.json() == {"detail": "Internal Server Error"}