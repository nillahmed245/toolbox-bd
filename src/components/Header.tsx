import React, { useState } from 'react';
import { Search, Wrench, Menu, X, Star, Heart } from 'lucide-react';
import { CATEGORIES } from '../data/tools';
import { ToolCategory } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DarkModeToggle } from './DarkModeToggle';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearchModal: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearchModal,
  favoritesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand title wordmark */}
          <button
            onClick={() => handleNavClick('#/')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1 -ml-1"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
                {t('brandName', 'ToolBox BD')}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (single line text links) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => handleNavClick('#/')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap py-1 ${
                currentRoute === '#/' || currentRoute === ''
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : ''
              }`}
            >
              {t('allTools', 'All Tools')}
            </button>
            <button
              onClick={() => handleNavClick('#/category/image')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap py-1 ${
                currentRoute === '#/category/image'
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : ''
              }`}
            >
              {t('images', 'Images')}
            </button>
            <button
              onClick={() => handleNavClick('#/category/text')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap py-1 ${
                currentRoute === '#/category/text'
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : ''
              }`}
            >
              {t('textTools', 'Text Tools')}
            </button>
            <button
              onClick={() => handleNavClick('#/category/calculator')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap py-1 ${
                currentRoute === '#/category/calculator'
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : ''
              }`}
            >
              {t('calculators', 'Calculators')}
            </button>
            <button
              onClick={() => handleNavClick('#/category/pdf')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap py-1 ${
                currentRoute === '#/category/pdf'
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : ''
              }`}
            >
              {t('pdfTools', 'PDF Tools')}
            </button>
            <button
              onClick={() => handleNavClick('#/about')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap py-1 ${
                currentRoute === '#/about'
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : ''
              }`}
            >
              {t('about', 'About')}
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <DarkModeToggle />

            <LanguageSwitcher />

            <PWAInstallButton className="hidden sm:flex" />

            <button
              onClick={onOpenSearchModal}
              className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-200/60 dark:border-slate-700/60 min-h-[44px]"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">{t('searchPlaceholder', 'Search tools...')}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {favoritesCount > 0 && (
              <button
                onClick={() => handleNavClick('#/favorites')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 rounded-lg transition-colors border border-amber-200/70 dark:border-amber-800/60 min-h-[44px]"
                title="View Bookmarked Tools"
              >
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="tabular-nums font-semibold">{favoritesCount}</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-2">
            <DarkModeToggle variant="mobile" />
            <LanguageSwitcher variant="mobile" />
            <PWAInstallButton className="w-full justify-center py-2.5 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300" />
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 pt-1">
            {t('allCategories', 'Categories')}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('#/')}
              className="flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 text-left min-h-[44px]"
            >
              {t('allTools', 'All Tools')}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleNavClick(`#/category/${cat.id}`)}
                className="flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 text-left min-h-[44px]"
              >
                {t(cat.id === 'image' ? 'images' : cat.id === 'text' ? 'textTools' : cat.id === 'calculator' ? 'calculators' : 'pdfTools', cat.name)}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
            <button
              onClick={() => handleNavClick('#/about')}
              className="text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium min-h-[44px] flex items-center"
            >
              {t('about', 'About ToolBox BD')}
            </button>
            <button
              onClick={() => handleNavClick('#/contact')}
              className="text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium min-h-[44px] flex items-center"
            >
              {t('contact', 'Contact Support')}
            </button>
            <button
              onClick={() => handleNavClick('#/privacy')}
              className="text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium min-h-[44px] flex items-center"
            >
              {t('privacyPolicy', 'Privacy Policy')}
            </button>
            <button
              onClick={() => handleNavClick('#/terms')}
              className="text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium min-h-[44px] flex items-center"
            >
              {t('termsOfService', 'Terms of Service')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
