import React from 'react';
import { ArrowLeft, Shield, Zap, Laptop, Lock, Heart, CheckCircle2 } from 'lucide-react';
import { AdPlaceholder } from '../components/AdPlaceholder';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <button
        onClick={() => onNavigate('#/')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </button>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          <span>About ToolBox BD</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Mission & Philosophy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Fast, Free & Privacy-First Web Utilities
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
          ToolBox BD was created to solve a widespread problem on the internet: clunky, slow, ad-choked online utilities that secretly harvest user photos and text on external cloud servers.
        </p>
      </div>

      <AdPlaceholder format="leaderboard" />

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Client-Side Architecture</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every image compression, word calculation, QR generation, and document manipulation takes place entirely within your device&apos;s local browser engine. No file buffers ever hit our backend servers.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Zero Latency & No Queues</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            By avoiding network round-trips for file transfers, tasks that previously took minutes now complete in fractions of a second.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Laptop className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Mobile-First Touch Ergonomics</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Whether on a smartphone on 4G in Bangladesh, a tablet, or an ultra-wide desktop monitor, our responsive touch targets ensure immediate productivity.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">No Account Required</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            No signup forms, no password management, and no email marketing spam. Open the URL and immediately start using any tool.
          </p>
        </div>
      </div>

      {/* Content statement */}
      <div className="p-8 bg-slate-900 text-white rounded-3xl space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Commitment to Ethical Web Standards
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          ToolBox BD respects your screen real estate and attention. We do not use deceptive fake download buttons, intrusive popups, or auto-playing media. All utilities are tested for accessibility and responsiveness.
        </p>
      </div>
    </div>
  );
};
