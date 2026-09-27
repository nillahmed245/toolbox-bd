import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';
import { AdPlaceholder } from '../components/AdPlaceholder';

interface PrivacyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <button
        onClick={() => onNavigate('#/')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </button>

      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
          <span>Legal & Transparency</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Updated September 2026</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          At ToolBox BD, your privacy is our primary engineering principle. We believe you should never have to surrender your files, text, or personal documents to use web utilities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
          <EyeOff className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xs font-bold text-emerald-900 uppercase">No File Collection</h2>
            <p className="text-xs text-emerald-700 mt-0.5">Your images and text stay exclusively in your device RAM.</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-start gap-3">
          <Server className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xs font-bold text-blue-900 uppercase">No Remote Storage</h2>
            <p className="text-xs text-blue-700 mt-0.5">We operate zero databases for tool data or uploaded files.</p>
          </div>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200/80 rounded-2xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xs font-bold text-purple-900 uppercase">Local Storage Only</h2>
            <p className="text-xs text-purple-700 mt-0.5">Favorite tools and preferences are saved only on your device.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Do Not Collect</h2>
          <p>
            When you use our Image Compressor, Image Resizer, Image Cropper, QR Code Generator, Word Counter, Text Case Converter, Age Calculator, Calculator, Image to PDF, or PDF to Image tools, all processing occurs via client-side JavaScript, WebAssembly, and HTML5 Canvas inside your local browser sandbox. We never receive, inspect, or store your images, files, or text.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Local Storage Usage</h2>
          <p>
            ToolBox BD uses your browser&apos;s native <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">localStorage</code> solely to remember your bookmarked/favorite utilities and UI preferences (such as category filters). This data never leaves your computer or phone.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Advertising & Analytics</h2>
          <p>
            To keep our utilities completely free for all users worldwide without subscriptions, we allocate reserved space for non-intrusive advertisements. Third-party advertising partners may use standard non-personally identifiable cookies to serve relevant advertisements according to standard web practices. You may disable cookies in your browser settings at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Third-Party Links</h2>
          <p>
            Our website may occasionally reference external links or documentation. We do not control and are not responsible for the privacy practices or content of third-party websites.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Updates to This Policy</h2>
          <p>
            We may periodically update this policy to reflect new browser capabilities or features. Any changes will be posted here with an updated revision date.
          </p>
        </section>
      </div>

      <AdPlaceholder format="banner" />
    </div>
  );
};
