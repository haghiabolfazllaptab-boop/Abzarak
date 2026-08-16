import { useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES, TOOLS, type Category } from '@/data/tools';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import ToolCard from '@/components/ToolCard';
import { ToolQuickRow } from '@/pages/ToolPage';
import { findTool } from '@/data/tools';

export default function Home() {
  const { recents } = useApp();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Category['id']>('all');

  const recentTools = useMemo(
    () => recents.map(findTool).filter(Boolean).slice(0, 5) as typeof TOOLS,
    [recents]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t) => {
      const matchCat = cat === 'all' || t.category === cat;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q)) ||
        t.id.includes(q)
      );
    });
  }, [query, cat]);

  const showRecents = !query && cat === 'all' && recentTools.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-7 text-white shadow-card sm:p-10">
        <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
          همه ابزارهای کاربردی در یک جا
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-7 text-blue-50 sm:text-base">
          محاسبه، تبدیل، بررسی و مدیریت اطلاعات روزمره؛ سریع و ساده.
        </p>
        <div className="mt-5 max-w-xl">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      {showRecents && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">آخرین ابزارهای استفاده‌شده</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((t) => <ToolQuickRow key={t.id} tool={t} />)}
          </div>
        </section>
      )}

      <section className="mb-4">
        <CategoryFilter active={cat} onChange={setCat} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">ابزارهای کاربردی</h2>
        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 py-14 text-center">
            <SearchX className="h-10 w-10 text-slate-300" />
            <p className="text-slate-500 dark:text-slate-400">ابزاری پیدا نشد.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        )}
      </section>
    </div>
  );
}
