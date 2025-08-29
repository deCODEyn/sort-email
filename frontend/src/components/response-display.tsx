export function ResposnseDisplay() {
	return (
		<div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border shadow-inner border-gray-300 space-y-4">
			<div className="flex items-center space-x-2">
				<span className="text-gray-700 dark:text-gray-300 font-medium">
					Categoria:
				</span>
				<span className="font-bold text-lg px-3 py-1 rounded-full text-yellow-800 dark:text-yellow-200">
					Categoria produtivo ou inprodutivo
				</span>
			</div>
			<div className="space-y-2">
				<h3 className="text-gray-700 dark:text-gray-300 font-medium">
					Resposta Sugerida:
				</h3>
				<p className="text-gray-900 dark:text-gray-100 text-base leading-relaxed p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-400 dark:border-gray-600 whitespace-pre-wrap">
					Resposta sugerida vai renderizar aqui
				</p>
			</div>
		</div>
	);
}
