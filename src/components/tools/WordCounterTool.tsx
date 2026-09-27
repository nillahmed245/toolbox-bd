import React, { useState, useMemo } from 'react';
import {
  AlignLeft,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Mic,
  BookOpen,
  FileText,
  Hash,
  Sparkles,
  Trash2,
  ArrowUpDown,
  Type,
  Volume2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const WordCounterTool: React.FC = () => {
  const { showToast } = useToast();

  const [text, setText] = useState<string>(
    'ToolBox BD provides completely free, client-side productivity utilities for creators, writers, students, and professionals in Bangladesh and worldwide. No registration or server uploads are ever required.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Real-time calculation of statistics
  const stats = useMemo(() => {
    const raw = text;
    const trimmed = raw.trim();

    // Characters with spaces
    const charCountWithSpaces = raw.length;

    // Characters without spaces
    const charCountNoSpaces = raw.replace(/\s+/g, '').length;

    // Words
    // Matches sequences of alphanumeric/unicode letters/apostrophes/hyphens
    const wordMatches = trimmed.length > 0 ? trimmed.match(/[\p{L}\p{N}'-]+/gu) : null;
    const wordCount = wordMatches ? wordMatches.length : 0;

    // Sentences
    // Matches sentences ending with ., !, ?, or ellipses
    const sentenceMatches = trimmed.length > 0 ? trimmed.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) : null;
    const sentenceCount = sentenceMatches ? sentenceMatches.filter((s) => s.trim().length > 0).length : 0;

    // Paragraphs
    const paragraphMatches = trimmed.length > 0 ? trimmed.split(/\n\s*\n|\n/) : [];
    const paragraphCount = paragraphMatches.filter((p) => p.trim().length > 0).length;

    // Reading time: average adult reads ~225 words per minute
    const readingTimeMinutes = wordCount > 0 ? wordCount / 225 : 0;
    const readingTimeSec = Math.ceil(readingTimeMinutes * 60);

    // Speaking time: average speaking pace is ~130-150 words per minute (140 avg)
    const speakingTimeMinutes = wordCount > 0 ? wordCount / 140 : 0;
    const speakingTimeSec = Math.ceil(speakingTimeMinutes * 60);

    // Average word length
    const avgWordLength = wordCount > 0 ? (charCountNoSpaces / wordCount).toFixed(1) : '0';

    // Keyword density: top 5 most frequent words (excluding common stop words if possible)
    const wordFreq: Record<string, number> = {};
    if (wordMatches) {
      wordMatches.forEach((w) => {
        const lower = w.toLowerCase();
        if (lower.length > 1) {
          wordFreq[lower] = (wordFreq[lower] || 0) + 1;
        }
      });
    }

    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([w, count]) => ({
        word: w,
        count,
        density: ((count / (wordCount || 1)) * 100).toFixed(1),
      }));

    return {
      wordCount,
      charCountWithSpaces,
      charCountNoSpaces,
      sentenceCount,
      paragraphCount,
      readingTimeSec,
      speakingTimeSec,
      avgWordLength,
      topKeywords,
    };
  }, [text]);

  // Format seconds into minutes & seconds string
  const formatTime = (totalSeconds: number): string => {
    if (totalSeconds < 60) {
      return `${totalSeconds} sec`;
    }
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  };

  // Copy text to clipboard
  const handleCopy = async () => {
    if (!text) {
      showToast('No text to copy', 'warning');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Text copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy text', 'error');
    }
  };

  // Clear text
  const handleClear = () => {
    setText('');
    showToast('Text cleared', 'info');
  };

  // Text Case Transformations
  const handleUpperCase = () => {
    setText((prev) => prev.toUpperCase());
    showToast('Converted to UPPERCASE', 'info');
  };

  const handleLowerCase = () => {
    setText((prev) => prev.toLowerCase());
    showToast('Converted to lowercase', 'info');
  };

  const handleTitleCase = () => {
    setText((prev) =>
      prev.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
    );
    showToast('Converted to Title Case', 'info');
  };

  const handleRemoveExtraSpaces = () => {
    setText((prev) => prev.replace(/\s+/g, ' ').trim());
    showToast('Extra spaces cleaned up', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Primary Real-time Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Words */}
        <div className="p-4 sm:p-5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-center">
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono tracking-tight">
            {stats.wordCount.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1 uppercase tracking-wider">
            Words
          </div>
        </div>

        {/* Characters (With spaces) */}
        <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-mono tracking-tight">
            {stats.charCountWithSpaces.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1 uppercase tracking-wider">
            Characters
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">With spaces</div>
        </div>

        {/* Characters (Without spaces) */}
        <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-mono tracking-tight">
            {stats.charCountNoSpaces.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1 uppercase tracking-wider">
            No Spaces
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Excludes whitespace</div>
        </div>

        {/* Sentences */}
        <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-mono tracking-tight">
            {stats.sentenceCount.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1 uppercase tracking-wider">
            Sentences
          </div>
        </div>
      </div>

      {/* Editor & Action Buttons */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Type or Paste Text Below
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors min-h-[36px]"
              title="Copy text to clipboard"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent transition-colors min-h-[36px]"
              title="Clear editor text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your content here to analyze word, character, and sentence counts in real-time..."
            rows={8}
            className="w-full p-4 sm:p-5 text-sm sm:text-base text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-y leading-relaxed font-sans"
          />
        </div>

        {/* Text Case Quick Transform Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Case:</span>
            <button
              type="button"
              onClick={handleUpperCase}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors min-h-[32px]"
            >
              UPPERCASE
            </button>
            <button
              type="button"
              onClick={handleLowerCase}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors min-h-[32px]"
            >
              lowercase
            </button>
            <button
              type="button"
              onClick={handleTitleCase}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors min-h-[32px]"
            >
              Title Case
            </button>
            <button
              type="button"
              onClick={handleRemoveExtraSpaces}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors min-h-[32px]"
            >
              Clean Spaces
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            {stats.paragraphCount} {stats.paragraphCount === 1 ? 'paragraph' : 'paragraphs'}
          </div>
        </div>
      </div>

      {/* Reading Time & Speaking Pace Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Reading Time */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Estimated Reading Time</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono mt-0.5">
              ~{formatTime(stats.readingTimeSec)}
            </div>
            <div className="text-[11px] text-slate-400">Based on 225 words per minute</div>
          </div>
        </div>

        {/* Speaking Time */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Estimated Speaking Time</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono mt-0.5">
              ~{formatTime(stats.speakingTimeSec)}
            </div>
            <div className="text-[11px] text-slate-400">Speech pace at ~140 wpm</div>
          </div>
        </div>
      </div>

      {/* Extended Metrics & Keyword Density */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paragraph & Word Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-blue-600" />
            <span>Structural Metrics</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Paragraphs</span>
              <strong className="text-slate-800 font-mono">{stats.paragraphCount}</strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Average Word Length</span>
              <strong className="text-slate-800 font-mono">{stats.avgWordLength} characters</strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Average Sentence Length</span>
              <strong className="text-slate-800 font-mono">
                {stats.sentenceCount > 0
                  ? (stats.wordCount / stats.sentenceCount).toFixed(1)
                  : '0'}{' '}
                words
              </strong>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Whitespace Characters</span>
              <strong className="text-slate-800 font-mono">
                {stats.charCountWithSpaces - stats.charCountNoSpaces}
              </strong>
            </div>
          </div>
        </div>

        {/* Top Keywords / Frequency */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Top Keywords & Frequency</span>
          </h4>

          {stats.topKeywords.length > 0 ? (
            <div className="space-y-2">
              {stats.topKeywords.map((kw, i) => (
                <div key={kw.word} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 w-3">{i + 1}.</span>
                    <span className="font-semibold text-slate-700">{kw.word}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono">
                      {kw.count} {kw.count === 1 ? 'time' : 'times'}
                    </span>
                    <span className="text-blue-600 font-mono font-semibold bg-blue-50 px-2 py-0.5 rounded">
                      {kw.density}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">
              Type or paste longer content to see word frequency analysis.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
