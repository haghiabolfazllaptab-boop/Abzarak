import {
  Calculator, BadgePercent, Cake, CalendarClock, Ruler, HeartPulse,
  Percent, Landmark, Sigma, Palette, Type, Timer, Watch, Download,
  KeyRound, LucideIcon,
} from 'lucide-react';

export type CategoryId =
  | 'calc'
  | 'convert'
  | 'datetime'
  | 'textcolor'
  | 'utility';

export interface Category {
  id: CategoryId | 'all';
  label: string;
}

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'همه' },
  { id: 'calc', label: 'محاسبات' },
  { id: 'convert', label: 'تبدیل‌ها' },
  { id: 'datetime', label: 'تاریخ و زمان' },
  { id: 'textcolor', label: 'متن و رنگ' },
  { id: 'utility', label: 'ابزارهای کاربردی' },
];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  calc: 'محاسبات',
  convert: 'تبدیل‌ها',
  datetime: 'تاریخ و زمان',
  textcolor: 'متن و رنگ',
  utility: 'ابزارهای کاربردی',
};

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  icon: LucideIcon;
  color: string; // tailwind text color class for the icon
  keywords: string[];
}

export const TOOLS: Tool[] = [
  {
    id: 'calculator',
    name: 'ماشین حساب',
    description: 'محاسبات سریع و دقیق',
    category: 'calc',
    icon: Calculator,
    color: 'text-primary',
    keywords: ['حساب', 'جمع', 'تفریق', 'ضرب', 'تقسیم', 'درصد'],
  },
  {
    id: 'discount',
    name: 'محاسبه تخفیف',
    description: 'قیمت نهایی پس از تخفیف',
    category: 'calc',
    icon: BadgePercent,
    color: 'text-success',
    keywords: ['تخفیف', 'قیمت', 'خرید', 'فروش'],
  },
  {
    id: 'age',
    name: 'محاسبه سن',
    description: 'سن دقیق شما تا امروز',
    category: 'datetime',
    icon: Cake,
    color: 'text-accent',
    keywords: ['سن', 'تولد', 'عمر'],
  },
  {
    id: 'date-diff',
    name: 'اختلاف دو تاریخ',
    description: 'فاصله میان دو تاریخ',
    category: 'datetime',
    icon: CalendarClock,
    color: 'text-secondary',
    keywords: ['تاریخ', 'فاصله', 'روز', 'اختلاف'],
  },
  {
    id: 'unit',
    name: 'تبدیل واحد',
    description: 'طول، وزن، دما و بیشتر',
    category: 'convert',
    icon: Ruler,
    color: 'text-primary',
    keywords: ['تبدیل', 'واحد', 'متر', 'کیلوگرم', 'دما'],
  },
  {
    id: 'bmi',
    name: 'محاسبه شاخص توده بدنی',
    description: 'BMI بر اساس قد و وزن',
    category: 'calc',
    icon: HeartPulse,
    color: 'text-danger',
    keywords: ['بی ام آی', 'وزن', 'قد', 'سلامت', 'bmi'],
  },
  {
    id: 'percentage',
    name: 'محاسبه درصد',
    description: 'چهار حالت پرکاربرد درصد',
    category: 'calc',
    icon: Percent,
    color: 'text-warning',
    keywords: ['درصد', 'افزایش', 'کاهش'],
  },
  {
    id: 'installment',
    name: 'محاسبه اقساط',
    description: 'برآورد ساده اقساط',
    category: 'calc',
    icon: Landmark,
    color: 'text-secondary',
    keywords: ['قسط', 'وام', 'سود', 'پیش پرداخت'],
  },
  {
    id: 'average',
    name: 'محاسبه میانگین',
    description: 'میانگین، بیشترین و کمترین',
    category: 'calc',
    icon: Sigma,
    color: 'text-accent',
    keywords: ['میانگین', 'معدل', 'اعداد'],
  },
  {
    id: 'color',
    name: 'ابزار رنگ',
    description: 'تبدیل HEX، RGB و HSL',
    category: 'textcolor',
    icon: Palette,
    color: 'text-accent',
    keywords: ['رنگ', 'هگز', 'hex', 'rgb', 'hsl'],
  },
  {
    id: 'text-counter',
    name: 'شمارش متن',
    description: 'شمارش کلمه، حرف و خط',
    category: 'textcolor',
    icon: Type,
    color: 'text-primary',
    keywords: ['متن', 'کلمه', 'حرف', 'شمارش'],
  },
  {
    id: 'timer',
    name: 'تایمر',
    description: 'شمارش معکوس با پیش‌تنظیم',
    category: 'datetime',
    icon: Timer,
    color: 'text-warning',
    keywords: ['تایمر', 'شمارش معکوس', 'زمان'],
  },
  {
    id: 'stopwatch',
    name: 'کرنومتر',
    description: 'زمان‌سنجی دقیق با ثبت دور',
    category: 'datetime',
    icon: Watch,
    color: 'text-secondary',
    keywords: ['کرنومتر', 'زمان', 'دور', 'lap'],
  },
  {
    id: 'download-time',
    name: 'زمان دانلود',
    description: 'برآورد زمان دانلود فایل',
    category: 'utility',
    icon: Download,
    color: 'text-primary',
    keywords: ['دانلود', 'سرعت', 'اینترنت', 'حجم'],
  },
  {
    id: 'password',
    name: 'تولید رمز عبور',
    description: 'رمز امن و تصادفی',
    category: 'utility',
    icon: KeyRound,
    color: 'text-success',
    keywords: ['رمز', 'پسورد', 'امنیت', 'password'],
  },
];

export function findTool(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}
