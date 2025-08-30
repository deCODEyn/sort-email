from fastapi import APIRouter, HTTPException
from ..schemas import ProcessRequest, ProcessResponse
from ..utils.nlp import clean_text, remove_stopwords
from ..services.ai_service import ai_classify_and_reply

router = APIRouter()

@router.post("/process-text", response_model=ProcessResponse)
async def process_text(request: ProcessRequest):
    cleaned_text = clean_text(request.text or "")
    
    if not cleaned_text.strip():
        raise HTTPException(status_code=400, detail="Não foi validar o texto do seu e-mail.")
    
    processed_text = remove_stopwords(cleaned_text)
    result = await ai_classify_and_reply(processed_text, request.model)

    
    return ProcessResponse(
        category=result["category"],
        reply=result["reply"],
        tokens_used=result.get("tokens_used"),
        model=result.get("model"),
    )