from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ..schemas import ProcessResponse
from ..utils.nlp import clean_text, guess_and_extract, remove_stopwords
from ..services.ai_service import ai_classify_and_reply

router = APIRouter()

@router.post("/process-file", response_model=ProcessResponse)
async def process_file(
    file: UploadFile = File(...),
    model_name: str = Form("gemini-2.5-flas")
):
    content = await file.read()
    text = guess_and_extract(file.filename, content)
    cleaned_text = clean_text(text or "")
    
    if not cleaned_text.strip():
        raise HTTPException(status_code=400, detail="Não foi possível extrair texto do arquivo.")
    
    processed_text = remove_stopwords(cleaned_text)
    result = await ai_classify_and_reply(processed_text, model_name)

    return ProcessResponse(
        category=result["category"],
        reply=result["reply"],
        tokens_used=result.get("tokens"),
        model=result.get("model"),
    )
