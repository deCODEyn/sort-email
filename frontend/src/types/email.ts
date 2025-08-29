export interface UseEmailFormReturn {
  clearForm: () => void;
  handleEmailTextChange: (text: string) => void;
  handleFileChange: (file: File | null) => void;
  emailText: string;
  file: File | null;
  isFormValid: boolean;
  hasFile: boolean;
}