import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatNumber, parseNumber } from '@/utils/numberUtils';
import { CopyButton, Field, ResultCard } from '@/components/ui';

const MODES = [
  { id: 0, label: 'X چند درصد Y است؟', placeholders: ['X', 'Y'] },
  { id: 1, label: 'X درصد از Y چقدر است؟', placeholders: ['X (درصد)', 'Y'] },
  { id: 2, label: 'Y با X درصد افزایش چقدر می‌شود؟', placeholders: ['X (درصد)', 'Y'] },
  { id: 3, label: 'Y با X درصد کاهش چقدر می‌شود؟', placeholders: ['X (درصد)', 'Y'] },
];

export default function Percentage() {
  const { usePersian } = useApp();
  const [mode, setMode] = useState(0);
  const [x, setX] = useState('');
  const [y, setY] = useState('');

  const xv = parseNumber(x);
  const yv = parseNumber(y);
  const valid = isFinite(xv) && isFinite(yv);

  let result = 0;
  let resultLabel = '';
  if (valid) {
    switch (mode) {
      case 0:
        result = yv === 0 ? NaN : (xv / yv) * 100;
        resultLabel = 'درصد';
        break;
      case 1:
        result = (xv / 100) * yv;
        resultLabel = 'مقدار';
        break;
      case 2:
        result = yv + (xv / 100) * yv;
        resultLabel = 'مقدار نهایی';
        break;
      case 3:
        result = yv - (xv / 100) * yv;
        resultLabel = 'مقدار نهایی';
        break;
    }
  }
  const fmt = (n: number) => formatNumber(n, usePersian, { maxFractionDigits: 4 });
  const ok = valid && isFinite(result);
  const reset = () => { setX(''); setY(''); };

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div className="grid grid-cols-2 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); reset(); }}
              className={`rounded-xl p-3 text-xs font-medium leading-5 transition ${
                mode === m.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <Field label={MODES[mode].placeholders[0]} htmlFor="x">
          <input id="x" inputMode="decimal" value={x} onChange={(e) => setX(e.target.value)} className="field" />
        </Field>
        <Field label={MODES[mode].placeholders[1]} htmlFor="y">
          <input id="y" inputMode="decimal" value={y} onChange={(e) => setY(e.target.value)} className="field" />
        </Field>
        <button onClick={reset} className="btn-ghost w-full">بازنشانی</button>
      </div>

      {ok && (
        <ResultCard title="نتیجه">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{resultLabel}</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {fmt(result)}{mode === 0 ? ' ٪' : ''}
            </span>
          </div>
          <div className="mt-4"><CopyButton text={`${fmt(result)}${mode === 0 ? '٪' : ''}`} /></div>
        </ResultCard>
      )}
      {x && y && !ok && <p className="text-sm text-danger">لطفاً مقدار معتبر وارد کنید.</p>}
    </div>
  );
}
