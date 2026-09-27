import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface DarkModeToggleProps {
  className?: string;
  variant?: 'button' | 'mobile';
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  className = '',
  variant = 'button',
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  if (variant === 'mobile') {
    return (
      <div
        className={`flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-slate-700 text-amber-500 dark:text-amber-400 flex items-center justify-center">
            {isDark ? <Moon className="w-4 h-4 fill-amber-400" /> : <Sun className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {isDark ? t('darkMode', 'Dark Mode') : t('lightMode', 'Light Mode')}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {isDark ? 'Dark theme active' : 'Light theme active'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={t('toggleTheme', 'Toggle theme')}
          className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 bg-slate-300 dark:bg-blue-600"
        >
          <span className="sr-only">{t('toggleTheme', 'Toggle theme')}</span>
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
              isDark ? 'translate-x-5 text-blue-600' : 'translate-x-0 text-amber-500'
            }`}
          >
            {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative flex items-center justify-center p-2 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-2xs min-h-[38px] min-w-[38px] ${className}`}
      title={isDark ? t('lightMode', 'Switch to Light Mode') : t('darkMode', 'Switch to Dark Mode')}
      aria-label={isDark ? t('lightMode', 'Switch to Light Mode') : t('darkMode', 'Switch to Dark Mode')}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
};
