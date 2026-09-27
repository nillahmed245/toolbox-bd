import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Star,
  Shield,
  Zap,
  CheckCircle2,
  HelpCircle,
  Share2,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ToolItem } from '../types';
import { ToolIcon } from '../components/ToolIcon';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { TOOLS } from '../data/tools';
import { QrCodeGeneratorTool } from '../components/tools/QrCodeGeneratorTool';
import { ImageCompressorTool } from '../components/tools/ImageCompressorTool';
import { ImageResizerTool } from '../components/tools/ImageResizerTool';
import { ImageCropperTool } from '../components/tools/ImageCropperTool';
import { AgeCalculatorTool } from '../components/tools/AgeCalculatorTool';
import { WordCounterTool } from '../components/tools/WordCounterTool';
import { TextCaseConverterTool } from '../components/tools/TextCaseConverterTool';
import { PdfToImageTool } from '../components/tools/PdfToImageTool';
import { UnitConverterTool } from '../components/tools/UnitConverterTool';
import { useToast } from '../context/ToastContext';

interface ToolPageProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
  onSelectTool: (toolId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({
  tool,
  onNavigate,
  onSelectTool,
  isFavorite,
  onToggleFavorite,
}) => {
  const { showToast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const relatedTools = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 3);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${tool.name} – ToolBox BD`,
          text: tool.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        showToast('Link copied to clipboard!', 'success');
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <button
          onClick={() => onNavigate('#/')}
          className="hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <button
          onClick={() => onNavigate(`#/category/${tool.category}`)}
          className="hover:text-blue-600 transition-colors"
        >
          {tool.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-900 font-semibold truncate">{tool.name}</span>
      </nav>

      {/* Tool Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ToolIcon name={tool.iconName} className="w-8 h-8" />
            </div>
            <div>
              {/* Unboxed Metadata Header (Zero-Pill discipline) */}
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                <span>{tool.categoryName}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  100% In-Browser Privacy
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {tool.name}
              </h1>
            </div>
          </div>

          {/* Quick Actions (Favorite & Share) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onToggleFavorite(tool.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors min-h-[44px] ${
                isFavorite
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
                }`}
              />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors min-h-[44px]"
            >
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          {tool.description}
        </p>

        {/* Feature Highlights bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            <span>Processing: {tool.processingTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>No Server Storage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Completely Free</span>
          </div>
        </div>
      </div>

      {/* Reserved Leaderboard Ad Slot */}
      <AdPlaceholder format="leaderboard" />

      {/* Tool Workspace Frame */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        {tool.id === 'qr-code-generator' ? (
          <QrCodeGeneratorTool />
        ) : tool.id === 'image-compressor' ? (
          <ImageCompressorTool />
        ) : tool.id === 'image-resizer' ? (
          <ImageResizerTool />
        ) : tool.id === 'image-cropper' ? (
          <ImageCropperTool />
        ) : tool.id === 'age-calculator' ? (
          <AgeCalculatorTool />
        ) : tool.id === 'word-counter' ? (
          <WordCounterTool />
        ) : tool.id === 'text-case-converter' ? (
          <TextCaseConverterTool />
        ) : tool.id === 'pdf-to-image' ? (
          <PdfToImageTool />
        ) : tool.id === 'unit-converter' ? (
          <UnitConverterTool />
        ) : (
          <div className="max-w-2xl mx-auto text-center py-8 sm:py-12 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <ToolIcon name={tool.iconName} className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {tool.name} Workspace
            </h2>

            <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              {tool.tagline}. The interactive tool layout and foundation is configured and ready for full functionality.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Page structure & routing active</span>
            </div>
          </div>
        )}
      </section>

      {/* How to Use Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            How to Use {tool.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Follow these simple steps to get started
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {tool.howToUse.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-start"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-3">
                {idx + 1}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                {item.step}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Key Features & Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {tool.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      {tool.faqs.length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-slate-100 pt-2">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-3.5">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="text-slate-400 text-lg ml-2 font-mono">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              More {tool.categoryName}
            </h2>
            <button
              onClick={() => onNavigate(`#/category/${tool.category}`)}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectTool(rel.id)}
                className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ToolIcon name={rel.iconName} className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {rel.tagline}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Ad Placeholder */}
      <AdPlaceholder format="banner" />
    </div>
  );
};
