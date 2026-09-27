import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { AdPlaceholder } from '../components/AdPlaceholder';

interface TermsPageProps {
  onNavigate: (route: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
          <span>Terms & Conditions</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Terms of Service</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Terms of Service
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Please review the following terms that govern your access to and use of ToolBox BD.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By visiting or using the utilities provided by ToolBox BD, you agree to comply with and be bound by these Terms of Service. If you disagree with any portion of these terms, please discontinue using the website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Free Use & Accessibility</h2>
          <p>
            ToolBox BD provides free browser-based productivity utilities for personal, educational, and commercial purposes. No subscription fees or user account registrations are required for general use.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. User Responsibility & Intellectual Property</h2>
          <p>
            You retain all rights, title, and ownership of images, text, and documents you process through ToolBox BD. You agree not to use the services for generating illegal material, infringing upon intellectual property rights, or distributing malicious payloads.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Disclaimer of Warranties</h2>
          <p>
            ToolBox BD is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, either express or implied. While we strive for maximum precision and computational accuracy in all tools, ToolBox BD does not guarantee uninterrupted operation or zero errors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Limitation of Liability</h2>
          <p>
            In no event shall ToolBox BD or its creators be liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use the site or its output.
          </p>
        </section>
      </div>

      <AdPlaceholder format="banner" />
    </div>
  );
};
