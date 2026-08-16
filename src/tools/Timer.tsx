import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toPersianDigits } from '@/utils/numberUtils';

const PRESETS = [1, 5, 10, 25, 30, 60];
const BEEP_DURATION = 0.6;

function beep() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + BEEP_DURATION);
    osc.start();
    osc.stop(ctx.currentTime + BEEP_DURATION);
    osc.onended = () => ctx.close();
  } catch {
    // audio not available
  }
}

function fmtTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Timer() {
  const { usePersian, showToast } = useApp();
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const endRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const dig = (n: number | string) => (usePersian ? toPersianDigits(n) : String(n));

  const total = Math.max(0, Math.min(99, minutes)) * 60 + Math.max(0, Math.min(59, seconds));

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const tick = useCallback(() => {
    const ms = endRef.current - Date.now();
    const secs = Math.ceil(ms / 1000);
    if (secs <= 0) {
      setRemaining(0);
      setRunning(false);
      setFinished(true);
      stop();
      beep();
      showToast('زمان به پایان رسید.', 'error');
      return;
    }
    setRemaining(secs);
    rafRef.current = requestAnimationFrame(tick);
  }, [showToast, stop]);

  const start = useCallback((secs: number) => {
    stop();
    setFinished(false);
    setRunning(true);
    endRef.current = Date.now() + secs * 1000;
    rafRef.current = requestAnimationFrame(tick);
  }, [stop, tick]);

  const pause = useCallback(() => {
    stop();
    setRunning(false);
  }, [stop]);

  const resume = useCallback(() => {
    setRunning(true);
    endRef.current = Date.now() + remaining * 1000;
    rafRef.current = requestAnimationFrame(tick);
  }, [remaining, tick]);

  const reset = useCallback(() => {
    stop();
    setRunning(false);
    setFinished(false);
    setRemaining(total);
  }, [stop, total]);

  useEffect(() => () => stop(), [stop]);
  useEffect(() => { if (!running) setRemaining(total); }, [total, running]);

  const preset = (mins: number) => {
    stop();
    setRunning(false);
    setFinished(false);
    setMinutes(mins);
    setSeconds(0);
    setRemaining(mins * 60);
  };

  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const radius = 86;
  const circ = 2 * Math.PI * radius;

  return (
    <div className="space-y-4">
      <div className="card flex flex-col items-center p-6">
        <div className="relative h-52 w-52">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} className="fill-none stroke-slate-200 dark:stroke-slate-700" strokeWidth="12" />
            <circle
              cx="100" cy="100" r={radius}
              className="fill-none stroke-primary transition-[stroke-dashoffset] duration-200"
              strokeWidth="12" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ - (pct / 100) * circ}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold tabular-nums text-slate-900 dark:text-white" dir="ltr">
              {dig(fmtTime(remaining))}
            </span>
            {finished && <span className="mt-2 text-sm font-bold text-danger">زمان به پایان رسید.</span>}
          </div>
        </div>

        {!running && !finished && (
          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="m">دقیقه</label>
              <input id="m" type="number" min={0} max={99} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="field text-center" dir="ltr" />
            </div>
            <div>
              <label className="label" htmlFor="s">ثانیه</label>
              <input id="s" type="number" min={0} max={59} value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} className="field text-center" dir="ltr" />
            </div>
          </div>
        )}

        <div className="mt-5 flex gap-2">
          {!running ? (
            <button onClick={() => start(remaining > 0 ? remaining : total)} className="btn-primary flex-1">
              <Play className="h-5 w-5" /> {remaining > 0 && remaining !== total ? 'ادامه' : 'شروع'}
            </button>
          ) : (
            <button onClick={pause} className="btn-ghost flex-1">
              <Pause className="h-5 w-5" /> توقف
            </button>
          )}
          <button onClick={reset} className="btn-ghost" aria-label="بازنشانی">
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((m) => (
          <button
            key={m}
            onClick={() => preset(m)}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-600 transition hover:border-primary/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {dig(m)} دقیقه
          </button>
        ))}
      </div>
    </div>
  );
}
