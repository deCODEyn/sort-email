from unittest.mock import patch, MagicMock
from app.utils.nlp import (
    clean_text,
    remove_stopwords,
    rule_based_category,
    extract_text_from_pdf,
    extract_text_from_docx,
    guess_and_extract,
    PRODUCTIVE_KEYWORDS
)

# Testes clean_text
def test_clean_text_multiple_spaces():
    # Revove espaços extras
    text = "  Olá,  mundo!  "
    assert clean_text(text) == "Olá, mundo!"

def test_clean_text_no_change():
    # Não altera textos
    text = "Olá, mundo!"
    assert clean_text(text) == "Olá, mundo!"

def test_clean_text_empty_string():
    # Retorno de string vazia
    assert clean_text("") == ""

# Testes remove_stopwords
def test_remove_stopwords_with_stopwords():
    # Remove stopwords e pontuação
    text = "Um e-mail de teste para você. Olá, como vai?"
    expected = "mail teste olá vai"
    assert remove_stopwords(text) == expected

def test_remove_stopwords_no_stopwords():
    # Valida se altera textos sem stopwords
    text = "banana maçã laranja"
    assert remove_stopwords(text) == "banana maçã laranja"
    
def test_remove_stopwords_empty_string():
    # Retorno de string vazia
    assert remove_stopwords("") == ""

# Testes rule_based_category
def test_rule_based_category_productive():
    # Valida regras para Produtivo
    text = "Acompanhamento do status do ticket."
    assert rule_based_category(text) == "Produtivo"

def test_rule_based_category_improdutivo():
    # Valida regras para Improdutivo
    text = "Olá, tudo bem? Como foi seu final de semana?"
    assert rule_based_category(text) == "Improdutivo"

def test_rule_based_category_case_insensitivity():
    # Validação de case-insensitive
    text = "O Status DO SEU CHAMADO foi atualizado."
    assert rule_based_category(text) == "Produtivo"

# Testes de extração de texto
@patch("app.utils.nlp.PdfReader", autospec=True)
def test_extract_text_from_pdf(mock_pdf_reader):
    # Teste de extração de PDF
    mock_page = MagicMock()
    mock_page.extract_text.return_value = "Texto do PDF."
    mock_pdf = MagicMock()
    mock_pdf.pages = [mock_page]
    mock_pdf_reader.return_value = mock_pdf

    file_bytes = b"dummy_pdf_content"
    extracted_text = extract_text_from_pdf(file_bytes)
    
    assert extracted_text == "Texto do PDF."
    mock_pdf_reader.assert_called_once()

@patch("app.utils.nlp.Document", autospec=True)
def test_extract_text_from_docx(mock_docx_document):
    # Teste extração de DOCX
    mock_paragraph = MagicMock()
    mock_paragraph.text = "Texto do DOCX."
    mock_document = MagicMock()
    mock_document.paragraphs = [mock_paragraph]
    mock_docx_document.return_value = mock_document

    file_bytes = b"dummy_docx_content"
    extracted_text = extract_text_from_docx(file_bytes)
    
    assert extracted_text == "Texto do DOCX."
    mock_docx_document.assert_called_once()

# Testes guess_and_extract
@patch("app.utils.nlp.extract_text_from_pdf")
def test_guess_and_extract_pdf(mock_extract_pdf):
    # Testa chamada de PDF
    mock_extract_pdf.return_value = "Texto de PDF"
    filename = "documento.pdf"
    content = b"pdf_content"
    
    text = guess_and_extract(filename, content)
    
    assert text == "Texto de PDF"
    mock_extract_pdf.assert_called_once_with(content)

@patch("app.utils.nlp.extract_text_from_docx")
def test_guess_and_extract_docx(mock_extract_docx):
   # Teste chama DOCX
    mock_extract_docx.return_value = "Texto de DOCX"
    filename = "relatorio.docx"
    content = b"docx_content"
    
    text = guess_and_extract(filename, content)
    
    assert text == "Texto de DOCX"
    mock_extract_docx.assert_called_once_with(content)

def test_guess_and_extract_plain_text():
    # Testa decodificação simples
    filename = "arquivo.txt"
    content = b"Este e um texto simples."
    
    text = guess_and_extract(filename, content)
    
    assert text == "Este e um texto simples."

def test_guess_and_extract_unknown_type():
    # Teste com extenções desconhecidas.
    filename = "image.jpg"
    content = b"conteudo_da_imagem"
    
    text = guess_and_extract(filename, content)
    
    assert text == "conteudo_da_imagem"
