from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_all_apis_failure_fallback_to_rule_based(monkeypatch):
    
    # Define chaves de API inválidas para simular fallback
    monkeypatch.setenv("GEMINI_API_KEY", "invalid_api_key")
    monkeypatch.setenv("GROQ_API_KEY", "invalid_api_key")

    request_data = {
        "text": "Teste de falha de todos os servicos de IA.",
        "model": "gemini"
    }

    response = client.post("/process-text", json=request_data)

    assert response.status_code == 200
    
    data = response.json()
    assert "category" in data
    assert "reply" in data
    assert "model" in data
    
    assert data["model"] == "rule_based_fallback"
    assert data["category"] is not None
    assert data["reply"] is not None

    # Restaura as variáveis de ambiente
    monkeypatch.undo()