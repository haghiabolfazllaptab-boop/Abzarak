import { Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CATEGORY_LABELS, type Tool } from '@/data/tools';

export default function ToolCard({ tool }: { tool: Tool }) {
  const { openTool, isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(tool.id);
  const Icon = tool.icon;

  return (
    <div className="card group relative flex flex-col p-5 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(tool.id);
        }}
        aria-label={fav ? `حذف ${tool.name} از علاقه‌مندی‌ها` : `افزودن ${tool.name} به علاقه‌مندی‌ها`}
        aria-pressed={fav}
        className="absolute left-3 top-3 rounded-lg p-2 text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <Heart
          className={`h-5 w-5 transition ${fav ? 'fill-danger text-danger' : 'text-slate-400'}`}
        />
      </button>

      <button
        onClick={() => openTool(tool.id)}
        className="flex flex-1 flex-col items-start text-right"
      >
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900/60 transition group-hover:scale-105">
          <Icon className={`h-6 w-6 ${tool.color}`} />
        </span>
        <span className="text-base font-bold text-slate-900 dark:text-white">{tool.name}</span>
        <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tool.description}</span>
        <span className="mt-3 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500 dark:bg-slate-700/60 dark:text-slate-300">
          {CATEGORY_LABELS[tool.category]}
        </span>
      </button>
    </div>
  );
}
