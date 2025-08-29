export function ErrorToSend({ children }: { children: React.ReactElement }) {
  return (
    <div className="rounded-xl border border-red-400 bg-red-100 p-4 text-red-700 text-sm dark:bg-red-900 dark:text-red-200">
      {children}
    </div>
  );
}
