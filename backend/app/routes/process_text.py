from fastapi import APIRouter, HTTPException
from app.schemas import ProcessRequest, ProcessResponse
from app.utils.nlp import clean_text, remove_stopwords
from app.services.ai_service import ai_classify_and_reply

router = APIRouter()

@router.post("/process-text", response_model=ProcessResponse)
async def process_text(request: ProcessRequest):
    cleaned_text = clean_text(request.text or "")
    
    if not cleaned_text.strip():
        raise HTTPException(status_code=400, detail="Não foi possível validar o texto do e-mail.")
    
    processed_text = remove_stopwords(cleaned_text)
    result = await ai_classify_and_reply(processed_text, request.model)

    
    return ProcessResponse(
        category=result["category"],
        reply=result["reply"],
        tokens_used=result.get("tokens_used"),
        model=result.get("model"),
    )