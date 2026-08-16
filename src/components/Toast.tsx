import { CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div
      className="fixed inset-x-0 bottom-24 md:bottom-8 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none"
      aria-live="polite"
      role="status"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast-in pointer-events-auto flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-3 text-sm font-medium text-white dark:text-slate-900 shadow-card"
        >
          {t.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <XCircle className="h-5 w-5 text-danger" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
