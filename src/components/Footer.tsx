import React from 'react';
import { Wrench, Shield, Zap, Lock, Heart } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/tools';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, getToolInfo, getCategoryInfo } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {t('brandName', 'ToolBox BD')}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('heroDescription', 'Free, modern, and mobile-friendly online utilities. Built for speed and total privacy, processing your data directly in your browser without server uploads.')}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{t('feature1Title', 'Zero server logging · 100% client-side privacy')}</span>
            </div>
          </div>

          {/* Popular Tools Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              {t('popular', 'Featured Tools')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {TOOLS.filter((t) => t.popular).slice(0, 5).map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => onNavigate(`#/tool/${tool.id}`)}
                    className="text-slate-400 hover:text-white transition-colors text-left"
                  >
                    {getToolInfo(tool).name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              {t('allCategories', 'Categories')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`#/category/${cat.id}`)}
                    className="text-slate-400 hover:text-white transition-colors text-left"
                  >
                    {getCategoryInfo(cat).name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('#/')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  {t('allTools', 'All Tools')}
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              {t('legal', 'Information & Legal')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('#/about')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  {t('about', 'About Us')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#/contact')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  {t('contact', 'Contact Support')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#/privacy')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  {t('privacyPolicy', 'Privacy Policy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#/terms')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  {t('termsOfService', 'Terms of Service')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {t('brandName', 'ToolBox BD')}. {t('rightsReserved', 'All rights reserved.')}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('#/privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              {t('privacyPolicy', 'Privacy')}
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('#/terms')}
              className="hover:text-slate-300 transition-colors"
            >
              {t('termsOfService', 'Terms')}
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('#/contact')}
              className="hover:text-slate-300 transition-colors"
            >
              {t('contact', 'Contact')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
