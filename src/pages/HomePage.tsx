import React, { useState, useMemo } from 'react';
import { Search, Shield, Zap, Sparkles, Star, ArrowRight, CheckCircle2, History, RotateCcw, Clock } from 'lucide-react';
import { TOOLS, CATEGORIES, getToolById } from '../data/tools';
import { ToolCategory, ToolItem } from '../types';
import { ToolCard } from '../components/ToolCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { ToolIcon } from '../components/ToolIcon';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  onSelectTool: (toolId: string) => void;
  onNavigate: (route: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
  recentlyUsed?: string[];
  onClearRecentlyUsed?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTool,
  onNavigate,
  favorites,
  onToggleFavorite,
  recentlyUsed = [],
  onClearRecentlyUsed,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const { t, getToolInfo, getCategoryInfo } = useLanguage();

  // Track and resolve up to 5 recently used tools
  const recentTools = useMemo(() => {
    if (!recentlyUsed || recentlyUsed.length === 0) return [];
    return recentlyUsed
      .map((id) => getToolById(id))
      .filter((t): t is ToolItem => Boolean(t))
      .slice(0, 5);
  }, [recentlyUsed]);

  // Count tools by category
  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = { all: TOOLS.length };
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = TOOLS.filter((t) => t.category === cat.id).length;
    });
    return counts;
  }, []);

  // Filter tools based on query and selected category
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const info = getToolInfo(tool);
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        info.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        info.description.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        info.tagline.toLowerCase().includes(q) ||
        tool.metaKeywords.some((k) => k.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, getToolInfo]);

  return (
    <div className="space-y-10 sm:space-y-14 pb-12">
      {/* Hero Section */}
      <section className="pt-6 sm:pt-12 text-center max-w-3xl mx-auto px-4">
        {/* Unboxed editorial kicker */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
          <span>{t('brandName', 'ToolBox BD')}</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>{t('heroKicker', '11 Free Web Utilities')}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white balance mb-4">
          {t('heroTitle', 'Fast, Free & Private Online Tools for Everyone')}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
          {t('heroDescription', 'Compress photos, count words, calculate dates, and convert documents directly in your browser. No file uploads, no signup, 100% private.')}
        </p>

        {/* Hero Interactive Search Bar */}
        <div className="relative max-w-xl mx-auto mb-5">
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-sm focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-3 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/40 transition-all">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('heroSearchPlaceholder', 'Search by tool name or keyword (e.g. compress, qr, age)...')}
              className="w-full py-3.5 pl-3 pr-10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base bg-transparent rounded-2xl outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 mr-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-md text-xs font-semibold"
              >
                {t('clear', 'Clear')}
              </button>
            )}
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-400 dark:text-slate-500">{t('popular', 'Popular:')}</span>
          {['image-compressor', 'qr-code-generator', 'age-calculator', 'unit-converter'].map((toolId) => {
            const tool = TOOLS.find((t) => t.id === toolId);
            if (!tool) return null;
            const info = getToolInfo(tool);
            return (
              <button
                key={toolId}
                onClick={() => onSelectTool(tool.id)}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {info.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Reserved Leaderboard Ad Slot */}
      <section className="max-w-5xl mx-auto px-4">
        <AdPlaceholder format="leaderboard" />
      </section>

      {/* Recently Used Tools Section (Tracks last 5 accessed tools) */}
      {recentTools.length > 0 && !searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/60 dark:border-blue-900/60 shadow-2xs">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                      {t('recentlyUsed', 'Recently Used')}
                    </h2>
                    <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-100/60 dark:border-blue-900/60 px-2 py-0.5 rounded-full">
                      {recentTools.length} {recentTools.length === 1 ? t('toolSingle', 'tool') : t('toolPlural', 'tools')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('recentlyUsedSubtitle', 'Quickly return to the utilities you recently used.')}
                  </p>
                </div>
              </div>

              {onClearRecentlyUsed && (
                <button
                  type="button"
                  onClick={onClearRecentlyUsed}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors min-h-[36px]"
                  title={t('clearHistory', 'Clear your recently used tools history')}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('clearHistory', 'Clear History')}</span>
                </button>
              )}
            </div>

            {/* Grid of recently navigated tools (up to 5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {recentTools.map((tool, index) => {
                const isFav = favorites.includes(tool.id);
                const info = getToolInfo(tool);
                return (
                  <div
                    key={tool.id}
                    onClick={() => onSelectTool(tool.id)}
                    className="group relative p-4 bg-slate-50/70 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-100/70 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                          <ToolIcon name={tool.iconName} className="w-5 h-5" />
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(tool.id);
                          }}
                          className="p-1 text-slate-300 dark:text-slate-600 hover:text-amber-500 transition-colors"
                          aria-label={isFav ? t('removeFromFavorites', 'Remove from favorites') : t('addToFavorites', 'Add to favorites')}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              isFav ? 'fill-amber-400 text-amber-500' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                            }`}
                          />
                        </button>
                      </div>

                      {index === 0 && (
                        <span className="inline-block text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/60 px-1.5 py-0.5 rounded-md uppercase tracking-wider mb-1.5">
                          {t('lastVisited', 'Last Visited')}
                        </span>
                      )}

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {info.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                        {info.tagline}
                      </p>
                    </div>

                    <div className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform pt-1">
                      <span>{t('openTool', 'Open Tool')}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Tools Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Category Controls & Count Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            toolCounts={toolCounts}
          />
          <div className="text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium">
            {t('showing', 'Showing')}{' '}
            <span className="text-slate-900 dark:text-white font-semibold">{filteredTools.length}</span>{' '}
            {t('of', 'of')} {TOOLS.length} {t('toolPlural', 'tools')}
          </div>
        </div>

        {/* Tool Cards Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('noToolsFound', 'No tools matched your search')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {t('noToolsDesc', "We couldn't find anything matching your query. Try resetting your filters.")}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors"
            >
              {t('resetFilters', 'Reset Filters')}
            </button>
          </div>
        )}
      </section>

      {/* Privacy & Performance Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              {t('whyToolBoxBD', 'Why ToolBox BD?')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2 mb-4">
              {t('whyTitle', 'Engineered for Speed, Simplicity & Ironclad Privacy')}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t('whyDescription', 'Unlike other online utility sites that upload your photos, documents, and personal writing to remote servers, ToolBox BD does the heavy lifting right inside your web browser.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-10 pt-8 border-t border-slate-800">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">{t('feature1Title', '100% Client-Side Privacy')}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t('feature1Desc', 'Images, text, and PDF data never leave your device. Process sensitive photos and confidential drafts with complete peace of mind.')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">{t('feature2Title', 'Blazing Fast Speed')}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t('feature2Desc', 'No upload queues or slow download waiting times. HTML5 Canvas and modern browser APIs execute operations in milliseconds.')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">{t('feature3Title', 'No Signup or Fees')}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t('feature3Desc', 'Every single utility is freely accessible without forced account creation, email capture popups, or hidden paywalls.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Deep-Dive Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Explore by Category
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Find the right digital instrument for your specific task
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const count = TOOLS.filter((t) => t.category === cat.id).length;
            const catInfo = getCategoryInfo(cat);
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate(`#/category/${cat.id}`)}
                className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white flex items-center justify-center transition-colors mb-3">
                    <ToolIcon name={cat.iconName} className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {catInfo.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {catInfo.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>{count} {t('toolPlural', 'Tools')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Ad Placeholder */}
      <section className="max-w-5xl mx-auto px-4">
        <AdPlaceholder format="banner" />
      </section>
    </div>
  );
};
