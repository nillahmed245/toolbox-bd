/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { CategoryPage } from './pages/CategoryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { TOOLS, CATEGORIES, getToolById } from './data/tools';
import { ToolCategory } from './types';
import { ToastProvider, useToast } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { OfflineIndicator } from './components/OfflineIndicator';

function AppContent() {
  const { showToast } = useToast();
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.hash || '#/';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolbox_bd_favorites');
      return saved ? JSON.parse(saved) : ['image-compressor', 'qr-code-generator'];
    } catch {
      return ['image-compressor', 'qr-code-generator'];
    }
  });

  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolbox_bd_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track recently navigated tools (max 5, deduplicated, persisted in localStorage)
  const recordRecentTool = (toolId: string) => {
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('toolbox_bd_recent', JSON.stringify(updated));
      } catch {
        // localStorage not available
      }
      return updated;
    });
  };

  const handleClearRecentlyUsed = () => {
    setRecentlyUsed([]);
    try {
      localStorage.removeItem('toolbox_bd_recent');
    } catch {
      // localStorage not available
    }
    showToast('Recently used tools history cleared', 'info');
  };

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentRoute(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global keyboard shortcut for search (⌘K or Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync favorites with localStorage
  const handleToggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const willBeSaved = !prev.includes(toolId);
      const updated = willBeSaved
        ? [...prev, toolId]
        : prev.filter((id) => id !== toolId);
      try {
        localStorage.setItem('toolbox_bd_favorites', JSON.stringify(updated));
      } catch {
        // localStorage not available
      }
      const tool = getToolById(toolId);
      const name = tool ? tool.name : 'Tool';
      if (willBeSaved) {
        showToast(`${name} added to your bookmarks!`, 'success');
      } else {
        showToast(`${name} removed from bookmarks`, 'info');
      }
      return updated;
    });
  };

  const navigateTo = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (toolId: string) => {
    recordRecentTool(toolId);
    navigateTo(`#/tool/${toolId}`);
  };

  // Record tool visit on direct route change (e.g. hash link or refresh)
  useEffect(() => {
    if (currentRoute.startsWith('#/tool/')) {
      const toolId = currentRoute.replace('#/tool/', '');
      const tool = getToolById(toolId);
      if (tool) {
        recordRecentTool(tool.id);
      }
    }
  }, [currentRoute]);

  // Dynamic SEO title & description
  useEffect(() => {
    let title = 'ToolBox BD – Free Fast Online Tools for Everyone';
    let desc =
      'Fast, free, and privacy-focused online tools: Image Compressor, Resizer, Cropper, QR Code Generator, Word Counter, PDF utilities & Calculators.';

    if (currentRoute.startsWith('#/tool/')) {
      const toolId = currentRoute.replace('#/tool/', '');
      const tool = getToolById(toolId);
      if (tool) {
        title = `${tool.name} – Free Online Tool | ToolBox BD`;
        desc = `${tool.description} Free, client-side, and no installation required.`;
      }
    } else if (currentRoute.startsWith('#/category/')) {
      const catId = currentRoute.replace('#/category/', '') as ToolCategory;
      const cat = CATEGORIES.find((c) => c.id === catId);
      if (cat) {
        title = `${cat.name} Online Tools | ToolBox BD`;
        desc = `Free online ${cat.name.toLowerCase()} tools that run directly in your browser.`;
      }
    } else if (currentRoute === '#/about') {
      title = 'About Us | ToolBox BD';
      desc = 'Learn about ToolBox BD and our mission to provide fast, privacy-respecting client-side tools.';
    } else if (currentRoute === '#/contact') {
      title = 'Contact Support & Feedback | ToolBox BD';
      desc = 'Get in touch with the ToolBox BD team for inquiries, bug reports, and tool suggestions.';
    } else if (currentRoute === '#/privacy') {
      title = 'Privacy Policy | ToolBox BD';
      desc = 'Our strict privacy commitment: zero server uploads, 100% in-browser processing.';
    } else if (currentRoute === '#/terms') {
      title = 'Terms of Service | ToolBox BD';
      desc = 'Review the terms and conditions for using ToolBox BD free online utilities.';
    } else if (currentRoute === '#/favorites') {
      title = 'Your Bookmarked Tools | ToolBox BD';
      desc = 'Access your favorite saved online tools instantly.';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
  }, [currentRoute]);

  // Route dispatcher
  const renderCurrentPage = () => {
    if (currentRoute.startsWith('#/tool/')) {
      const toolId = currentRoute.replace('#/tool/', '');
      const tool = getToolById(toolId);
      if (tool) {
        return (
          <ToolPage
            tool={tool}
            onNavigate={navigateTo}
            onSelectTool={handleSelectTool}
            isFavorite={favorites.includes(tool.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      }
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Tool Not Found</h2>
          <p className="text-sm text-slate-500">
            The requested tool does not exist or has been moved.
          </p>
          <button
            onClick={() => navigateTo('#/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
          >
            Return to All Tools
          </button>
        </div>
      );
    }

    if (currentRoute.startsWith('#/category/')) {
      const catId = currentRoute.replace('#/category/', '') as ToolCategory;
      return (
        <CategoryPage
          categoryId={catId}
          onNavigate={navigateTo}
          onSelectTool={handleSelectTool}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    if (currentRoute === '#/favorites') {
      return (
        <CategoryPage
          isFavoritesPage={true}
          onNavigate={navigateTo}
          onSelectTool={handleSelectTool}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    if (currentRoute === '#/categories') {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <h1 className="text-2xl font-bold text-slate-900">All Categories</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigateTo(`#/category/${cat.id}`)}
                className="p-5 bg-white rounded-2xl border border-slate-200 text-left hover:border-blue-400 transition-all"
              >
                <h3 className="font-bold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentRoute === '#/about') {
      return <AboutPage onNavigate={navigateTo} />;
    }

    if (currentRoute === '#/contact') {
      return <ContactPage onNavigate={navigateTo} />;
    }

    if (currentRoute === '#/privacy') {
      return <PrivacyPage onNavigate={navigateTo} />;
    }

    if (currentRoute === '#/terms') {
      return <TermsPage onNavigate={navigateTo} />;
    }

    // Default to HomePage
    return (
      <HomePage
        onSelectTool={handleSelectTool}
        onNavigate={navigateTo}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        recentlyUsed={recentlyUsed}
        onClearRecentlyUsed={handleClearRecentlyUsed}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenSearchModal={() => setIsSearchOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 pb-16 md:pb-8">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Mobile Ergonomic Bottom Navigation Bar */}
      <MobileBottomNav
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Global Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
