import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { toEnglishDigits, formatNumber } from '@/utils/numberUtils';
import { ResultCard, ResultRow, Stat } from '@/components/ui';

export default function Average() {
  const { usePersian } = useApp();
  const [text, setText] = useState('');

  const numbers = useMemo(() => {
    const parts = toEnglishDigits(text)
      .split(/[\s,،\n]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => isFinite(n));
    return parts;
  }, [text]);

  const fmt = (n: number) => formatNumber(n, usePersian, { maxFractionDigits: 4 });
  const valid = numbers.length > 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  const avg = valid ? sum / numbers.length : 0;
  const max = valid ? Math.max(...numbers) : 0;
  const min = valid ? Math.min(...numbers) : 0;

  return (
    <div className="space-y-4">
      <div className="card space-y-3 p-5">
        <label className="label" htmlFor="nums">اعداد (با کاما، فاصله یا خط جدید جدا کنید)</label>
        <textarea
          id="nums"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="مثلاً: 18, 17.5, 20, 15"
          className="field min-h-[120px] font-mono"
          dir="ltr"
        />
        <button onClick={() => setText('')} className="btn-ghost w-full">پاک کردن</button>
      </div>

      {valid && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="میانگین" value={fmt(avg)} />
            <Stat label="بیشترین" value={fmt(max)} />
            <Stat label="کمترین" value={fmt(min)} />
            <Stat label="تعداد" value={formatNumber(numbers.length, usePersian)} />
          </div>
          <ResultCard title="جزئیات">
            <ResultRow label="مجموع" value={fmt(sum)} />
            <ResultRow label="میانگین" value={fmt(avg)} />
          </ResultCard>
        </>
      )}
      {text && !valid && <p className="text-sm text-danger">لطفاً حداقل یک عدد معتبر وارد کنید.</p>}
    </div>
  );
}
