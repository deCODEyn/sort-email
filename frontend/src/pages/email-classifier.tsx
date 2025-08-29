import { EmailForm } from "../components/email-form";
import { ErrorToSend } from "../components/error-to-send";
import { Header } from "../components/header";
import { ResposnseDisplay } from "../components/response-display";

export function EmailClassifier() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen font-sans p-4">
			<div className="w-full max-w-4xl p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
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
