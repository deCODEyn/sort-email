import { useState } from 'react';
import type { UseEmailFormReturn } from '@/types/email';

export function useEmailForm(): UseEmailFormReturn {
  const [emailText, setEmailText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
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

  const clearForm = () => {
    setEmailText('');
    setFile(null);
  };

  return {
    emailText,
    file,
    hasFile,
    isFormValid,
    handleEmailTextChange,
    handleFileChange,
    clearForm,
  };
}
