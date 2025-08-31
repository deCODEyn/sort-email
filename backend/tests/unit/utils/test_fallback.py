from app.utils.fallback import get_fallback_reply

def test_get_fallback_reply_produtivo():
    
    # Teste fallbackpara Produtivo
    category = "Produtivo"
    expected_reply = (
        "Olá! Obrigado pelo contato. Já localizei sua solicitação e estou verificando o status. "
        "Assim que tiver um retorno atualizo este chamado. Se puder, confirme o número do protocolo."
    )
    assert get_fallback_reply(category) == expected_reply

def test_get_fallback_reply_improdutivo():
    
    # Teste fallback Improdutivo
    category = "Improdutivo"
    expected_reply = (
        "Olá! Muito obrigado pela mensagem. Ficamos à disposição caso precise de algo mais."
    )
    assert get_fallback_reply(category) == expected_reply