import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="جستجوی ابزار..."
        aria-label="جستجوی ابزار"
        className="field pr-12 pl-11 text-base"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="پاک کردن جستجو"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
