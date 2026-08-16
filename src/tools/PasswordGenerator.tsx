import { useCallback, useState } from 'react';
import { Copy, KeyRound, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { copyText } from '@/utils/clipboardUtils';
import { toPersianDigits } from '@/utils/numberUtils';

const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/',
};

type Options = {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
};

function randomInt(max: number): number {
  if (window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function generate(opts: Options): string {
  let pool = '';
  if (opts.upper) pool += SETS.upper;
  if (opts.lower) pool += SETS.lower;
  if (opts.digits) pool += SETS.digits;
  if (opts.symbols) pool += SETS.symbols;
  if (!pool) return '';
  let out = '';
  for (let i = 0; i < opts.length; i += 1) {
    out += pool[randomInt(pool.length)];
  }
  return out;
}

function strength(pwd: string, opts: Options): { label: string; pct: number; color: string } {
  if (!pwd) return { label: '—', pct: 0, color: 'bg-slate-300' };
  let poolSize = 0;
  if (opts.upper) poolSize += 26;
  if (opts.lower) poolSize += 26;
  if (opts.digits) poolSize += 10;
  if (opts.symbols) poolSize += 24;
  const entropy = pwd.length * Math.log2(poolSize || 1);
  if (entropy < 40) return { label: 'ضعیف', pct: 25, color: 'bg-danger' };
  if (entropy < 60) return { label: 'متوسط', pct: 50, color: 'bg-warning' };
  if (entropy < 80) return { label: 'قوی', pct: 75, color: 'bg-success' };
  return { label: 'بسیار قوی', pct: 100, color: 'bg-secondary' };
}

export default function PasswordGenerator() {
  const { usePersian, showToast } = useApp();
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [pwd, setPwd] = useState('');

  const opts: Options = { length, upper, lower, digits, symbols };
  const dig = (n: number | string) => (usePersian ? toPersianDigits(n) : String(n));

  const make = useCallback(() => {
    if (!upper && !lower && !digits && !symbols) {
      showToast('حداقل یک گزینه را فعال کنید.', 'error');
      return;
    }
    setPwd(generate(opts));
  }, [length, upper, lower, digits, symbols, showToast]);

  const st = strength(pwd, opts);

  const toggle = (setter: (v: boolean) => void, val: boolean) => () => setter(!val);

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4">
          <KeyRound className="h-5 w-5 flex-shrink-0 text-primary" />
          <span className="flex-1 break-all font-mono text-lg text-slate-900 dark:text-white" dir="ltr">
            {pwd || <span className="text-slate-300 dark:text-slate-600">رمز اینجا نمایش داده می‌شود</span>}
          </span>
          {pwd && (
            <button
              onClick={async () => {
                const ok = await copyText(pwd);
                showToast(ok ? 'رمز کپی شد.' : 'کپی ممکن نشد.', ok ? 'success' : 'error');
              }}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-primary dark:hover:bg-slate-700"
              aria-label="کپی رمز"
            >
              <Copy className="h-5 w-5" />
            </button>
          )}
        </div>

        {pwd && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">قدرت رمز</span>
              <span className={`font-bold ${
                st.pct <= 25 ? 'text-danger' : st.pct <= 50 ? 'text-warning' : st.pct <= 75 ? 'text-success' : 'text-secondary'
              }`}>{st.label}</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div className={`h-full transition-all duration-300 ${st.color}`} style={{ width: `${st.pct}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="card space-y-5 p-5">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="label mb-0" htmlFor="len">طول رمز</label>
            <span className="text-sm font-bold text-primary">{dig(length)}</span>
          </div>
          <input
            id="len"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {([
            ['حروف بزرگ', upper, setUpper],
            ['حروف کوچک', lower, setLower],
            ['اعداد', digits, setDigits],
            ['نمادها', symbols, setSymbols],
          ] as const).map(([label, val, setter]) => (
            <button
              key={label}
              onClick={toggle(setter, val)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
                val
                  ? 'border-primary bg-primary-50 text-primary dark:bg-primary/15'
                  : 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
              }`}
              aria-pressed={val}
            >
              {label}
              <span className={`h-5 w-5 rounded-md border ${val ? 'border-primary bg-primary text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                {val && <span className="block text-center leading-5">✓</span>}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={make} className="btn-primary flex-1">
            <RefreshCw className="h-5 w-5" /> ساخت رمز عبور
          </button>
        </div>
      </div>
    </div>
  );
}
