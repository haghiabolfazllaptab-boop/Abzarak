import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatNumber, parseNumber } from '@/utils/numberUtils';
import { Field, Note, ResultCard, ResultRow } from '@/components/ui';

function bmiCategory(bmi: number): { label: string; color: string; pct: number } {
  if (bmi < 18.5) return { label: 'کمبود وزن', color: 'text-secondary', pct: 25 };
  if (bmi < 25) return { label: 'محدوده نرمال', color: 'text-success', pct: 50 };
  if (bmi < 30) return { label: 'اضافه وزن', color: 'text-warning', pct: 75 };
  return { label: 'چاقی', color: 'text-danger', pct: 100 };
}

export default function BMI() {
  const { usePersian } = useApp();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const w = parseNumber(weight);
  const hCm = parseNumber(height);
  const valid = isFinite(w) && isFinite(hCm) && w > 0 && hCm > 0;
  const bmi = valid ? w / Math.pow(hCm / 100, 2) : 0;
  const cat = bmiCategory(bmi);
  const fmt = (n: number) => formatNumber(n, usePersian, { maxFractionDigits: 1 });

  const reset = () => { setWeight(''); setHeight(''); };

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <Field label="وزن (کیلوگرم)" htmlFor="w">
          <input id="w" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="مثلاً ۷۰" className="field" />
        </Field>
        <Field label="قد (سانتی‌متر)" htmlFor="h">
          <input id="h" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="مثلاً ۱۷۵" className="field" />
        </Field>
        <button onClick={reset} className="btn-ghost w-full">بازنشانی</button>
      </div>

      {valid && (
        <ResultCard>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{fmt(bmi)}</div>
            <div className={`mt-1 text-lg font-bold ${cat.color}`}>{cat.label}</div>
          </div>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full transition-all duration-500 ${
                cat.pct <= 25 ? 'bg-secondary' : cat.pct <= 50 ? 'bg-success' : cat.pct <= 75 ? 'bg-warning' : 'bg-danger'
              }`}
              style={{ width: `${Math.min(100, Math.max(8, cat.pct))}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>کمبود وزن</span><span>نرمال</span><span>اضافه وزن</span><span>چاقی</span>
          </div>
        </ResultCard>
      )}

      <Note>این نتیجه صرفاً برای اطلاع عمومی است و جایگزین نظر متخصص نیست.</Note>
    </div>
  );
}
