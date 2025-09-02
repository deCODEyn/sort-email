import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorToSend } from '@/components/error-to-send';
import '@testing-library/jest-dom';

describe('ErrorToSend', () => {
  it('deve renderizar corretamente o conteúdo passado como children', () => {
    const errorText = 'Ocorreu um erro ao enviar.';
    render(
      <ErrorToSend>
        <span>{errorText}</span>
      </ErrorToSend>
    );
    // Verifica se o conteúdo do children está presente
    expect(screen.getByText(errorText)).toBeInTheDocument();
  });

  it('deve aplicar as classes de estilo corretas', () => {
    render(
      <ErrorToSend>
        <span>Erro de teste</span>
      </ErrorToSend>
    );
    const container = screen.getByText('Erro de teste').parentElement;
    // Valida se tem as classes do componente erro
    expect(container).toHaveClass(
      'rounded-xl',
      'border',
      'border-red-400',
      'bg-red-100',
      'p-4',
      'text-red-700',
      'text-sm',
      'dark:bg-red-900',
      'dark:text-red-200'
    );
  });
});
