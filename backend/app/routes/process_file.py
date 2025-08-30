from fastapi import APIRouter, UploadFile, File, Form
from ..schemas import ProcessResponse

router = APIRouter()

@router.post("/process-file", response_model=ProcessResponse)
async def process_file(
    file: UploadFile = File(...),
    model_name: str = Form("gemini-1.5-pro")
):
    print(f"Endpoint /process-file foi acessado com o arquivo: {file.filename}")

    return {
        "category": "Teste",
        "reply": f"Teste com o arquivo {file.filename} bem-sucedido.",
        "tokens_used": 0,
        "model": "teste"
    }