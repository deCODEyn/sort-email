import type { ApiResponse } from "@/types/api-response";

export interface ResponseContextInterface {
  classifyEmail: (payload: string | File) => void
  error: string | null;
  isLoading: boolean;
  response: ApiResponse | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>
};

export type ContextProviderType = {
  children: React.ReactElement;
};
