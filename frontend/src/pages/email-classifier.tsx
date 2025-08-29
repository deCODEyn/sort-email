import { EmailForm, ErrorToSend, Header, ResposnseDisplay } from '@/components';

export function EmailClassifier() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <Header />
        <main className="space-y-5">
          <EmailForm />
          <ErrorToSend>{<p>Erro vai renderizar aqui</p>}</ErrorToSend>
          <ResposnseDisplay />
        </main>
      </div>
    </div>
  );
}
