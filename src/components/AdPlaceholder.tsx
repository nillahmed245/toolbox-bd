import React from 'react';

interface AdPlaceholderProps {
  format?: 'leaderboard' | 'rectangle' | 'banner';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  format = 'leaderboard',
  className = '',
}) => {
  if (format === 'rectangle') {
    return (
      <div
        className={`w-full max-w-[300px] h-[250px] mx-auto rounded-xl border border-dashed border-slate-300 bg-slate-100/70 dark:bg-slate-800/40 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
        aria-label="Advertisement Space"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          Advertisement
        </span>
        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">Reserved Ad Space</p>
        <p className="text-[11px] text-slate-400/80">300 × 250</p>
      </div>
    );
  }

  if (format === 'banner') {
    return (
      <div
        className={`w-full rounded-xl border border-dashed border-slate-300 bg-slate-100/60 dark:bg-slate-800/30 dark:border-slate-700 py-3 px-4 text-center select-none flex items-center justify-between ${className}`}
        aria-label="Advertisement Space"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Advertisement
        </span>
        <span className="text-xs text-slate-400">Reserved Sponsorship Space</span>
        <span className="text-[11px] text-slate-400/70">Responsive Banner</span>
      </div>
    );
  }

  // Leaderboard default (Responsive: 320x50 on mobile, 728x90 on desktop)
  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-xl border border-dashed border-slate-300 bg-slate-100/70 dark:bg-slate-800/40 dark:border-slate-700 h-[60px] md:h-[90px] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 p-2 text-center select-none ${className}`}
      aria-label="Advertisement Space"
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Advertisement Space
      </span>
      <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
      <span className="text-xs text-slate-400 dark:text-slate-500">
        Reserved for Ads (728 × 90 / 320 × 50)
      </span>
    </div>
  );
};
