from fastapi import APIRouter
from ..schemas import ProcessRequest, ProcessResponse

router = APIRouter()

@router.post("/process-text", response_model=ProcessResponse)
async def process_text(request: ProcessRequest):
    print("Endpoint /process-text foi acessado!")

    return {
        "category": "Teste",
        "reply": "Teste de endpoint bem-sucedido.",
        "tokens_used": 0,
        "model": "teste"
    }