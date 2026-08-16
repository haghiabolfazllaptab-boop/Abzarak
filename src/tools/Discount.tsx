import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatNumber, parseNumber } from '@/utils/numberUtils';
import { CopyButton, Field, ResultCard, ResultRow } from '@/components/ui';

export default function Discount() {
  const { usePersian, settings } = useApp();
  const [price, setPrice] = useState('');
  const [percent, setPercent] = useState('');

  const p = parseNumber(price);
  const d = parseNumber(percent);
  const valid = isFinite(p) && isFinite(d) && p >= 0 && d >= 0 && d <= 100;

  const amount = valid ? (p * d) / 100 : 0;
  const final = valid ? p - amount : 0;
  const fmt = (n: number) => formatNumber(n, usePersian, { maxFractionDigits: 2 });
  const cur = settings.currency;

  const reset = () => {
    setPrice('');
    setPercent('');
  };

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <Field label={`قیمت اصلی (${cur})`} htmlFor="price">
          <input
            id="price"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="مثلاً ۲٬۰۰۰٬۰۰۰"
            className="field"
          />
        </Field>
        <Field label="درصد تخفیف (٪)" htmlFor="percent">
          <input
            id="percent"
            inputMode="decimal"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            placeholder="مثلاً ۲۵"
            className="field"
          />
        </Field>
        <button onClick={reset} className="btn-ghost w-full">بازنشانی</button>
      </div>

      {valid && (
        <ResultCard>
          <ResultRow label="مقدار تخفیف" value={`${fmt(amount)} ${cur}`} />
          <ResultRow label="قیمت نهایی" value={`${fmt(final)} ${cur}`} />
          <div className="mt-4">
            <CopyButton
              text={`مقدار تخفیف: ${fmt(amount)} ${cur}\nقیمت نهایی: ${fmt(final)} ${cur}`}
            />
          </div>
        </ResultCard>
      )}
      {price && percent && !valid && (
        <p className="text-sm text-danger">لطفاً مقدار معتبر وارد کنید (درصد بین ۰ تا ۱۰۰).</p>
      )}
    </div>
  );
}
