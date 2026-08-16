import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatNumber, parseNumber } from '@/utils/numberUtils';
import { Field, Note, ResultCard, ResultRow } from '@/components/ui';

export default function Installment() {
  const { usePersian, settings } = useApp();
  const [total, setTotal] = useState('');
  const [down, setDown] = useState('');
  const [months, setMonths] = useState('');
  const [rate, setRate] = useState('');

  const t = parseNumber(total);
  const d = parseNumber(down);
  const n = parseNumber(months);
  const r = parseNumber(rate);
  const valid = isFinite(t) && isFinite(d) && isFinite(n) && isFinite(r) && t >= 0 && d >= 0 && n > 0 && r >= 0 && d <= t;

  const remaining = valid ? t - d : 0;
  const totalWithInterest = valid ? remaining * (1 + r / 100) : 0;
  const each = valid ? totalWithInterest / n : 0;
  const paid = valid ? d + totalWithInterest : 0;
  const cur = settings.currency;
  const fmt = (v: number) => formatNumber(v, usePersian, { maxFractionDigits: 0 });
  const reset = () => { setTotal(''); setDown(''); setMonths(''); setRate(''); };

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <Field label={`مبلغ کل (${cur})`} htmlFor="total">
          <input id="total" inputMode="decimal" value={total} onChange={(e) => setTotal(e.target.value)} className="field" />
        </Field>
        <Field label={`پیش‌پرداخت (${cur})`} htmlFor="down">
          <input id="down" inputMode="decimal" value={down} onChange={(e) => setDown(e.target.value)} className="field" />
        </Field>
        <Field label="تعداد اقساط" htmlFor="months">
          <input id="months" inputMode="decimal" value={months} onChange={(e) => setMonths(e.target.value)} className="field" />
        </Field>
        <Field label="درصد سود (کل دوره)" htmlFor="rate">
          <input id="rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="field" />
        </Field>
        <button onClick={reset} className="btn-ghost w-full">بازنشانی</button>
      </div>

      {valid ? (
        <ResultCard>
          <ResultRow label="مبلغ باقی‌مانده" value={`${fmt(remaining)} ${cur}`} />
          <ResultRow label="مبلغ تقریبی هر قسط" value={`${fmt(each)} ${cur}`} />
          <ResultRow label="مجموع پرداخت" value={`${fmt(paid)} ${cur}`} />
        </ResultCard>
      ) : null}
      {total && months && !valid && <p className="text-sm text-danger">لطفاً اطلاعات لازم را کامل و معتبر وارد کنید.</p>}
      <Note>این محاسبه یک برآورد ساده است و فرمول دقیق وام هر بانک ممکن است متفاوت باشد.</Note>
    </div>
  );
}
