/** biome-ignore-all lint/style/noMagicNumbers: <dev> */
import { createContext, useContext, useState } from 'react';
import type { ApiResponse } from '@/types/api-response';
import type {
  ContextProviderType,
  ResponseContextInterface,
} from '@/types/contex';

const ResponseContext = createContext<ResponseContextInterface | undefined>(
  undefined
);

export const ResponseProvider = ({ children }: ContextProviderType) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const classifyEmail = (payload: string | File) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (payload) {
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
    setError,
  };

  return (
    <ResponseContext.Provider value={value}>
      {children}
    </ResponseContext.Provider>
  );
};

export function useResponseContext() {
  const context = useContext(ResponseContext);
  if (context === undefined) {
    throw new Error('useResponse deve ser usado dentro de um ResponseProvider');
  }
  return context;
}
