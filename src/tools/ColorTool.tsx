import { useState } from 'react';
import { CopyButton, Field, ResultCard, ResultRow } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { toEnglishDigits } from '@/utils/numberUtils';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = toEnglishDigits(hex.trim()).replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

export default function ColorTool() {
  const { showToast } = useApp();
  const [hex, setHex] = useState('#2563EB');
  const [r, setR] = useState('37');
  const [g, setG] = useState('99');
  const [b, setB] = useState('235');

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const rv = Number(r), gv = Number(g), bv = Number(b);
  const rgbValid = [rv, gv, bv].every((n) => isFinite(n) && n >= 0 && n <= 255);

  const onHex = (v: string) => {
    setHex(v);
    const parsed = hexToRgb(v);
    if (parsed) { setR(String(parsed.r)); setG(String(parsed.g)); setB(String(parsed.b)); }
  };
  const onRgb = () => {
    if (rgbValid) {
      const h = rgbToHex(rv, gv, bv);
      setHex(h);
    }
  };
  const onPick = (v: string) => {
    setHex(v);
    const parsed = hexToRgb(v);
    if (parsed) { setR(String(parsed.r)); setG(String(parsed.g)); setB(String(parsed.b)); }
  };

  const hslStr = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '';
  const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '';

  return (
    <div className="space-y-4">
      <div
        className="h-28 rounded-2xl border border-slate-200 shadow-soft dark:border-slate-700"
        style={{ backgroundColor: hex }}
        aria-label="پیش‌نمایش رنگ"
      />

      <div className="card space-y-4 p-5">
        <Field label="کد HEX" htmlFor="hex">
          <input id="hex" value={hex} onChange={(e) => onHex(e.target.value)} className="field font-mono" dir="ltr" />
        </Field>
        <div>
          <label className="label">انتخابگر رنگ</label>
          <input
            type="color"
            value={hex.length === 7 ? hex : '#2563EB'}
            onChange={(e) => onPick(e.target.value)}
            className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800"
            aria-label="انتخاب رنگ از پالت"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Field label="R" htmlFor="r">
            <input id="r" inputMode="numeric" value={r} onChange={(e) => setR(e.target.value)} onBlur={onRgb} className="field text-center" dir="ltr" />
          </Field>
          <Field label="G" htmlFor="g">
            <input id="g" inputMode="numeric" value={g} onChange={(e) => setG(e.target.value)} onBlur={onRgb} className="field text-center" dir="ltr" />
          </Field>
          <Field label="B" htmlFor="b">
            <input id="b" inputMode="numeric" value={b} onChange={(e) => setB(e.target.value)} onBlur={onRgb} className="field text-center" dir="ltr" />
          </Field>
        </div>
      </div>

      {rgb && hsl && (
        <ResultCard title="مقادیر تبدیل‌شده">
          <ResultRow label="HEX" value={<span dir="ltr" className="font-mono">{hex.toUpperCase()}</span>} />
          <ResultRow label="RGB" value={<span dir="ltr" className="font-mono">{rgbStr}</span>} />
          <ResultRow label="HSL" value={<span dir="ltr" className="font-mono">{hslStr}</span>} />
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton text={hex.toUpperCase()} label="کپی HEX" />
            <CopyButton text={rgbStr} label="کپی RGB" />
            <CopyButton text={hslStr} label="کپی HSL" />
          </div>
        </ResultCard>
      )}
      {hex && !rgb && <p className="text-sm text-danger">کد HEX معتبر نیست. مثال صحیح: #2563EB</p>}
    </div>
  );
}
