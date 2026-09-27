import React from 'react';
import { CATEGORIES } from '../data/tools';
import { ToolCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoryFilterProps {
  selectedCategory: ToolCategory | 'all';
  onSelectCategory: (category: ToolCategory | 'all') => void;
  toolCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  toolCounts,
}) => {
  const { t, getCategoryInfo } = useLanguage();

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="inline-flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 min-w-full sm:min-w-0">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap min-h-[44px] ${
            selectedCategory === 'all'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <span>{t('allTools', 'All Tools')}</span>
          <span className="text-[11px] tabular-nums text-slate-400 dark:text-slate-500 font-normal">
            ({toolCounts['all'] || 11})
          </span>
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const info = getCategoryInfo(cat);
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap min-h-[44px] ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>{info.name}</span>
              <span className="text-[11px] tabular-nums text-slate-400 dark:text-slate-500 font-normal">
                ({toolCounts[cat.id] || 0})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
