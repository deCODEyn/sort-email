import pytest
import os
from fastapi.testclient import TestClient
from app.main import app
from ..conf_test import get_model_name

client = TestClient(app)

@pytest.mark.skipif(
    not os.environ.get("GROQ_API_KEY"),
    reason="Requer a chave de API do Groq para testes de integração."
)
def test_integration_process_text_with_groq_model(get_model_name):
    
    expected_model = get_model_name("groq")
    # Define os dados da requisição
    request_data = {
        "text": "Olá, estou com um problema no meu computador e preciso de ajuda.",
        "model": "groq"
    }

    response = client.post("/api/process-text", json=request_data)

    assert response.status_code == 200
    data = response.json()
    assert "category" in data
    assert "reply" in data
    assert "model" in data
    assert "tokens_used" in data
    assert data["category"] in ["Produtivo", "Improdutivo"]
    assert data["reply"] is not None
    assert data["model"] == expected_model

@pytest.mark.skipif(
    not os.environ.get("GROQ_API_KEY"),
    reason="Requer a chave de API do Groq para testes de integração."
)
def test_integration_process_file_with_groq_model(get_model_name):

    expected_model = get_model_name("groq")
    # Define os dados da requisição
    file_content = b"Este eh um documento de teste para o Groq, sobre uma agenda de reunioes."
    
    response = client.post(
        "/api/process-file",
        data={"model_name": "groq"},
        files={"file": ("test_file.txt", file_content, "text/plain")}
    )

    assert response.status_code == 200
    data = response.json()
    assert "category" in data
    assert "reply" in data
    assert "model" in data
    assert "tokens_used" in data
    assert data["category"] in ["Produtivo", "Improdutivo"]
    assert data["reply"] is not None
    assert data["model"] == expected_model