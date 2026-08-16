import { Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { findTool } from '@/data/tools';
import { ToolQuickRow } from '@/pages/ToolPage';

export default function Favorites() {
  const { favorites } = useApp();
  const favTools = favorites.map(findTool).filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">علاقه‌مندی‌ها</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">ابزارهای موردعلاقه شما</p>

      {favTools.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900/60">
            <Heart className="h-7 w-7 text-slate-300" />
          </span>
          <p className="text-slate-500 dark:text-slate-400">هنوز ابزاری به علاقه‌مندی‌ها اضافه نکرده‌اید.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {favTools.map((t) => <ToolQuickRow key={t!.id} tool={t!} />)}
        </div>
      )}
    </div>
  );
}
