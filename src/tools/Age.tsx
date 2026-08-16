import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { toPersianDigits } from '@/utils/numberUtils';
import {
  diffDays, diffYMD, gregorianToJalali, jalaliToGregorian, startOfDay,
} from '@/utils/dateUtils';
import DateInput, { type CalendarMode } from '@/components/DateInput';
import { Field, ResultCard, ResultRow, Stat } from '@/components/ui';

export default function Age() {
  const { usePersian } = useApp();
  const [mode, setMode] = useState<CalendarMode>('jalali');
  const [birth, setBirth] = useState<Date | null>(null);

  const dig = (n: number | string) => (usePersian ? toPersianDigits(n) : String(n));

  const today = startOfDay(new Date());
  const valid = birth !== null && startOfDay(birth) <= today;

  let ymd = { years: 0, months: 0, days: 0 };
  let totalDays = 0;
  let nextBirthdayDays = 0;

  if (valid && birth) {
    ymd = diffYMD(birth, today);
    totalDays = diffDays(birth, today);

    const jb = gregorianToJalali(birth);
    const jNow = gregorianToJalali(today);
    let nextYear = jNow.jy;
    let next = jalaliToGregorian(nextYear, jb.jm, Math.min(jb.jd, 29));
    if (startOfDay(next) <= today) {
      nextYear += 1;
      next = jalaliToGregorian(nextYear, jb.jm, Math.min(jb.jd, 29));
    }
    nextBirthdayDays = diffDays(today, next);
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div className="flex gap-2">
          {(['jalali', 'gregorian'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setBirth(null); }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition ${
                mode === m
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {m === 'jalali' ? 'تاریخ شمسی' : 'تاریخ میلادی'}
            </button>
          ))}
        </div>
        <Field label="تاریخ تولد">
          <DateInput mode={mode} value={birth} onChange={setBirth} />
        </Field>
        {birth && !valid && (
          <p className="text-sm text-danger">تاریخ تولد نمی‌تواند در آینده باشد.</p>
        )}
      </div>

      {valid && (
        <>
          <ResultCard title="سن شما">
            <ResultRow label="سن" value={
              `${dig(ymd.years)} سال و ${dig(ymd.months)} ماه و ${dig(ymd.days)} روز`
            } />
            <ResultRow label="تا تولد بعدی" value={`${dig(nextBirthdayDays)} روز`} />
          </ResultCard>

          <div className="grid grid-cols-3 gap-3">
            <Stat label="روزهای زندگی" value={dig(totalDays.toLocaleString('en-US'))} />
            <Stat label="هفته‌ها" value={dig(Math.floor(totalDays / 7).toLocaleString('en-US'))} />
            <Stat label="ماه‌ها" value={dig(ymd.years * 12 + ymd.months)} />
          </div>
        </>
      )}
    </div>
  );
}
