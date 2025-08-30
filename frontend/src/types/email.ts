export interface UseEmailFormReturn {
  clearForm: () => void;
  handleEmailTextChange: (text: string) => void;
  handleFileChange: (file: File | null) => void;
  handleModelChange: (model: string) => void;
  handleSubmit: () => Promise<void>;
  isFormValid: boolean;
  hasFile: boolean;
  selectedModel: string;
}
