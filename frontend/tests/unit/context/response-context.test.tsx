import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ResponseProvider,
  useResponseContext,
} from '@/context/response-context';
import type { ApiResponse } from '@/types/api-response';

describe('ResponseContext', () => {
  it('deve lançar erro se useResponseContext for usado fora do provider', () => {
    // Espera erro ao chamar o hook sem provider
    expect(() => renderHook(() => useResponseContext())).toThrowError(
      'useResponse deve ser usado dentro de um ResponseProvider'
    );
  });

  it('deve fornecer valores iniciais corretos via ResponseProvider', () => {
    const { result } = renderHook(() => useResponseContext(), {
      wrapper: ({ children }) => (
        <ResponseProvider>{children}</ResponseProvider>
      ),
    });
    // Valores iniciais
    expect(result.current.isLoading).toBe(false);
    expect(result.current.response).toBeNull();
    expect(result.current.error).toBeNull();
    expect(typeof result.current.setIsLoading).toBe('function');
    expect(typeof result.current.setResponse).toBe('function');
    expect(typeof result.current.setError).toBe('function');
  });

  it('deve atualizar estado corretamente usando setters', () => {
    const { result } = renderHook(() => useResponseContext(), {
      wrapper: ({ children }) => (
        <ResponseProvider>{children}</ResponseProvider>
      ),
    });
    const mockResponse: ApiResponse = {
      category: 'Produtivo',
      reply: 'Resposta automática',
    };
    // Simula atualização dos estados
    act(() => {
      result.current.setIsLoading(true);
      result.current.setError('Erro de teste');
      result.current.setResponse(mockResponse);
    });
    // Verifica se os estados foram atualizados
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe('Erro de teste');
    expect(result.current.response).toEqual(mockResponse);
  });
});
