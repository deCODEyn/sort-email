from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import process_text, process_file
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Sort Email API", version="0.1.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://sort-email.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(process_text.router, prefix="/api")
app.include_router(process_file.router, prefix="/api")