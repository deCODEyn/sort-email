import { useResponseContext } from '@/context/response-context';

export function ResposnseDisplay() {
  const { response } = useResponseContext();

  return (
    <div className="space-y-4 rounded-xl border border-gray-300 bg-gray-100 p-6 shadow-inner dark:bg-gray-700">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Categoria:
        </span>
        <span
          className={`rounded-full px-3 py-1 font-bold text-2xl ${
            response?.category === 'Produtivo'
              ? 'text-green-500 dark:text-green-300'
              : 'text-red-500 dark:text-red-300'
          }`}
        >
          {response?.category}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-gray-700 dark:text-gray-300">
          Resposta Sugerida:
        </h3>
        <p className="whitespace-pre-wrap rounded-xl border border-gray-400 bg-white p-4 text-base text-gray-900 leading-relaxed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
          {response?.reply}
        </p>
      </div>
    </div>
  );
}
