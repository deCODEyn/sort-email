import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useResponseContext } from '@/context/response-context';
import { EmailClassifier } from '@/pages/email-classifier';
import '@testing-library/jest-dom';

const LOADER_TEXT_REGEX =
  /Enviando e-mail para classificação. Por favor aguarde./i;
const EMAIL_SEND_REGEX = /Enviando e-mail/i;

// Mock dos componentes internos para isolar testes
vi.mock('@/components', async () => {
  const actual =
    await vi.importActual<typeof import('@/components')>('@/components');
  return {
    ...actual,
    EmailForm: vi.fn(() => <div data-testid="email-form" />),
    ErrorToSend: vi.fn(({ children }) => (
      <div data-testid="error-to-send">{children}</div>
    )),
    ResposnseDisplay: vi.fn(() => <div data-testid="response-display" />),
    Header: vi.fn(() => <div data-testid="header" />),
  };
});

// Mock para isolar os testes do context
vi.mock('@/context/response-context', () => ({
  useResponseContext: vi.fn(),
}));

describe('EmailClassifier', () => {
  const mockError = 'Erro de teste';
  const mockResponse = { category: 'Produtivo', reply: 'Resposta sugerida' };

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    vi.clearAllMocks();
  });

  it('deve renderizar o loader quando isLoading é true', () => {
    // Configura mock do context para isLoading
    vi.mocked(useResponseContext as Mock).mockReturnValue({
      isLoading: true,
      error: null,
      response: null,
    });
    render(<EmailClassifier />);
    // Verifica se loader aparece
    expect(screen.getByText(LOADER_TEXT_REGEX)).toBeInTheDocument();
    expect(document.querySelector('svg.lucide-loader')).toBeInTheDocument();
    // Outros compoentens não devem aparecer
    expect(screen.queryByTestId('email-form')).toBeNull();
    expect(screen.queryByTestId('error-to-send')).toBeNull();
    expect(screen.queryByTestId('response-display')).toBeNull();
  });

  it('deve renderizar EmailForm quando não está carregando', () => {
    // Configura mock do context sem isLoading
    vi.mocked(useResponseContext as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      response: null,
    });
    render(<EmailClassifier />);
    // Verifica se EmailForm aparece
    expect(screen.getByTestId('email-form')).toBeInTheDocument();
    // Não deve renderizar erro ou resposta
    expect(screen.queryByTestId('error-to-send')).toBeNull();
    expect(screen.queryByTestId('response-display')).toBeNull();
    // Loader não deve aparecer
    expect(screen.queryByText(EMAIL_SEND_REGEX)).not.toBeInTheDocument();
    expect(document.querySelector('svg.lucide-loader')).not.toBeInTheDocument();
  });

  it('deve renderizar ErrorToSend quando houver erro', () => {
    // Configura mock do context com erro
    vi.mocked(useResponseContext as Mock).mockReturnValue({
      isLoading: false,
      error: mockError,
      response: null,
    });
    render(<EmailClassifier />);
    // Verifica se EmailForm aparece
    expect(screen.getByTestId('email-form')).toBeInTheDocument();
    // Verifica se ErrorToSend aparece
    expect(screen.getByTestId('error-to-send')).toBeInTheDocument();
    expect(screen.getByText(mockError)).toBeInTheDocument();
    // Não deve renderizar resposta
    expect(screen.queryByTestId('response-display')).toBeNull();
    // Loader não deve aparecer
    expect(screen.queryByText(EMAIL_SEND_REGEX)).not.toBeInTheDocument();
    expect(document.querySelector('svg.lucide-loader')).not.toBeInTheDocument();
  });

  it('deve renderizar ResposnseDisplay quando houver resposta', () => {
    // Configura mock do context com resposta
    vi.mocked(useResponseContext as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      response: mockResponse,
    });

    render(<EmailClassifier />);
    // Verifica se EmailForm aparece
    expect(screen.getByTestId('email-form')).toBeInTheDocument();
    // Verifica se ResponseDisplay aparece
    expect(screen.getByTestId('response-display')).toBeInTheDocument();
    // Não deve renderizar erro
    expect(screen.queryByTestId('error-to-send')).toBeNull();
    // Loader não deve aparecer
    expect(screen.queryByText(EMAIL_SEND_REGEX)).not.toBeInTheDocument();
    expect(document.querySelector('svg.lucide-loader')).not.toBeInTheDocument();
  });
});
