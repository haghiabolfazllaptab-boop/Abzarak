import { useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import ToastContainer from '@/components/Toast';
import Home from '@/pages/Home';
import Favorites from '@/pages/Favorites';
import Settings from '@/pages/Settings';
import ToolPage from '@/pages/ToolPage';

function Shell() {
  const { view } = useApp();

  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'ابزارک | مجموعه ابزارهای کاربردی',
      favorites: 'علاقه‌مندی‌ها | ابزارک',
      settings: 'تنظیمات | ابزارک',
      tool: 'ابزارک | مجموعه ابزارهای کاربردی',
    };
    document.title = titles[view] ?? titles.home;
  }, [view]);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main className="animate-fade-in">
        {view === 'home' && <Home />}
        {view === 'favorites' && <Favorites />}
        {view === 'settings' && <Settings />}
        {view === 'tool' && <ToolPage />}
      </main>
      <BottomNavigation />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
