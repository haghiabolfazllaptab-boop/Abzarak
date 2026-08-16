import { useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toPersianDigits } from '@/utils/numberUtils';
import { diffDays, diffYMD, startOfDay } from '@/utils/dateUtils';
import DateInput, { type CalendarMode } from '@/components/DateInput';
import { Field, ResultCard, ResultRow, Stat } from '@/components/ui';

export default function DateDifference() {
  const { usePersian } = useApp();
  const [mode, setMode] = useState<CalendarMode>('jalali');
  const [a, setA] = useState<Date | null>(null);
  const [b, setB] = useState<Date | null>(null);

  const dig = (n: number | string) => (usePersian ? toPersianDigits(n) : String(n));
  const valid = a !== null && b !== null;
  let ymd = { years: 0, months: 0, days: 0 };
  let days = 0;
  if (valid) {
    ymd = diffYMD(a!, b!);
    days = Math.abs(diffDays(a!, b!));
  }

  const swap = () => { setA(b); setB(a); };

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div className="flex gap-2">
          {(['jalali', 'gregorian'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setA(null); setB(null); }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition ${
                mode === m ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {m === 'jalali' ? 'تاریخ شمسی' : 'تاریخ میلادی'}
            </button>
          ))}
        </div>
        <Field label="تاریخ اول"><DateInput mode={mode} value={a} onChange={setA} /></Field>
        <Field label="تاریخ دوم"><DateInput mode={mode} value={b} onChange={setB} /></Field>
        <button onClick={swap} className="btn-ghost w-full">
          <ArrowDownUp className="h-4 w-4" /> جابه‌جا کردن تاریخ‌ها
        </button>
      </div>

      {valid ? (
        <>
          <ResultCard title="اختلاف">
            <ResultRow label="اختلاف" value={`${dig(ymd.years)} سال و ${dig(ymd.months)} ماه و ${dig(ymd.days)} روز`} />
          </ResultCard>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="روزها" value={dig(days.toLocaleString('en-US'))} />
            <Stat label="هفته‌ها" value={dig(Math.floor(days / 7).toLocaleString('en-US'))} />
            <Stat label="ساعت‌ها" value={dig((days * 24).toLocaleString('en-US'))} />
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-slate-400">لطفاً هر دو تاریخ را وارد کنید.</p>
      )}
    </div>
  );
}
