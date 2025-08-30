from fastapi import APIRouter
from ..schemas import ProcessRequest, ProcessResponse

router = APIRouter()

@router.post("/process-text", response_model=ProcessResponse)
async def process_text(request: ProcessRequest):
    print("Endpoint /process-text foi acessado!")

    return {
        "category": "Teste",
        "reply": f"Teste de endpoint bem-sucedido. Modelo: {request.model}",
        "tokens_used": 0,
        "model": "teste"
    }