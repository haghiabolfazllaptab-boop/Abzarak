import { Copy } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { copyText } from '@/utils/clipboardUtils';
import type { ReactNode } from 'react';

export function CopyButton({ text, label = 'کپی نتیجه' }: { text: string; label?: string }) {
  const { showToast } = useApp();
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyText(text);
        showToast(ok ? 'با موفقیت کپی شد.' : 'کپی ممکن نشد.', ok ? 'success' : 'error');
      }}
      className="btn-ghost text-sm"
    >
      <Copy className="h-4 w-4" />
      {label}
    </button>
  );
}

export function ResultCard({
  title = 'نتیجه',
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="animate-scale-in rounded-2xl border border-primary/20 bg-primary-50/60 p-5 dark:border-primary/25 dark:bg-primary/10">
      <h3 className="mb-3 text-sm font-bold text-primary dark:text-blue-300">{title}</h3>
      {children}
    </div>
  );
}

export function ResultRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 py-2.5 last:border-0 dark:border-slate-700/60">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-base font-bold text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-4 text-center shadow-soft dark:bg-slate-800">
      <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
      {children}
    </p>
  );
}
