import { Moon, Sun, Monitor, RotateCcw } from 'lucide-react';
import { useApp, type ThemeMode, type NumberFormat } from '@/context/AppContext';

const THEMES: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'روشن', icon: Sun },
  { id: 'dark', label: 'تیره', icon: Moon },
  { id: 'auto', label: 'خودکار', icon: Monitor },
];

const NUM_FORMATS: { id: NumberFormat; label: string }[] = [
  { id: 'fa', label: 'فارسی (۱۲۳)' },
  { id: 'en', label: 'انگلیسی (123)' },
];

const CURRENCIES = ['تومان', 'ریال', 'دلار', 'یورو'];

export default function Settings() {
  const { settings, setTheme, setNumberFormat, setCurrency, resetSettings, showToast } = useApp();

  const doReset = () => {
    resetSettings();
    showToast('تنظیمات بازنشانی شد.');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">تنظیمات</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">ظاهر و رفتار برنامه را شخصی کنید.</p>

      <div className="space-y-5">
        <section className="card p-5">
          <h2 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">تم</h2>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`flex flex-col items-center gap-2 rounded-xl border py-4 text-sm font-medium transition ${
                  settings.theme === id
                    ? 'border-primary bg-primary-50 text-primary dark:bg-primary/15'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
                aria-pressed={settings.theme === id}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">نمایش اعداد</h2>
          <div className="grid grid-cols-2 gap-2">
            {NUM_FORMATS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setNumberFormat(id)}
                className={`rounded-xl border py-3 text-sm font-medium transition ${
                  settings.numberFormat === id
                    ? 'border-primary bg-primary-50 text-primary dark:bg-primary/15'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
                aria-pressed={settings.numberFormat === id}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">واحد پول پیش‌فرض</h2>
          <div className="flex flex-wrap gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                  settings.currency === c
                    ? 'border-primary bg-primary-50 text-primary dark:bg-primary/15'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
                aria-pressed={settings.currency === c}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">بازنشانی</h2>
          <button onClick={doReset} className="btn-ghost w-full text-danger">
            <RotateCcw className="h-4 w-4" /> بازنشانی تنظیمات
          </button>
          <p className="mt-2 text-xs text-slate-400">فقط تنظیمات به حالت پیش‌فرض برمی‌گردد. علاقه‌مندی‌ها حفظ می‌شوند.</p>
        </section>

        <p className="text-center text-xs text-slate-400">ابزارک — نسخه ۱.۰ • تمام محاسبات به‌صورت محلی انجام می‌شود.</p>
      </div>
    </div>
  );
}
