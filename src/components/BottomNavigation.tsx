import { Home, Heart, Settings } from 'lucide-react';
import { useApp, type View } from '@/context/AppContext';

const NAV: { view: View; label: string; icon: typeof Home }[] = [
  { view: 'home', label: 'خانه', icon: Home },
  { view: 'favorites', label: 'علاقه‌مندی‌ها', icon: Heart },
  { view: 'settings', label: 'تنظیمات', icon: Settings },
];

export default function BottomNavigation() {
  const { view, navigate } = useApp();
  const current = view === 'tool' ? null : view;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="ناوبری پایین"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {NAV.map(({ view: v, label, icon: Icon }) => {
          const active = current === v;
          return (
            <button
              key={v}
              onClick={() => navigate(v)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition ${
                active ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={`h-6 w-6 ${active ? 'scale-110' : ''} transition`} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
