import { CATEGORIES, type Category } from '@/data/tools';

interface Props {
  active: Category['id'];
  onChange: (id: Category['id']) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/40 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
            aria-pressed={isActive}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
