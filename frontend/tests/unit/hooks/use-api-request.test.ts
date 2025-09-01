import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useResponseContext } from '@/context/response-context';
import { useApiRequest } from '@/hooks/use-api-request';

// Mock para isolar os testes do hook
vi.mock('@/context/response-context', () => ({
  useResponseContext: vi.fn(),
}));
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useApiRequest', () => {
  // Mocks o contexto
  const mockSetError = vi.fn();
  const mockSetIsLoading = vi.fn();
  const mockSetResponse = vi.fn();

  const text_fetch = 'Texto simples para teste da use-api-request';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  beforeEach(() => {
    // Configura o mock antes de cada teste
    vi.clearAllMocks();
    vi.mocked(useResponseContext as Mock).mockReturnValue({
      setError: mockSetError,
      setIsLoading: mockSetIsLoading,
      setResponse: mockSetResponse,
    });
  });

  it('deve chamar a API com texto e atualizar o context corretamente em caso de sucesso', async () => {
    // Configura mock para simular resposta de sucesso com texto
    const mockApiResponse = { result: 'test_category', emails_count: 5 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });
    // Instância do hook e chamada de função
    const classifyEmail = useApiRequest();
    const result = await classifyEmail(text_fetch, 'test_model');
    // Comportamento esperado
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetResponse).toHaveBeenCalledWith(null);
    expect(mockSetError).toHaveBeenCalledWith(null);
    // Verificar chamada 'fetch'
    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/process-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text_fetch,
        model: 'test_model',
      }),
    });
    // VALIDA CHAMADA AO CONTEXT APÓS REQUEST
    // Verifica se response foi informado
    expect(mockSetResponse).toHaveBeenCalledWith(mockApiResponse);
    expect(result).toEqual(mockApiResponse);
    // Verifica isLoading foi desativado
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    // Verifica se estado de erro permanece null
    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it('deve chamar a API com arquivo e atualizar o context corretamente em caso de sucesso', async () => {
    // Configura mock para simular resposta de sucesso com arquivo
    const mockApiResponse = { result: 'test_file_category', emails_count: 10 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });
    const mockFile = new File(['test file content'], 'test.txt', {
      type: 'text/plain',
    });
    // Instância do hook e chamada de função
    const classifyEmail = useApiRequest();
    const result = await classifyEmail(mockFile, 'test_model');
    // Comportamento esperado
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetResponse).toHaveBeenCalledWith(null);
    expect(mockSetError).toHaveBeenCalledWith(null);
    // Verificar chamada 'fetch'
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL}/process-file`,
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );
    // VALIDA CHAMADA AO CONTEXT APÓS REQUEST
    // Verifica se response foi informado
    expect(mockSetResponse).toHaveBeenCalledWith(mockApiResponse);
    expect(result).toEqual(mockApiResponse);
    // Verifica isLoading foi desativado
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    // Verifica se estado de erro permanece null
    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it('deve atualizar o estado de erro para erros de rede', async () => {
    // Configurar mock para simular erro de rede
    const mockErrorMessage = 'Failed to fetch';
    mockFetch.mockRejectedValueOnce(new Error(mockErrorMessage));
    // Instância do hook e chamada de função
    const classifyEmail = useApiRequest();
    const result = await classifyEmail(text_fetch, 'test_model');
    // Comportamento esperado
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetResponse).toHaveBeenCalledWith(null);
    expect(mockSetError).toHaveBeenCalledWith(null);
    // Verificar chamada 'fetch'
    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/process-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text_fetch,
        model: 'test_model',
      }),
    });
    // VALIDA CHAMADA AO CONTEXT APÓS REQUEST
    // Verificar se o estado de erro foi atualizado
    expect(mockSetError).toHaveBeenCalledWith(mockErrorMessage);
    // Verifica isLoading foi desativado
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    // Verifica se estado de resposta permanece null
    expect(mockSetResponse).toHaveBeenCalledWith(null);
    expect(result).toBeNull();
  });

  it('deve lidar com JSON mal-formatado em resposta de sucesso', async () => {
    // Configura mock para simular resposta de sucesso com JSON inválido
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.reject(
          new Error('SyntaxError: Unexpected token < in JSON at position 0')
        ),
    });
    // Instância do hook e chamada de função
    const classifyEmail = useApiRequest();
    const result = await classifyEmail(text_fetch, 'test_model');
    // Comportamento esperado
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetResponse).toHaveBeenCalledWith(null);
    expect(mockSetError).toHaveBeenCalledWith(null);
    // Verificar chamada 'fetch'
    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/process-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text_fetch,
        model: 'test_model',
      }),
    });
    // VALIDA CHAMADA AO CONTEXT APÓS REQUEST
    // Verificar se o estado de erro foi atualizado
    expect(mockSetError).toHaveBeenCalledWith(
      'SyntaxError: Unexpected token < in JSON at position 0'
    );
    // Verifica isLoading foi desativado
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    // Verifica se estado de resposta permanece null
    expect(mockSetResponse).toHaveBeenCalledWith(null);
    expect(result).toBeNull();
  });

  it('deve usar o URL de fallback se VITE_API_URL não estiver definido', async () => {
    // Configura a variável de ambiente como undefined
    vi.stubGlobal('import.meta.env', { VITE_API_URL: undefined });
    // Configura mock para simular resposta de sucesso com texto
    const mockApiResponse = { result: 'test_category', emails_count: 5 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });
    // Instância do hook e chamada de função
    const classifyEmail = useApiRequest();
    const result = await classifyEmail(text_fetch, 'test_model');
    // Comportamento esperado
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetResponse).toHaveBeenCalledWith(null);
    expect(mockSetError).toHaveBeenCalledWith(null);
    // Verificar se o fetch usou o URL de fallback
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/process-text',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text_fetch,
          model: 'test_model',
        }),
      }
    );
    // VALIDA CHAMADA AO CONTEXT APÓS REQUEST
    // Verifica se response foi informado
    expect(mockSetResponse).toHaveBeenCalledWith(mockApiResponse);
    expect(result).toEqual(mockApiResponse);
    // Verifica isLoading foi desativado
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    // Verifica se estado de erro permanece null
    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it('deve resetar o estado do contexto em chamadas múltiplas', async () => {
    // Configura mock para simular multiplas chamadas
    const mockApiResponse1 = { result: 'first_call', emails_count: 1 };
    const mockApiResponse2 = { result: 'second_call', emails_count: 2 };
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse1),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse2),
      });
    // Instância do hook e chamada de função
    const classifyEmail = useApiRequest();
    // Primeira chamada
    const result1 = await classifyEmail('primeiro texto', 'model1');
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetResponse).toHaveBeenCalledWith(null);
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    // Verificar chamada 'fetch'
    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/process-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'primeiro texto',
        model: 'model1',
      }),
    });
    // VALIDA CHAMADA AO CONTEXT APÓS REQUEST 1
    // Verifica se response foi informado
    expect(mockSetResponse).toHaveBeenCalledWith(mockApiResponse1);
    expect(result1).toEqual(mockApiResponse1);
    // Verifica isLoading foi desativado
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    // Verifica se estado de erro permanece null
    expect(mockSetError).toHaveBeenCalledWith(null);
    // RESETA MOCK PARA SEGUNDA CHAMADA
    vi.clearAllMocks();
    // Segunda chamada
    const result2 = await classifyEmail('segundo texto', 'model2');
    // Verifica se o estado foi resetado no início da segunda chamada
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetResponse).toHaveBeenCalledWith(null);
    expect(mockSetError).toHaveBeenCalledWith(null);
    // Verificar chamada 'fetch2'
    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/process-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'segundo texto',
        model: 'model2',
      }),
    });
    // VALIDA CHAMADA AO CONTEXT APÓS REQUEST 2
    // Verifica se response foi informado
    expect(mockSetResponse).toHaveBeenCalledWith(mockApiResponse2);
    expect(result2).toEqual(mockApiResponse2);
    // Verifica isLoading foi desativado
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    // Verifica se estado de erro permanece null
    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it('deve atualizar o estado de erro em caso de falha da API', async () => {
    // Configura mock para simular API offline
    const mockErrorData = {
      detail: 'API is down',
    };
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockErrorData),
    });
    // Instância do hook e chamada de função
    const classifyEmail = useApiRequest();
    const result = await classifyEmail(text_fetch, 'test_model');
    // Comportamento esperado
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetResponse).toHaveBeenCalledWith(null);
    expect(mockSetError).toHaveBeenCalledWith(null);
    // Verificar chamada 'fetch'
    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/process-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text_fetch,
        model: 'test_model',
      }),
    });
    // VALIDA CHAMADA AO CONTEXT APÓS REQUEST
    // Verificar se o estado de erro foi atualizado
    expect(mockSetError).toHaveBeenCalledWith('API is down');
    // Verifica isLoading foi desativado
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    // Verifica se estado de resposta permanece null
    expect(mockSetResponse).toHaveBeenCalledWith(null);
    expect(result).toBeNull();
  });
});
