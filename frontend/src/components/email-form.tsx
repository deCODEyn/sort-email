export function EmailForm() {
	return (
		<div className="my-5 gap-4 mb-8">
			<div className="mb-5">
				<label
					htmlFor="emailText"
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>
					Cole o texto do e-mail aqui:
				</label>
				<textarea
					rows={10}
					placeholder="Ex: Olá, poderia me ajudar a verificar o status da minha solicitação?"
					className="w-full p-4 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-xl focus:ring-2 focus:border-2 focus:border-green-500 outline-none transition duration-200"
				/>
			</div>
			<div className="flex items-center justify-between gap-3 md:flex-row flex-col">
				<label
					htmlFor="file-upload"
					className="cursor-pointer w-full md:w-auto text-center"
				>
					<input type="file" accept=".txt,.pdf" className="hidden" />
					<div className="px-6 py-3 text-sm font-medium text-blue-700 bg-blue-200 rounded-xl hover:bg-blue-500 hover:text-blue-900 transition-colors duration-200 dark:bg-blue-800 dark:text-blue-100">
						Escolha um arquivo
					</div>
				</label>
				<button
					type="button"
					className="w-full cursor-pointer md:w-auto px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 bg-blue-600 hover:bg-blue-700 shadow-lg"
				>
					Classificar E-mail
				</button>
			</div>
		</div>
	);
}
