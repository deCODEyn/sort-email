import { FileText } from 'lucide-react';
import { useId } from 'react';
import { AI_MODELS } from '@/constants';
import { useResponseContext } from '@/context/response-context';
import { useEmailForm } from '@/hooks/use-email-form';

export function EmailForm() {
  const { setError } = useResponseContext();
  const {
    hasFile,
    isFormValid,
    selectedModel,
    handleEmailTextChange,
    handleFileChange,
    handleSubmit,
    handleModelChange,
    clearForm,
  } = useEmailForm();
  const emailId = useId();
  const fileId = useId();

  const onSubmit = () => {
    setError(null);
    if (!isFormValid) {
      setError(
        'Por favor, cole um texto ou selecione um arquivo para continuar.'
      );
      return;
    }
    handleSubmit();
    clearForm();
  };

  return (
    <div className="my-5 mb-8 gap-4">
      <div className="my-4 flex flex-col md:flex-row-reverse">
        <div className="-mt-8 flex items-center justify-end md:w-1/3">
          <label className="sr-only" htmlFor="model-select">
            Selecione o modelo de IA:
          </label>
          <select
            className="mb-2 rounded-xl border border-gray-300 bg-gray-50 p-2 text-gray-900 text-sm outline-none transition duration-200 focus:border-green-500 focus:ring-2 md:mb-0 dark:border-gray-300 dark:bg-gray-700 dark:text-gray-100"
            id="model-select"
            onChange={(e) => handleModelChange(e.target.value)}
            value={selectedModel}
          >
            {AI_MODELS.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:w-2/3">
          <label
            className="block font-medium text-gray-700 text-sm dark:text-gray-300"
            htmlFor={emailId}
          >
            Cole o texto do e-mail aqui:
          </label>
        </div>
      </div>
      {hasFile ? (
        <div className="mb-5 flex h-40 items-center justify-center rounded-xl border-2 border-gray-400 border-dashed bg-gray-50 dark:border-gray-400 dark:bg-gray-700">
          <div className="flex flex-col items-center text-gray-700 dark:text-gray-300">
            <FileText className="mb-2" size={48} />
            <span>Arquivo pronto para ser classificado.</span>
          </div>
        </div>
      ) : (
        <div className="mb-5">
          <textarea
            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-gray-900 text-sm outline-none transition duration-200 focus:border-green-500 focus:ring-2 dark:border-gray-300 dark:bg-gray-700 dark:text-gray-100"
            id={emailId}
            onChange={(e) => handleEmailTextChange(e.target.value)}
            placeholder="Faça o upload do e-mail ou informe ele aqui que te ajudo a classifica-lo."
            rows={10}
          />
        </div>
      )}
      <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
        <label
          className="w-full cursor-pointer text-center font-semibold md:w-auto"
          htmlFor={fileId}
        >
          <input
            accept=".txt,.pdf,.doc,.docx"
            className="hidden"
            id={fileId}
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            type="file"
          />
          <div className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-sm text-white transition-colors duration-200 hover:bg-blue-800">
            Escolha um arquivo
          </div>
        </label>
        <button
          className="w-full transform cursor-pointer rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-800 md:w-auto"
          onClick={onSubmit}
          type="button"
        >
          {hasFile ? 'Classificar arquivo' : 'Classificar e-mail'}
        </button>
      </div>
    </div>
  );
}
