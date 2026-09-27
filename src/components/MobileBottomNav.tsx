import React from 'react';
import { Home, Layers, Star, Search, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  favoritesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  favoritesCount,
}) => {
  const { t } = useLanguage();
  const isHome = currentRoute === '#/' || currentRoute === '';
  const isCategory = currentRoute.startsWith('#/category');
  const isFavorites = currentRoute === '#/favorites';
  const isAbout = currentRoute === '#/about';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-lg"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-15 max-w-md mx-auto px-2">
        <button
          onClick={() => onNavigate('#/')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            isHome ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">{t('bottomNavHome', 'Home')}</span>
        </button>

        <button
          onClick={() => onNavigate('#/categories')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            isCategory ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">{t('bottomNavCategories', 'Topics')}</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center min-h-[44px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center -mt-1 shadow-2xs">
            <Search className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">{t('bottomNavSearch', 'Search')}</span>
        </button>

        <button
          onClick={() => onNavigate('#/favorites')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            isFavorites ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Star className={`w-5 h-5 ${isFavorites ? 'fill-blue-600 dark:fill-blue-400' : ''}`} />
          {favoritesCount > 0 && (
            <span className="absolute top-1.5 right-4 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
          <span className="text-[10px] mt-1 tracking-tight">{t('bottomNavFavorites', 'Saved')}</span>
        </button>

        <button
          onClick={() => onNavigate('#/about')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            isAbout ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Info className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">{t('about', 'About')}</span>
        </button>
      </div>
    </nav>
  );
};
