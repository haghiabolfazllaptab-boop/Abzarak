// Unit conversion definitions. Each unit stores a factor relative to a base
// unit within its category. Temperature is handled separately (non-linear).

export interface UnitDef {
  id: string;
  label: string;
  factor: number; // value in base units per 1 of this unit
}

export interface UnitCategory {
  id: string;
  label: string;
  units: UnitDef[];
}

export const LENGTH: UnitCategory = {
  id: 'length',
  label: 'طول',
  units: [
    { id: 'mm', label: 'میلی‌متر', factor: 0.001 },
    { id: 'cm', label: 'سانتی‌متر', factor: 0.01 },
    { id: 'm', label: 'متر', factor: 1 },
    { id: 'km', label: 'کیلومتر', factor: 1000 },
    { id: 'inch', label: 'اینچ', factor: 0.0254 },
    { id: 'ft', label: 'فوت', factor: 0.3048 },
    { id: 'yd', label: 'یارد', factor: 0.9144 },
    { id: 'mile', label: 'مایل', factor: 1609.344 },
  ],
};

export const WEIGHT: UnitCategory = {
  id: 'weight',
  label: 'وزن',
  units: [
    { id: 'mg', label: 'میلی‌گرم', factor: 0.000001 },
    { id: 'g', label: 'گرم', factor: 0.001 },
    { id: 'kg', label: 'کیلوگرم', factor: 1 },
    { id: 'ton', label: 'تن', factor: 1000 },
    { id: 'lb', label: 'پوند', factor: 0.45359237 },
    { id: 'oz', label: 'اونس', factor: 0.028349523125 },
  ],
};

export const VOLUME: UnitCategory = {
  id: 'volume',
  label: 'حجم',
  units: [
    { id: 'ml', label: 'میلی‌لیتر', factor: 0.001 },
    { id: 'l', label: 'لیتر', factor: 1 },
    { id: 'm3', label: 'متر مکعب', factor: 1000 },
    { id: 'gal', label: 'گالن', factor: 3.785411784 },
  ],
};

export const SPEED: UnitCategory = {
  id: 'speed',
  label: 'سرعت',
  units: [
    { id: 'mps', label: 'متر بر ثانیه', factor: 1 },
    { id: 'kmh', label: 'کیلومتر بر ساعت', factor: 0.277777778 },
    { id: 'mph', label: 'مایل بر ساعت', factor: 0.44704 },
  ],
};

export const AREA: UnitCategory = {
  id: 'area',
  label: 'مساحت',
  units: [
    { id: 'cm2', label: 'سانتی‌متر مربع', factor: 0.0001 },
    { id: 'm2', label: 'متر مربع', factor: 1 },
    { id: 'ha', label: 'هکتار', factor: 10000 },
    { id: 'km2', label: 'کیلومتر مربع', factor: 1000000 },
    { id: 'ft2', label: 'فوت مربع', factor: 0.09290304 },
  ],
};

export const TEMPERATURE: UnitCategory = {
  id: 'temperature',
  label: 'دما',
  units: [
    { id: 'c', label: 'سلسیوس', factor: 1 },
    { id: 'f', label: 'فارنهایت', factor: 1 },
    { id: 'k', label: 'کلوین', factor: 1 },
  ],
};

export const UNIT_CATEGORIES: UnitCategory[] = [
  LENGTH, WEIGHT, VOLUME, TEMPERATURE, SPEED, AREA,
];

export function convertLinear(value: number, from: UnitDef, to: UnitDef): number {
  return (value * from.factor) / to.factor;
}

export function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === 'c') celsius = value;
  else if (from === 'f') celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  if (to === 'c') return celsius;
  if (to === 'f') return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}
