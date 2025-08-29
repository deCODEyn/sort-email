import { useResponseContext } from '@/context/response-context';

export function EmailForm() {
  const { classifyEmail, isLoading } = useResponseContext();

  const handleEmailClassify = () => {
    classifyEmail('Texto do e-mail.');
  };

  return (
    <div className="my-5 mb-8 gap-4">
      <div className="mb-5">
        <label
          className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300"
          htmlFor="emailText"
        >
          Cole o texto do e-mail aqui:
        </label>
        <textarea
          className="w-full rounded-xl border border-gray-400 bg-gray-50 p-4 text-gray-900 text-sm outline-none transition duration-200 focus:border-2 focus:border-green-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          disabled={isLoading}
          placeholder="Faça o upload do e-mail ou informe aqui que te ajudo a classifica-lo."
          rows={10}
        />
      </div>
      <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
        <label
          className="w-full cursor-pointer text-center md:w-auto"
          htmlFor="file-upload"
        >
          <input
            accept=".txt,.pdf"
            className="hidden"
            disabled={isLoading}
            type="file"
          />
          <div className="rounded-xl bg-blue-200 px-6 py-3 font-medium text-blue-700 text-sm transition-colors duration-200 hover:bg-blue-500 hover:text-blue-900 dark:bg-blue-800 dark:text-blue-100">
            Escolha um arquivo
          </div>
        </label>
        <button
          className="w-full transform cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700 md:w-auto"
          disabled={isLoading}
          onClick={handleEmailClassify}
          type="button"
        >
          {isLoading ? 'Classificando...' : 'Classificar E-mail'}
        </button>
      </div>
    </div>
  );
}
