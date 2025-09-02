import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { ResposnseDisplay } from '@/components';
import { useResponseContext } from '@/context/response-context';
import '@testing-library/jest-dom';

// Mock para isolar os testes do context
vi.mock('@/context/response-context', () => ({
  useResponseContext: vi.fn(),
}));

describe('ResposnseDisplay', () => {
  const mockResponse = { category: 'Produtivo', reply: 'Texto de resposta' };

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    vi.clearAllMocks();
    // Mock padrão do contexto
    vi.mocked(useResponseContext as Mock).mockReturnValue({
      response: mockResponse,
    });
  });

  it('deve renderizar corretamente a categoria e a resposta', () => {
    render(<ResposnseDisplay />);
    // Verifica se a categoria é exibida corretamente
    expect(screen.getByText(mockResponse.category)).toBeInTheDocument();
    // Verifica se a resposta é exibida corretamente
    expect(screen.getByText(mockResponse.reply)).toBeInTheDocument();
  });

  it('deve aplicar a cor verde para categoria "Produtivo"', () => {
    render(<ResposnseDisplay />);
    const categorySpan = screen.getByText(mockResponse.category);
    // Valida se cor verde foi aplicada
    expect(categorySpan).toHaveClass('text-green-500', 'dark:text-green-300');
  });

  it('deve aplicar a cor vermelha para categorias não produtivas', () => {
    // Mock do contexto com categoria diferente
    vi.mocked(useResponseContext as Mock).mockReturnValue({
      response: { category: 'Improdutivo', reply: 'Resposta qualquer' },
    });
    render(<ResposnseDisplay />);
    const categorySpan = screen.getByText('Improdutivo');
    // Valida se cor vermelha foi aplicada
    expect(categorySpan).toHaveClass('text-red-500', 'dark:text-red-300');
  });

  it('deve lidar com ausência de resposta sem quebrar o componente', () => {
    // Mock do contexto sem resposta
    vi.mocked(useResponseContext as Mock).mockReturnValue({ response: null });
    render(<ResposnseDisplay />);
    // Valida se ainda renderiza os elementos principais
    expect(screen.getByText('Categoria:')).toBeInTheDocument();
    expect(screen.getByText('Resposta Sugerida:')).toBeInTheDocument();
  });
});
