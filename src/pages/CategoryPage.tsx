import React from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/tools';
import { ToolCategory, ToolItem } from '../types';
import { ToolCard } from '../components/ToolCard';
import { ToolIcon } from '../components/ToolIcon';
import { AdPlaceholder } from '../components/AdPlaceholder';

interface CategoryPageProps {
  categoryId?: ToolCategory;
  isFavoritesPage?: boolean;
  onNavigate: (route: string) => void;
  onSelectTool: (toolId: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryId,
  isFavoritesPage,
  onNavigate,
  onSelectTool,
  favorites,
  onToggleFavorite,
}) => {
  if (isFavoritesPage) {
    const favoriteTools = TOOLS.filter((t) => favorites.includes(t.id));

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <button
          onClick={() => onNavigate('#/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Saved Tools</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Your Bookmarked Utilities
          </h1>
          <p className="text-sm text-slate-600">
            Quickly access your favorite tools saved in your browser.
          </p>
        </div>

        {favoriteTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">No bookmarked tools yet</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Click the star icon on any tool card to add it to your quick bookmarks.
            </p>
            <button
              onClick={() => onNavigate('#/')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              Browse All Tools
            </button>
          </div>
        )}
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const tools = categoryId ? TOOLS.filter((t) => t.category === categoryId) : [];

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Category Not Found</h2>
        <button
          onClick={() => onNavigate('#/')}
          className="text-blue-600 font-semibold hover:underline"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <button
        onClick={() => onNavigate('#/')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <ToolIcon name={category.iconName} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Tool Category
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {category.name}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              {category.description}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          {tools.length} Tools Available
        </div>
      </div>

      <AdPlaceholder format="leaderboard" />

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onSelect={onSelectTool}
            isFavorite={favorites.includes(tool.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
