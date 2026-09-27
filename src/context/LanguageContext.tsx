import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Language,
  TRANSLATIONS,
  TOOL_TRANSLATIONS,
  CATEGORY_TRANSLATIONS,
} from '../locales/translations';
import { ToolItem, CategoryInfo } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  getToolInfo: (tool: ToolItem) => {
    name: string;
    tagline: string;
    description: string;
    categoryName: string;
  };
  getCategoryInfo: (category: CategoryInfo) => {
    name: string;
    description: string;
  };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('toolbox_bd_lang') as Language;
      if (saved === 'en' || saved === 'bn') return saved;
      return 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('toolbox_bd_lang', lang);
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === 'en' ? 'bn' : 'en';
      try {
        localStorage.setItem('toolbox_bd_lang', next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Synchronize document lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
      if (langDict && langDict[key] !== undefined) {
        return langDict[key];
      }
      const fallbackDict = TRANSLATIONS.en;
      if (fallbackDict && fallbackDict[key] !== undefined) {
        return fallbackDict[key];
      }
      return fallback || key;
    },
    [language]
  );

  const getToolInfo = useCallback(
    (tool: ToolItem) => {
      if (language === 'bn') {
        const localized = TOOL_TRANSLATIONS[tool.id]?.bn;
        if (localized) {
          return {
            name: localized.name || tool.name,
            tagline: localized.tagline || tool.tagline,
            description: localized.description || tool.description,
            categoryName: localized.categoryName || tool.categoryName,
          };
        }
      }
      return {
        name: tool.name,
        tagline: tool.tagline,
        description: tool.description,
        categoryName: tool.categoryName,
      };
    },
    [language]
  );

  const getCategoryInfo = useCallback(
    (category: CategoryInfo) => {
      if (language === 'bn') {
        const localized = CATEGORY_TRANSLATIONS[category.id]?.bn;
        if (localized) {
          return {
            name: localized.name || category.name,
            description: localized.description || category.description,
          };
        }
      }
      return {
        name: category.name,
        description: category.description,
      };
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        getToolInfo,
        getCategoryInfo,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
