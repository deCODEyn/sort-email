import pytest
from app.utils.parser import strict_parse_json

def test_strict_parse_json_valid_json():
    """Testa JSON válido."""
    json_string = '{"category": "Produtivo", "reply": "Teste de resposta."}'
    expected_dict = {"category": "Produtivo", "reply": "Teste de resposta."}
    assert strict_parse_json(json_string) == expected_dict

def test_strict_parse_json_invalid_json_raises_error():
    """Testa exceção com JSON inválido."""
    invalid_string = "Este não é um JSON válido."
    with pytest.raises(Exception, match="Nenhum JSON válido encontrado na resposta."):
        strict_parse_json(invalid_string)

def test_strict_parse_json_json_within_text():
    """Testa JSON válido dentro de string."""
    text_with_json = 'O modelo respondeu com o seguinte JSON: {"category": "Improdutivo", "reply": "Teste."} Fim da resposta.'
    expected_dict = {"category": "Improdutivo", "reply": "Teste."}
    assert strict_parse_json(text_with_json) == expected_dict

def test_strict_parse_json_empty_string_raises_error():
    """Testa exceção para string vazia."""
    with pytest.raises(Exception, match="Resposta recebida do modelo está vazia."):
        strict_parse_json("")

def test_strict_parse_json_invalid_json_within_text_raises_error():
    """Testa exceção para JSON inválido."""
    text_with_invalid_json = 'O modelo respondeu com o seguinte JSON: {"category": "Improdutivo", "reply": "Teste.", } Fim da resposta.'
    with pytest.raises(Exception, match="Bloco JSON encontrado mas inválido."):
        strict_parse_json(text_with_invalid_json)