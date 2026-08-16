import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react';
import { readStorage, writeStorage } from '@/utils/storageUtils';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type NumberFormat = 'fa' | 'en';
export type View = 'home' | 'favorites' | 'settings' | 'tool';

interface Settings {
  theme: ThemeMode;
  numberFormat: NumberFormat;
  currency: string;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  numberFormat: 'fa',
  currency: 'تومان',
};

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface AppContextValue {
  settings: Settings;
  setTheme: (t: ThemeMode) => void;
  setNumberFormat: (f: NumberFormat) => void;
  setCurrency: (c: string) => void;
  resetSettings: () => void;
  usePersian: boolean;

  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  recents: string[];
  addRecent: (id: string) => void;

  view: View;
  activeTool: string | null;
  navigate: (view: View) => void;
  openTool: (id: string) => void;
  goBack: () => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const KEYS = {
  settings: 'abzarak.settings',
  favorites: 'abzarak.favorites',
  recents: 'abzarak.recents',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => ({
    ...DEFAULT_SETTINGS,
    ...readStorage<Partial<Settings>>(KEYS.settings, {}),
  }));
  const [favorites, setFavorites] = useState<string[]>(() =>
    readStorage<string[]>(KEYS.favorites, [])
  );
  const [recents, setRecents] = useState<string[]>(() =>
    readStorage<string[]>(KEYS.recents, [])
  );
  const [view, setView] = useState<View>('home');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const toastId = useRef(0);
  const prevView = useRef<View>('home');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDark =
    settings.theme === 'dark' || (settings.theme === 'auto' && systemDark);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#0B1220' : '#2563EB');
  }, [isDark]);

  useEffect(() => writeStorage(KEYS.settings, settings), [settings]);
  useEffect(() => writeStorage(KEYS.favorites, favorites), [favorites]);
  useEffect(() => writeStorage(KEYS.recents, recents), [recents]);

  const setTheme = useCallback((theme: ThemeMode) => {
    setSettings((s) => ({ ...s, theme }));
  }, []);
  const setNumberFormat = useCallback((numberFormat: NumberFormat) => {
    setSettings((s) => ({ ...s, numberFormat }));
  }, []);
  const setCurrency = useCallback((currency: string) => {
    setSettings((s) => ({ ...s, currency }));
  }, []);
  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((f) =>
      f.includes(id) ? f.filter((x) => x !== id) : [...f, id]
    );
  }, []);
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const addRecent = useCallback((id: string) => {
    setRecents((r) => [id, ...r.filter((x) => x !== id)].slice(0, 5));
  }, []);

  const navigate = useCallback((next: View) => {
    setView((current) => {
      prevView.current = current === 'tool' ? prevView.current : current;
      return next;
    });
    if (next !== 'tool') setActiveTool(null);
    window.scrollTo({ top: 0 });
  }, []);

  const openTool = useCallback((id: string) => {
    setView((current) => {
      prevView.current = current === 'tool' ? prevView.current : current;
      return 'tool';
    });
    setActiveTool(id);
    addRecent(id);
    window.scrollTo({ top: 0 });
  }, [addRecent]);

  const goBack = useCallback(() => {
    setView(prevView.current);
    setActiveTool(null);
    window.scrollTo({ top: 0 });
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = (toastId.current += 1);
    setToasts((t) => [...t, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2400);
  }, []);

  const value = useMemo<AppContextValue>(() => ({
    settings, setTheme, setNumberFormat, setCurrency, resetSettings,
    usePersian: settings.numberFormat === 'fa',
    favorites, toggleFavorite, isFavorite,
    recents, addRecent,
    view, activeTool, navigate, openTool, goBack,
    toasts, showToast,
  }), [
    settings, setTheme, setNumberFormat, setCurrency, resetSettings,
    favorites, toggleFavorite, isFavorite, recents, addRecent,
    view, activeTool, navigate, openTool, goBack, toasts, showToast,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
