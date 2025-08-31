import json
import re
from typing import Dict, Any


def strict_parse_json(content: str) -> Dict[str, Any]:
    if not content or not content.strip():
        raise Exception("Resposta recebida do modelo está vazia.")

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                raise Exception("Bloco JSON encontrado mas inválido.")

        raise Exception("Nenhum JSON válido encontrado na resposta.")
