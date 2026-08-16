import { useCallback, useEffect, useState } from 'react';
import { Delete, Eraser, History } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toPersianDigits } from '@/utils/numberUtils';
import { evaluate, CalcError } from './evaluate';

interface HistoryItem {
  expr: string;
  result: string;
}

const KEYS = [
  ['C', '(', ')', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['%', '0', '.', '='],
];

function formatResult(n: number): string {
  const rounded = Math.round((n + Number.EPSILON) * 1e10) / 1e10;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 10 }).format(rounded);
}

export default function Calculator() {
  const { usePersian } = useApp();
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const display = (s: string) => (usePersian ? toPersianDigits(s) : s);

  const compute = useCallback(() => {
    if (!expr.trim()) return;
    try {
      const value = evaluate(expr);
      const formatted = formatResult(value);
      setResult(formatted);
      setError('');
      setHistory((h) => [{ expr, result: formatted }, ...h].slice(0, 20));
      setExpr(formatted);
    } catch (e) {
      setError(e instanceof CalcError ? e.message : 'عبارت نامعتبر است.');
      setResult('');
    }
  }, [expr]);

  const press = useCallback((key: string) => {
    setError('');
    if (key === 'C') {
      setExpr('');
      setResult('');
      return;
    }
    if (key === '=') {
      compute();
      return;
    }
    setResult('');
    setExpr((prev) => prev + key);
  }, [compute]);

  const backspace = useCallback(() => {
    setError('');
    setResult('');
    setExpr((prev) => prev.slice(0, -1));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key;
      if (/[0-9.+\-*/()%]/.test(k) && k.length === 1) {
        e.preventDefault();
        press(k);
      } else if (k === 'Enter' || k === '=') {
        e.preventDefault();
        compute();
      } else if (k === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (k === 'Escape') {
        e.preventDefault();
        press('C');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [press, compute, backspace]);

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden p-5">
        <div
          className="min-h-[3rem] break-all text-left text-2xl font-bold text-slate-900 dark:text-white"
          dir="ltr"
        >
          {expr ? display(expr) : <span className="text-slate-300 dark:text-slate-600">۰</span>}
        </div>
        <div className="mt-1 min-h-[1.5rem] text-left text-sm" dir="ltr">
          {error ? (
            <span className="text-danger">{error}</span>
          ) : (
            result && <span className="text-success">= {display(result)}</span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <button
            onClick={backspace}
            aria-label="حذف آخرین کاراکتر"
            className="col-span-1 flex items-center justify-center rounded-xl bg-slate-100 py-4 text-slate-600 transition hover:bg-slate-200 active:scale-95 dark:bg-slate-700 dark:text-slate-200"
          >
            <Delete className="h-5 w-5" />
          </button>
          <div className="col-span-3 flex items-center justify-end px-2 text-xs text-slate-400">
            جمع، تفریق، ضرب، تقسیم، درصد و پرانتز
          </div>
          {KEYS.flat().map((key) => {
            const isOp = ['/', '*', '-', '+', '%'].includes(key);
            const isEq = key === '=';
            const isClear = key === 'C';
            return (
              <button
                key={key}
                onClick={() => press(key)}
                aria-label={isClear ? 'پاک کردن' : key}
                className={`rounded-xl py-4 text-lg font-bold transition active:scale-95 ${
                  isEq
                    ? 'bg-primary text-white hover:bg-primary-700'
                    : isClear
                    ? 'bg-danger/10 text-danger hover:bg-danger/20'
                    : isOp
                    ? 'bg-primary-50 text-primary hover:bg-primary-100 dark:bg-primary/15'
                    : 'bg-white text-slate-800 shadow-soft hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {key === 'C' ? 'C' : display(key)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            <History className="h-4 w-4" /> تاریخچه محاسبات
          </h3>
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="flex items-center gap-1 text-xs text-slate-400 transition hover:text-danger"
            >
              <Eraser className="h-3.5 w-3.5" /> پاک کردن
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">هنوز محاسبه‌ای انجام نشده است.</p>
        ) : (
          <ul className="space-y-1" dir="ltr">
            {history.map((h, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <span className="text-slate-500 dark:text-slate-400">{display(h.expr)}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">= {display(h.result)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
