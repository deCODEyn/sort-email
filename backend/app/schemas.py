from pydantic import BaseModel
from typing import Optional

class ProcessRequest(BaseModel):
    text: str | None = None
    model: Optional[str] = None

class ProcessResponse(BaseModel):
    category: str
    reply: str
    tokens_used: int | None = None
    model: str | None = None