from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch, AsyncMock
from fastapi import HTTPException

client = TestClient(app)

@patch("app.routes.process_file.ai_classify_and_reply", new_callable=AsyncMock)
def test_process_file_success(mock_ai_classify):
    
    # Configura o mock para simular conteúdo válido
    mock_ai_classify.return_value = {
        "category": "Produtivo",
        "reply": "Resposta gerada por IA.",
        "model": "gemini",
        "tokens_used": None
    }

    file_content = b"Esse deve ser um documento de teste."
    filename = "document.txt"
    model_name = "gemini"
    response = client.post(
        "/process-file",
        data={"model_name": model_name},
        files={"file": (filename, file_content, "text/plain")}
    )

    assert response.status_code == 200
    assert response.json() == {
        "category": "Produtivo",
        "reply": "Resposta gerada por IA.",
        "model": "gemini",
        "tokens_used": None
    }

    # Verifica como foi chamado serviços de IA
    mock_ai_classify.assert_called_once_with("deve documento teste", "gemini")

@patch("app.routes.process_file.guess_and_extract")
def test_process_file_empty_content(mock_guess_and_extract):
    
    # Configura o mock simular conteúdo vazio
    mock_guess_and_extract.return_value = ""

    file_content = b""
    filename = "empty.txt"
    response = client.post(
        "/process-file",
        files={"file": (filename, file_content, "text/plain")}
    )

    # Verifica resposta de erro
    assert response.status_code == 400
    assert response.json() == {"detail": "Não foi possível extrair texto do arquivo."}

@patch("app.routes.process_file.ai_classify_and_reply", new_callable=AsyncMock)
def test_process_file_ai_service_error(mock_ai_classify):

    # Configura o mock para simular erro
    mock_ai_classify.side_effect = HTTPException(status_code=500, detail="Internal Server Error")

    file_content = b"Esse deve ser um documento de teste."
    filename = "document.txt"

    response = client.post(
        "/process-file",
        files={"file": (filename, file_content, "text/plain")}
    )

    assert response.status_code == 500
    assert response.json() == {"detail": "Internal Server Error"}