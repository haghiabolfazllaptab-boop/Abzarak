import { useCallback, useEffect, useRef, useState } from 'react';
import { Flag, Pause, Play, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toPersianDigits } from '@/utils/numberUtils';

interface Lap {
  index: number;
  total: number; // ms elapsed at lap
  split: number; // ms since previous lap
}

function fmt(ms: number): string {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

export default function Stopwatch() {
  const { usePersian } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const dig = (s: number | string) => (usePersian ? toPersianDigits(String(s)) : String(s));

  const tick = useCallback(() => {
    setElapsed(baseRef.current + (Date.now() - startRef.current));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    setRunning(true);
    startRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    baseRef.current += Date.now() - startRef.current;
    setElapsed(baseRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    baseRef.current = 0;
    setElapsed(0);
    setRunning(false);
    setLaps([]);
  }, []);

  const lap = useCallback(() => {
    setLaps((prev) => {
      const prevTotal = prev.length ? prev[0].total : 0;
      return [{ index: prev.length + 1, total: elapsed, split: elapsed - prevTotal }, ...prev];
    });
  }, [elapsed]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <div className="space-y-4">
      <div className="card flex flex-col items-center p-6">
        <span className="text-6xl font-extrabold tabular-nums text-slate-900 dark:text-white" dir="ltr">
          {dig(fmt(elapsed))}
        </span>
        <div className="mt-6 flex w-full gap-2">
          {!running ? (
            <button onClick={start} className="btn-primary flex-1">
              <Play className="h-5 w-5" /> {elapsed > 0 ? 'ادامه' : 'شروع'}
            </button>
          ) : (
            <button onClick={pause} className="btn-ghost flex-1">
              <Pause className="h-5 w-5" /> توقف
            </button>
          )}
          <button onClick={lap} disabled={!running} className="btn-ghost" aria-label="ثبت دور">
            <Flag className="h-5 w-5" /> ثبت دور
          </button>
          <button onClick={reset} className="btn-ghost" aria-label="بازنشانی">
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="card overflow-hidden p-5">
          <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">دورها</h3>
          <ul className="space-y-1">
            {laps.map((l) => (
              <li key={l.index} className="flex items-center justify-between rounded-lg px-3 py-2 odd:bg-slate-50 dark:odd:bg-slate-700/30">
                <span className="text-sm text-slate-500 dark:text-slate-400">دور {dig(l.index)}</span>
                <div className="flex gap-4 tabular-nums" dir="ltr">
                  <span className="text-xs text-slate-400">{dig(fmt(l.split))}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{dig(fmt(l.total))}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
