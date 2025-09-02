import { useState } from 'react';
import { AI_MODELS } from '@/constants';
import { useApiRequest } from '@/hooks/use-api-request';
import type { UseEmailFormReturn } from '@/types/email';

export function useEmailForm(): UseEmailFormReturn {
  const classifyEmail = useApiRequest();
  const [emailText, setEmailText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(
    AI_MODELS[0].value
  );
  const hasFile = !!file;
  const isFormValid = emailText.length > 0 || hasFile;

  const handleEmailTextChange = (text: string) => {
    if (file) {
      setFile(null);
    }
    setEmailText(text);
  };

  const handleFileChange = (newFile: File | null) => {
    if (newFile) {
      setEmailText('');
    }
    setFile(newFile);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const handleSubmit = async () => {
    if (isFormValid) {
      if (hasFile && file) {
        await classifyEmail(file, selectedModel);
      } else {
        await classifyEmail(emailText, selectedModel);
      }
    }
  };

  const clearForm = () => {
    setEmailText('');
    setFile(null);
  };

  return {
    hasFile,
    isFormValid,
    selectedModel,
    handleSubmit,
    handleEmailTextChange,
    handleFileChange,
    handleModelChange,
    clearForm,
  };
}
