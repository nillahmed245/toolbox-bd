import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { ToolItem } from '../types';
import { ToolIcon } from './ToolIcon';
import { useLanguage } from '../context/LanguageContext';

interface ToolCardProps {
  tool: ToolItem;
  onSelect: (toolId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const { getToolInfo, t } = useLanguage();
  const info = getToolInfo(tool);

  return (
    <div
      onClick={() => onSelect(tool.id)}
      className="group relative flex flex-col justify-between p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/80 transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Top row: Icon and Favorite toggle */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white">
            <ToolIcon name={tool.iconName} className="w-6 h-6" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(tool.id);
            }}
            className="p-2 -mr-1 -mt-1 text-slate-400 dark:text-slate-500 hover:text-amber-500 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isFavorite ? t('removeFromFavorites', 'Remove from favorites') : t('addToFavorites', 'Add to favorites')}
          >
            <Star
              className={`w-5 h-5 transition-transform active:scale-125 ${
                isFavorite
                  ? 'fill-amber-400 text-amber-500'
                  : 'stroke-[1.5] text-slate-300 dark:text-slate-600 hover:text-amber-400'
              }`}
            />
          </button>
        </div>

        {/* Unboxed category metadata (Zero-Pill rule) */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
          <span>{info.categoryName}</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
          <span>{t('inBrowserBadge', '100% In-Browser')}</span>
        </div>

        {/* Tool Name */}
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight mb-2">
          {info.name}
        </h3>

        {/* Tool Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {info.tagline}
        </p>
      </div>

      {/* Card Footer: Action button */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
        <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">
          {t('openTool', 'Open Tool')}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
          Free · No Login
        </span>
      </div>
    </div>
  );
};
