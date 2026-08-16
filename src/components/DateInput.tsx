import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { toPersianDigits } from '@/utils/numberUtils';
import {
  JALALI_MONTHS, gregorianToJalali, jalaliMonthLength, jalaliToGregorian,
} from '@/utils/dateUtils';

export type CalendarMode = 'jalali' | 'gregorian';

interface Props {
  mode: CalendarMode;
  value: Date | null;
  onChange: (d: Date | null) => void;
  id?: string;
}

function toISO(d: Date): string {
  const y = d.getFullYear().toString().padStart(4, '0');
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function DateInput({ mode, value, onChange, id }: Props) {
  const { usePersian } = useApp();
  const nowJalali = useMemo(() => gregorianToJalali(new Date()), []);
  const j = value ? gregorianToJalali(value) : null;

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = nowJalali.jy; y >= 1300; y -= 1) arr.push(y);
    return arr;
  }, [nowJalali.jy]);

  const dig = (n: number | string) => (usePersian ? toPersianDigits(n) : String(n));

  if (mode === 'gregorian') {
    return (
      <input
        id={id}
        type="date"
        value={value ? toISO(value) : ''}
        max={toISO(new Date())}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) return onChange(null);
          const [y, m, d] = v.split('-').map(Number);
          onChange(new Date(y, m - 1, d));
        }}
        className="field"
        dir="ltr"
      />
    );
  }

  const jy = j?.jy ?? 0;
  const jm = j?.jm ?? 0;
  const jd = j?.jd ?? 0;
  const dayCount = jm ? jalaliMonthLength(jy || nowJalali.jy, jm) : 31;

  const update = (ny: number, nm: number, nd: number) => {
    if (!ny || !nm || !nd) {
      onChange(null);
      return;
    }
    const maxDay = jalaliMonthLength(ny, nm);
    onChange(jalaliToGregorian(ny, nm, Math.min(nd, maxDay)));
  };

  return (
    <div className="grid grid-cols-3 gap-2" id={id}>
      <select
        aria-label="روز"
        value={jd || ''}
        onChange={(e) => update(jy, jm, Number(e.target.value))}
        className="field"
      >
        <option value="">روز</option>
        {Array.from({ length: dayCount }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>{dig(d)}</option>
        ))}
      </select>
      <select
        aria-label="ماه"
        value={jm || ''}
        onChange={(e) => update(jy, Number(e.target.value), jd || 1)}
        className="field"
      >
        <option value="">ماه</option>
        {JALALI_MONTHS.map((name, i) => (
          <option key={name} value={i + 1}>{name}</option>
        ))}
      </select>
      <select
        aria-label="سال"
        value={jy || ''}
        onChange={(e) => update(Number(e.target.value), jm || 1, jd || 1)}
        className="field"
      >
        <option value="">سال</option>
        {years.map((y) => (
          <option key={y} value={y}>{dig(y)}</option>
        ))}
      </select>
    </div>
  );
}
