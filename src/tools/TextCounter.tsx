import { useMemo, useState } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { copyText } from '@/utils/clipboardUtils';
import { Stat } from '@/components/ui';

export default function TextCounter() {
  const { showToast } = useApp();
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const noSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text === '' ? 0 : text.split('\n').length;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const spaces = (text.match(/\s/g) || []).length;
    return { chars, noSpace, words, lines, paragraphs, spaces };
  }, [text]);

  return (
    <div className="space-y-4">
      <div className="card space-y-3 p-5">
        <label className="label" htmlFor="txt">متن خود را وارد کنید...</label>
        <textarea
          id="txt"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="متن خود را وارد کنید..."
          className="field min-h-[200px] leading-7"
        />
        <div className="flex gap-2">
          <button
            onClick={async () => {
              const ok = await copyText(text);
              showToast(ok ? 'متن کپی شد.' : 'کپی ممکن نشد.', ok ? 'success' : 'error');
            }}
            className="btn-ghost flex-1 text-sm"
          >
            <Copy className="h-4 w-4" /> کپی متن
          </button>
          <button onClick={() => setText('')} className="btn-ghost flex-1 text-sm">
            <Trash2 className="h-4 w-4" /> پاک کردن
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="تعداد حروف" value={stats.chars.toLocaleString('en-US')} />
        <Stat label="بدون فاصله" value={stats.noSpace.toLocaleString('en-US')} />
        <Stat label="تعداد کلمات" value={stats.words.toLocaleString('en-US')} />
        <Stat label="تعداد خطوط" value={stats.lines.toLocaleString('en-US')} />
        <Stat label="پاراگراف‌ها" value={stats.paragraphs.toLocaleString('en-US')} />
        <Stat label="فاصله‌ها" value={stats.spaces.toLocaleString('en-US')} />
      </div>
    </div>
  );
}
