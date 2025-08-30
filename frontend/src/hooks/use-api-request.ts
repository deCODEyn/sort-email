import { useResponseContext } from '@/context/response-context';
import type { ApiResponse } from '@/types/api-response';

export function useApiRequest() {
  const { setError, setIsLoading, setResponse } = useResponseContext();

  const classifyEmail = async (textOrFile: string | File, model: string) => {
    setIsLoading(true);
    setResponse(null);
    setError(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    let endpoint = '';
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {},
    };
    if (textOrFile instanceof File) {
      endpoint = `${API_URL}/process-file`;
      const formData = new FormData();
      formData.append('file', textOrFile);
      formData.append('model_name', model);
      fetchOptions.body = formData;
    } else {
      endpoint = `${API_URL}/process-text`;
      fetchOptions.body = JSON.stringify({ text: textOrFile, model });
      fetchOptions.headers = { 'Content-Type': 'application/json' };
    }
    try {
      const res = await fetch(endpoint, fetchOptions);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.detail || 'Falha ao classificar o e-mail. Tente novamente.'
        );
      }
      const data: ApiResponse = await res.json();
      setResponse(data);
      return data;
    } catch (error) {
      setError((error as Error).message);
      setResponse(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return classifyEmail;
};
