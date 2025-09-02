import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { EmailForm } from '@/components';
import { AI_MODELS } from '@/constants';
import { useResponseContext } from '@/context/response-context';
import { useEmailForm } from '@/hooks/use-email-form';
import '@testing-library/jest-dom';

// Constantes para regex
const EMAIL_PLACEHOLDER_REGEX =
  /Faça o upload do e-mail ou informe ele aqui que te ajudo a classifica-lo./i;
const FILE_LABEL_REGEX = /Escolha um arquivo/i;
const MODEL_LABEL_REGEX = /Selecione o modelo de IA:/i;
const SUBMIT_EMAIL_REGEX = /Classificar e-mail/i;
const SUBMIT_FILE_REGEX = /Classificar arquivo/i;

// Mock do use-email-form para 'EmailForm' nos testes
vi.mock('@/hooks/use-email-form', () => ({
  useEmailForm: vi.fn(),
}));

// Mock para isolar os testes do context
vi.mock('@/context/response-context', () => ({
  useResponseContext: vi.fn(),
}));

// Mock do useId para evitar falhas na renderização
vi.mock('react', async () => {
  const actual: typeof import('react') = await vi.importActual('react');
  return {
    ...actual,
    useId: () => 'mocked-id',
  };
});

const mockSetError = vi.fn();
const mockHandleSubmit = vi.fn();
const mockClearForm = vi.fn();
const mockHandleEmailTextChange = vi.fn();
const mockHandleFileChange = vi.fn();
const mockHandleModelChange = vi.fn();

function createMockUseEmailForm(
  overrides: Partial<ReturnType<typeof useEmailForm>> = {}
) {
  return {
    hasFile: false,
    isFormValid: false,
    selectedModel: AI_MODELS[0].value,
    handleSubmit: mockHandleSubmit,
    handleEmailTextChange: mockHandleEmailTextChange,
    handleFileChange: mockHandleFileChange,
    handleModelChange: mockHandleModelChange,
    clearForm: mockClearForm,
    ...overrides,
  };
}

describe('EmailForm', () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    vi.clearAllMocks();
    // Configura o mock do useResponseContext
    vi.mocked(useResponseContext as Mock).mockReturnValue({
      setError: mockSetError,
    });
    // Configura o mock inicial do useEmailForm
    vi.mocked(useEmailForm as Mock).mockReturnValue(createMockUseEmailForm());
  });

  it('deve renderizar o componente com o textarea e o botão "Classificar e-mail" por padrão', () => {
    render(<EmailForm />);
    // Verifica texto correto da textarea e dos botões
    expect(
      screen.getByPlaceholderText(EMAIL_PLACEHOLDER_REGEX)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: SUBMIT_EMAIL_REGEX })
    ).toBeInTheDocument();
    expect(screen.getByText(FILE_LABEL_REGEX)).toBeInTheDocument();
  });

  it('deve chamar handleEmailTextChange ao digitar no textarea', () => {
    render(<EmailForm />);
    const textarea = screen.getByPlaceholderText(EMAIL_PLACEHOLDER_REGEX);
    const testText = 'email de teste';
    // Simula a digitação
    fireEvent.change(textarea, { target: { value: testText } });
    // Espera função do hook handleEmailTextChange com o texto correto
    expect(mockHandleEmailTextChange).toHaveBeenCalledWith(testText);
  });

  it('deve exibir o indicador de arquivo quando hasFile é verdadeiro', () => {
    // Configura o mock do hook para simular o estado de um arquivo carregado
    vi.mocked(useEmailForm as Mock).mockReturnValue(
      createMockUseEmailForm({ hasFile: true, isFormValid: true })
    );
    render(<EmailForm />);
    // Verifica mensagem de arquivo e botão mudam
    expect(
      screen.getByText('Arquivo pronto para ser classificado.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: SUBMIT_FILE_REGEX })
    ).toBeInTheDocument();
  });

  it('deve chamar handleFileChange ao selecionar um arquivo', () => {
    render(<EmailForm />);
    const fileInput = screen.getByLabelText(FILE_LABEL_REGEX, {
      selector: 'input',
    });
    const testFile = new File(['conteúdo'], 'test.txt', { type: 'text/plain' });
    // Simula seleção de arquivo
    fireEvent.change(fileInput, { target: { files: [testFile] } });
    // Espera função do hook handleDileChange
    expect(mockHandleFileChange).toHaveBeenCalledWith(testFile);
  });

  it('deve chamar handleModelChange ao selecionar um modelo', () => {
    render(<EmailForm />);
    const modelSelect = screen.getByLabelText(MODEL_LABEL_REGEX);
    const testModel = AI_MODELS[1].value;
    // Simula mudança de modelo
    fireEvent.change(modelSelect, { target: { value: testModel } });
    // Espera função do hook handleModelChange com modelo correto
    expect(mockHandleModelChange).toHaveBeenCalledWith(testModel);
  });

  it('não deve submeter o formulário se for inválido e deve exibir um erro', () => {
    render(<EmailForm />);
    const submitButton = screen.getByRole('button', {
      name: SUBMIT_EMAIL_REGEX,
    });
    // Simula clique no botão sem texto ou arquivo
    fireEvent.click(submitButton);
    // Espera setError ser chamado
    expect(mockSetError).toHaveBeenCalledWith(
      'Por favor, cole um texto ou selecione um arquivo para continuar.'
    );
    // Valida que handleSubmit não seja chamado
    expect(mockHandleSubmit).not.toHaveBeenCalled();
    // Valida que clearForm não seja chamado
    expect(mockClearForm).not.toHaveBeenCalled();
  });

  it('deve submeter o formulário se for válido e limpar o estado', () => {
    // Configura o mock do hook para simular um formulário válido
    vi.mocked(useEmailForm as Mock).mockReturnValue(
      createMockUseEmailForm({ isFormValid: true })
    );
    render(<EmailForm />);
    const submitButton = screen.getByRole('button', {
      name: SUBMIT_EMAIL_REGEX,
    });
    // Simula clique no botão
    fireEvent.click(submitButton);
    // Espera setError ser chamado e limpar erros
    expect(mockSetError).toHaveBeenCalledWith(null);
    // Espera que as funções do hook sejam chamadas
    expect(mockHandleSubmit).toHaveBeenCalled();
    expect(mockClearForm).toHaveBeenCalled();
  });
});
