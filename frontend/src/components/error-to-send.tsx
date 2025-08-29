export function ErrorToSend({ children }: { children: React.ReactElement }) {
	return (
		<div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 rounded-xl text-red-700 dark:text-red-200 text-sm">
			{children}
		</div>
	);
}
