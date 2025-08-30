import type { ApiResponse } from '@/types/api-response';

export interface ResponseContextInterface {
  error: string | null;
  isLoading: boolean;
  response: ApiResponse | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResponse: React.Dispatch<React.SetStateAction<ApiResponse | null>>;
}

export type ContextProviderType = {
  children: React.ReactElement;
};
