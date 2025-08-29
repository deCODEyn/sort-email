/** biome-ignore-all lint/style/noMagicNumbers: <dev> */
import { createContext, type ReactNode, useContext, useState } from 'react';
import type { ApiResponse } from '@/types/api-response';
import type { ResponseContextInterface } from '@/types/contex';

const ResponseContext = createContext<ResponseContextInterface | undefined>(
  undefined
);

export function ResponseProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const classifyEmail = (emailText: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (emailText.length > 5) {
        setResponse({
          category: 'Produtivo',
          suggestedResponse: 'Isso é uma resposta sugerida de teste.',
        });
        setError(null);
      } else {
        setError(
          'O texto do e-mail é muito curto. Por favor, insira mais texto.'
        );
      }
    }, 1000);
  };

  const value = {
    isLoading,
    response,
    error,
    classifyEmail,
  };

  return (
    <ResponseContext.Provider value={value}>
      {children}
    </ResponseContext.Provider>
  );
}

export function useResponseContext() {
  const context = useContext(ResponseContext);
  if (context === undefined) {
    throw new Error('useResponse deve ser usado dentro de um ResponseProvider');
  }
  return context;
}
