import io
import re
from nltk.corpus import stopwords
from pypdf import PdfReader
from docx import Document

#Acessa o set de stopwords que foi baixado no Dockerfile
STOPWORDS_PTBR = set(stopwords.words('portuguese'))

PRODUCTIVE_KEYWORDS = {
    "status","andamento","suporte","erro","problema","chamado","ticket","atualização",
    "atualizacao","anexo","contrato","fatura","boleto","pagamento","acesso","senha",
    "cadastro","agendamento","documento","urgente","prazo","retorno"
}

def clean_text(text: str) -> str:
    text = text or ""
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def remove_stopwords(text: str) -> str:
    tokens = re.findall(r"\b[\wáàâãéêíóôõúç]+\b", text.lower(), flags=re.UNICODE)
    return " ".join(token for token in tokens if token not in STOPWORDS_PTBR)

def rule_based_category(text: str) -> str:
    lowered = text.lower()
    score = sum(1 for acc in PRODUCTIVE_KEYWORDS if acc in lowered)
    return "Produtivo" if score >= 1 else "Improdutivo"

def extract_text_from_pdf(file_bytes: bytes) -> str:
    pdf = PdfReader(io.BytesIO(file_bytes))
    return "\n".join(page.extract_text() or "" for page in pdf.pages)

def extract_text_from_docx(file_bytes: bytes) -> str:
    file = io.BytesIO(file_bytes)
    document = Document(file)
    return "\n".join(paragraph.text for paragraph in document.paragraphs)

def guess_and_extract(filename: str, content: bytes) -> str:
    name = (filename or "").lower()
    if name.endswith(".pdf"):
        return extract_text_from_pdf(content)
    if name.endswith(".docx"):
        return extract_text_from_docx(content)
    try:
        return content.decode("utf-8", errors="ignore")
    except Exception:
        return ""