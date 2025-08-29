import { Loader } from 'lucide-react';
import { EmailForm, ErrorToSend, Header, ResposnseDisplay } from '@/components';
import { useResponseContext } from '@/context/response-context';

export function EmailClassifier() {
  const { error, isLoading, response } = useResponseContext();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <Header />
        <main className="space-y-5">
          {isLoading ? (
            <div className="text-center font-bold text-gray-900 dark:text-gray-100">
              <Loader
                className="animate-[spin_2s_linear_infinite] text-blue-600 dark:text-blue-400"
                size={50}
              />
              Enviando e-mail para classificação. Por favor aguarde.
            </div>
          ) : (
            <>
              <EmailForm />
              {error && <ErrorToSend>{<p>{error}</p>}</ErrorToSend>}
              {response && <ResposnseDisplay />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
