import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatNumber, parseNumber, toEnglishDigits } from '@/utils/numberUtils';
import {
  UNIT_CATEGORIES, convertLinear, convertTemperature,
  type UnitCategory,
} from '@/data/units';
import { CopyButton, ResultCard } from '@/components/ui';

export default function UnitConverter() {
  const { usePersian } = useApp();
  const [catId, setCatId] = useState<UnitCategory['id']>('length');
  const category = useMemo(
    () => UNIT_CATEGORIES.find((c) => c.id === catId)!,
    [catId]
  );
  const [fromId, setFromId] = useState(category.units[0].id);
  const [toId, setToId] = useState(category.units[2].id);
  const [value, setValue] = useState('');

  const reset = () => setValue('');

  const num = parseNumber(toEnglishDigits(value));
  const valid = isFinite(num);
  const from = category.units.find((u) => u.id === fromId)!;
  const to = category.units.find((u) => u.id === toId)!;
  const result = valid
    ? category.id === 'temperature'
      ? convertTemperature(num, fromId, toId)
      : convertLinear(num, from, to)
    : NaN;
  const formatted = valid ? formatNumber(result, usePersian, { maxFractionDigits: 8 }) : '';

  const onCat = (id: UnitCategory['id']) => {
    const cat = UNIT_CATEGORIES.find((c) => c.id === id)!;
    setCatId(id);
    setFromId(cat.units[0].id);
    setToId(cat.units[Math.min(2, cat.units.length - 1)].id);
    setValue('');
  };

  return (
    <div className="space-y-4">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {UNIT_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => onCat(c.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              catId === c.id
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/40 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="card space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="from">از واحد</label>
            <select id="from" value={fromId} onChange={(e) => setFromId(e.target.value)} className="field">
              {category.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="to">به واحد</label>
            <select id="to" value={toId} onChange={(e) => setToId(e.target.value)} className="field">
              {category.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="val">مقدار</label>
          <input
            id="val"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="مقدار را وارد کنید"
            className="field"
          />
        </div>
        <button onClick={reset} className="btn-ghost w-full">بازنشانی</button>
      </div>

      {valid && value ? (
        <ResultCard>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-sm">
              {formatNumber(num, usePersian)} {from.label}
            </span>
            <span className="text-slate-400">=</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {formatted} {to.label}
            </span>
          </div>
          <div className="mt-4">
            <CopyButton text={`${formatted} ${to.label}`} />
          </div>
        </ResultCard>
      ) : null}
      {value && !valid && <p className="text-sm text-danger">لطفاً مقدار معتبر وارد کنید.</p>}
    </div>
  );
}
