import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatNumber, parseNumber, toEnglishDigits, toPersianDigits } from '@/utils/numberUtils';
import { Field, Note, ResultCard } from '@/components/ui';

const SIZE_UNITS = [
  { id: 'kb', label: 'KB', bytes: 1024 },
  { id: 'mb', label: 'MB', bytes: 1024 ** 2 },
  { id: 'gb', label: 'GB', bytes: 1024 ** 3 },
];

const SPEED_UNITS = [
  { id: 'mbps', label: 'Mbps', bytesPerSec: 1024 ** 2 / 8 },
  { id: 'mbs', label: 'MB/s', bytesPerSec: 1024 ** 2 },
];

function humanizeDuration(seconds: number, dig: (n: number | string) => string): string {
  if (seconds < 1) return `${dig(formatNumber(seconds, true, { maxFractionDigits: 1 }))} ثانیه`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts: string[] = [];
  if (h > 0) parts.push(`${dig(h)} ساعت`);
  if (m > 0) parts.push(`${dig(m)} دقیقه`);
  if (s > 0 || parts.length === 0) parts.push(`${dig(s)} ثانیه`);
  return parts.join(' و ');
}

export default function DownloadTime() {
  const { usePersian } = useApp();
  const [size, setSize] = useState('');
  const [sizeUnit, setSizeUnit] = useState('gb');
  const [speed, setSpeed] = useState('');
  const [speedUnit, setSpeedUnit] = useState('mbps');

  const dig = (n: number | string) => (usePersian ? toPersianDigits(String(n)) : String(n));

  const sizeVal = parseNumber(toEnglishDigits(size));
  const speedVal = parseNumber(toEnglishDigits(speed));
  const valid = isFinite(sizeVal) && isFinite(speedVal) && sizeVal > 0 && speedVal > 0;

  const sizeBytes = valid ? sizeVal * (SIZE_UNITS.find((u) => u.id === sizeUnit)?.bytes ?? 1) : 0;
  const bps = valid ? speedVal * (SPEED_UNITS.find((u) => u.id === speedUnit)?.bytesPerSec ?? 1) : 0;
  const seconds = valid && bps > 0 ? sizeBytes / bps : 0;

  const reset = () => { setSize(''); setSpeed(''); };

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <Field label="حجم فایل" htmlFor="size">
          <div className="flex gap-2">
            <input id="size" inputMode="decimal" value={size} onChange={(e) => setSize(e.target.value)} placeholder="مثلاً ۲" className="field" dir="ltr" />
            <select value={sizeUnit} onChange={(e) => setSizeUnit(e.target.value)} className="field w-24" aria-label="واحد حجم">
              {SIZE_UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
        </Field>
        <Field label="سرعت اینترنت" htmlFor="speed">
          <div className="flex gap-2">
            <input id="speed" inputMode="decimal" value={speed} onChange={(e) => setSpeed(e.target.value)} placeholder="مثلاً ۲۰" className="field" dir="ltr" />
            <select value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value)} className="field w-24" aria-label="واحد سرعت">
              {SPEED_UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
        </Field>
        <button onClick={reset} className="btn-ghost w-full">بازنشانی</button>
      </div>

      {valid && isFinite(seconds) && (
        <ResultCard title="زمان تقریبی دانلود">
          <div className="text-center text-2xl font-extrabold text-slate-900 dark:text-white">
            {humanizeDuration(seconds, dig)}
          </div>
        </ResultCard>
      )}
      {(size || speed) && !valid && <p className="text-sm text-danger">لطفاً مقدار معتبر و بزرگ‌تر از صفر وارد کنید.</p>}
      <Note>زمان واقعی دانلود ممکن است به شرایط شبکه بستگی داشته باشد.</Note>
    </div>
  );
}
