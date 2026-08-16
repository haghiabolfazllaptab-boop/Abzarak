import { lazy, Suspense, useMemo } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { findTool, TOOLS, type Tool } from '@/data/tools';
import type { Category } from '@/data/tools';

const tools = {
  calculator: lazy(() => import('@/tools/calculator/Calculator')),
  discount: lazy(() => import('@/tools/Discount')),
  age: lazy(() => import('@/tools/Age')),
  'date-diff': lazy(() => import('@/tools/DateDifference')),
  unit: lazy(() => import('@/tools/UnitConverter')),
  bmi: lazy(() => import('@/tools/BMI')),
  percentage: lazy(() => import('@/tools/Percentage')),
  installment: lazy(() => import('@/tools/Installment')),
  average: lazy(() => import('@/tools/Average')),
  color: lazy(() => import('@/tools/ColorTool')),
  'text-counter': lazy(() => import('@/tools/TextCounter')),
  timer: lazy(() => import('@/tools/Timer')),
  stopwatch: lazy(() => import('@/tools/Stopwatch')),
  'download-time': lazy(() => import('@/tools/DownloadTime')),
  password: lazy(() => import('@/tools/PasswordGenerator')),
} as const;

export default function ToolPage() {
  const { activeTool, goBack, isFavorite, toggleFavorite } = useApp();
  const tool = activeTool ? findTool(activeTool) : undefined;

  const ToolComponent = useMemo(() => (activeTool ? tools[activeTool as keyof typeof tools] : null), [activeTool]);

  if (!tool || !ToolComponent) {
    return (
      <div className="py-20 text-center text-slate-400">ابزار موردنظر پیدا نشد.</div>
    );
  }

  const Icon = tool.icon;
  const fav = isFavorite(tool.id);

  return (
    <div className="mx-auto max-w-2xl animate-fade-in px-4 py-4">
      <button
        onClick={goBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-primary dark:text-slate-400"
      >
        <ArrowRight className="h-4 w-4" /> بازگشت
      </button>

      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900/60">
          <Icon className={`h-7 w-7 ${tool.color}`} />
        </span>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{tool.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{tool.description}</p>
        </div>
        <button
          onClick={() => toggleFavorite(tool.id)}
          aria-label={fav ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
          aria-pressed={fav}
          className="rounded-xl p-2.5 text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Heart className={`h-6 w-6 ${fav ? 'fill-danger text-danger' : 'text-slate-400'}`} />
        </button>
      </div>

      <Suspense fallback={<div className="card animate-pulse p-8 text-center text-slate-400">در حال بارگذاری...</div>}>
        <ToolComponent />
      </Suspense>
    </div>
  );
}

export function ToolQuickRow({ tool }: { tool: Tool }) {
  const { openTool, isFavorite, toggleFavorite } = useApp();
  const Icon = tool.icon;
  const fav = isFavorite(tool.id);
  return (
    <button
      onClick={() => openTool(tool.id)}
      className="card flex w-full items-center gap-3 p-3 text-right transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900/60">
        <Icon className={`h-5 w-5 ${tool.color}`} />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold text-slate-900 dark:text-white">{tool.name}</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">{tool.description}</span>
      </span>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); toggleFavorite(tool.id); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); toggleFavorite(tool.id); } }}
        aria-label={fav ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        className="rounded-lg p-1.5 text-slate-300"
      >
        <Heart className={`h-5 w-5 ${fav ? 'fill-danger text-danger' : 'text-slate-300'}`} />
      </span>
    </button>
  );
}

export { TOOLS };
export type { Category };
