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

  const value = {
    response,
    setResponse,
    error,
    setError,
    isLoading,
    setIsLoading,
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
