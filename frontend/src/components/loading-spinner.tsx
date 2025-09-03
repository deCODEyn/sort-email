import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export function LoadingSpinner({
  message = 'Carregando...',
  size = 50,
}: LoadingSpinnerProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-15 text-center font-bold text-gray-900 dark:text-gray-100">
      <Loader
        className="animate-[spin_2s_linear_infinite] text-blue-600 dark:text-blue-400"
        size={size}
      />
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
