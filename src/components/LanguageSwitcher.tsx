import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'toggle' | 'pill' | 'mobile';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'toggle',
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{t('language', 'Language')}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'bn' ? 'বাংলা নির্বাচিত' : 'English Selected'}
            </div>
          </div>
        </div>

        <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all min-h-[32px] ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('bn')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all min-h-[32px] ${
              language === 'bn'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            বাং
          </button>
        </div>
      </div>
    );
  }

  // Desktop / Header Toggle button with Globe icon
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-blue-300 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 transition-all shadow-2xs min-h-[38px] ${className}`}
      title={language === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন (Switch to Bengali)' : 'Switch to English'}
      aria-label="Switch language between English and Bengali"
    >
      <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 transition-transform group-hover:rotate-12" />
      <span className="text-xs font-bold tracking-tight">
        {language === 'en' ? (
          <span className="flex items-center gap-1">
            <span className="text-blue-600 dark:text-blue-400">EN</span>
            <span className="text-slate-300 dark:text-slate-600 font-normal">/</span>
            <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">বাং</span>
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <span className="text-blue-600 dark:text-blue-400">বাং</span>
            <span className="text-slate-300 dark:text-slate-600 font-normal">/</span>
            <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">EN</span>
          </span>
        )}
      </span>
    </button>
  );
};
