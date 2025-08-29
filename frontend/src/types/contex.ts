import type { ApiResponse } from '@/types/api-response';

export interface ResponseContextInterface {
  classifyEmail: (emailText: string) => void;
  error: string | null;
  isLoading: boolean;
  response: ApiResponse | null;
}
