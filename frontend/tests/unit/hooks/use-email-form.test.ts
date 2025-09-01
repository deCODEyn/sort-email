import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useResponseContext } from '@/context/response-context';
import { useEmailForm } from '@/hooks/use-email-form';

// Mock do 'use-api-request' para 'useEmailForm' nos testes
const mockClassifyEmail = vi.fn();
vi.mock('@/hooks/use-api-request', () => ({
  useApiRequest: () => mockClassifyEmail,
}));

// Mock para isolar os testes do context
vi.mock('@/context/response-context', () => ({
  useResponseContext: vi.fn(),
}));

// Mock da constante AI_MODELS
const { MOCKED_AI_MODELS } = vi.hoisted(() => {
  const MOCKED_AI_MODELS = [
    { value: 'default-model', label: 'Default Model' },
    { value: 'another-model', label: 'Another Model' },
  ];
  return {
    MOCKED_AI_MODELS,
  };
});
vi.mock('@/constants', () => ({
  AI_MODELS: MOCKED_AI_MODELS,
}));

describe('useEmailForm', () => {
  // Mocks do contexto
  const mockSetError = vi.fn();
  const mockSetIsLoading = vi.fn();
  const mockSetResponse = vi.fn();

  beforeEach(() => {
    // Configura o mock antes de cada teste
    vi.clearAllMocks();
    vi.mocked(useResponseContext as Mock).mockReturnValue({
      setError: mockSetError,
      setIsLoading: mockSetIsLoading,
      setResponse: mockSetResponse,
    });
  });

  it('deve retornar o estado inicial correto', () => {
    const { result } = renderHook(() => useEmailForm());
    // Verifica se os valores iniciais correspondem ao esperado
    expect(result.current.hasFile).toBe(false);
    expect(result.current.isFormValid).toBe(false);
    expect(result.current.selectedModel).toBe(MOCKED_AI_MODELS[0].value);
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.handleEmailTextChange).toBe('function');
    expect(typeof result.current.handleFileChange).toBe('function');
    expect(typeof result.current.handleModelChange).toBe('function');
    expect(typeof result.current.clearForm).toBe('function');
  });

  it('deve atualizar o emailText e deixar hasFile false', () => {
    const { result } = renderHook(() => useEmailForm());
    const testText = 'email de teste';
    // Simula digitação no formulário
    act(() => {
      result.current.handleEmailTextChange(testText);
    });
    // Verifica isFormValid é true e hasFile é false
    expect(result.current.hasFile).toBe(false);
    expect(result.current.isFormValid).toBe(true);
  });

  it('deve atualizar o arquivo e deixar hasFile true', () => {
    const { result } = renderHook(() => useEmailForm());
    const testFile = new File(['conteúdo'], 'test.txt', { type: 'text/plain' });
    // Simula o upload de arquivo
    act(() => {
      result.current.handleFileChange(testFile);
    });
    // Verifica isFormValid é true e hasFile é true
    expect(result.current.hasFile).toBe(true);
    expect(result.current.isFormValid).toBe(true);
  });

  it('deve atualizar o selectedModel', () => {
    const { result } = renderHook(() => useEmailForm());
    const testModel = 'another-model';
    // Simula mudança do modelo no select
    act(() => {
      result.current.handleModelChange(testModel);
    });
    expect(result.current.selectedModel).toBe(testModel);
  });

  it('deve chamar classifyEmail com texto e modelo corretos quando um texto é fornecido', async () => {
    const { result } = renderHook(() => useEmailForm());
    const testText = 'email de teste';
    const testModel = 'default-model'
    // Configura formulário para ter texto e modelo
    act(() => {
      result.current.handleEmailTextChange(testText);
      result.current.handleModelChange(testModel);
    });
    // Submete o formulário e valida a função com os argumentos esperados
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(mockClassifyEmail).toHaveBeenCalledWith(testText, testModel);
  });

  it('deve chamar classifyEmail com arquivo e modelo corretos quando um arquivo é fornecido', async () => {
    const { result } = renderHook(() => useEmailForm());
    const testFile = new File(['conteúdo'], 'test.txt', { type: 'text/plain' });
    const testModel = 'default-model'
    // Configura formulário para ter arquivo e modelo
    act(() => {
      result.current.handleFileChange(testFile);
      result.current.handleModelChange(testModel);
    });
    // Submete o formulário e valida a função com os argumentos esperados
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(mockClassifyEmail).toHaveBeenCalledWith(testFile, testModel);
  });

  it('não deve chamar classifyEmail se o formulário for inválido', async () => {
    const { result } = renderHook(() => useEmailForm());
    // Submete formulário com estado inválido
    await act(async () => {
      await result.current.handleSubmit();
    });
    // Verifica se a função não é chamada
    expect(mockClassifyEmail).not.toHaveBeenCalled();
  });

  it('deve limpar o formulário e redefinir o estado', () => {
    const { result } = renderHook(() => useEmailForm());
    const testText = 'email de teste';
    const testFile = new File(['conteúdo'], 'test.txt', { type: 'text/plain' });
    // Configura formulário com texto e arquivo
    act(() => {
      result.current.handleEmailTextChange(testText);
      result.current.handleFileChange(testFile);
    });
    // Limpa o formulário e verifica o estado
    act(() => {
      result.current.clearForm();
    });
    // Verifica se o estado foi redefinido
    expect(result.current.hasFile).toBe(false);
    expect(result.current.isFormValid).toBe(false);
    expect(result.current.selectedModel).toBe(MOCKED_AI_MODELS[0].value);
  });
});
