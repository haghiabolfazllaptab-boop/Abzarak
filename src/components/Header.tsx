import { Home, Heart, Settings, Wrench } from 'lucide-react';
import { useApp, type View } from '@/context/AppContext';

const NAV: { view: View; label: string; icon: typeof Home }[] = [
  { view: 'home', label: 'خانه', icon: Home },
  { view: 'favorites', label: 'علاقه‌مندی‌ها', icon: Heart },
  { view: 'settings', label: 'تنظیمات', icon: Settings },
];

export default function Header() {
  const { view, navigate } = useApp();
  const current = view === 'tool' ? null : view;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2.5 rounded-xl"
          aria-label="ابزارک، صفحه خانه"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
            <Wrench className="h-5 w-5" />
          </span>
          <span className="text-right leading-tight">
            <span className="block text-lg font-bold text-slate-900 dark:text-white">ابزارک</span>
            <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              ابزارهای کاربردی، همیشه در دسترس
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="ناوبری اصلی">
          {NAV.map(({ view: v, label, icon: Icon }) => (
            <button
              key={v}
              onClick={() => navigate(v)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                current === v
                  ? 'bg-primary-50 text-primary dark:bg-primary/15'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
              aria-current={current === v ? 'page' : undefined}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
