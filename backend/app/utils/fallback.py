def get_fallback_reply(category: str) -> str:
  if category == "Produtivo":
      return (
          "Olá! Obrigado pelo contato. Já localizei sua solicitação e estou verificando o status. "
          "Assim que tiver um retorno atualizo este chamado. Se puder, confirme o número do protocolo."
      )
  else:
      return (
          "Olá! Muito obrigado pela mensagem. Ficamos à disposição caso precise de algo mais."
      )
