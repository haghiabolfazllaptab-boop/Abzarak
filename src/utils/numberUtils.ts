const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

// Format a number with thousands separators, respecting a digit style.
export function formatNumber(
  value: number,
  persian: boolean,
  options: { maxFractionDigits?: number } = {}
): string {
  if (!isFinite(value)) return persian ? '—' : '—';
  const { maxFractionDigits = 6 } = options;
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
  return persian ? toPersianDigits(formatted) : formatted;
}

// Convert digits for display of any string that may contain numbers.
export function displayDigits(input: string, persian: boolean): string {
  return persian ? toPersianDigits(input) : toEnglishDigits(input);
}

// Parse a user-typed numeric string (Persian or English digits) into a number.
export function parseNumber(input: string): number {
  const normalized = toEnglishDigits(input).replace(/,/g, '').replace(/٬/g, '').trim();
  if (normalized === '') return NaN;
  return Number(normalized);
}
