import React, { useState, useMemo } from 'react';
import {
  Type,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Trash2,
  ArrowRight,
  Code2,
  FileText,
  AlignLeft,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface CaseOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  example: string;
  transform: (str: string) => string;
}

export const TextCaseConverterTool: React.FC = () => {
  const { showToast } = useToast();

  const [inputText, setInputText] = useState<string>(
    'ToolBox BD makes web utilities fast, private, and accessible. You can convert any text into sentence case, title case, uppercase, or programmer-friendly snake_case with one click.'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Minor words to keep lower in Title Case (unless beginning or after colon)
  const minorWords = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'of',
    'on', 'or', 'the', 'to', 'v', 'v.', 'via', 'vs', 'vs.', 'with', 'nor'
  ]);

  // Conversion algorithms
  const toSentenceCase = (str: string): string => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, prefix, letter) => {
        return prefix + letter.toUpperCase();
      })
      .replace(/\bi\b/g, 'I'); // Capitalize lone 'i'
  };

  const toTitleCase = (str: string): string => {
    if (!str) return '';
    const words = str.toLowerCase().split(/(\s+)/);
    let isFirstOrLast = true;

    return words
      .map((word, idx) => {
        // preserve whitespace
        if (/^\s+$/.test(word)) return word;

        const isLastWord = idx === words.length - 1;
        const cleanWord = word.replace(/[^\p{L}\p{N}'-]/gu, '');

        if (!isFirstOrLast && !isLastWord && minorWords.has(cleanWord.toLowerCase())) {
          return word.toLowerCase();
        }

        isFirstOrLast = false;
        return word.replace(/^([^\p{L}\p{N}]*)([\p{L}\p{N}])(.*)$/u, (_, pre, first, rest) => {
          return pre + first.toUpperCase() + rest.toLowerCase();
        });
      })
      .join('');
  };

  const toWords = (str: string): string[] => {
    if (!str) return [];
    // Split on spaces, underscores, hyphens, or camelCase transitions
    return (
      str
        .replace(/([a-z\d])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
        .replace(/[\W_]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
    );
  };

  const toSnakeCase = (str: string): string => {
    const words = toWords(str);
    return words.map((w) => w.toLowerCase()).join('_');
  };

  const toKebabCase = (str: string): string => {
    const words = toWords(str);
    return words.map((w) => w.toLowerCase()).join('-');
  };

  const toCamelCase = (str: string): string => {
    const words = toWords(str);
    if (words.length === 0) return '';
    return (
      words[0].toLowerCase() +
      words
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('')
    );
  };

  const toPascalCase = (str: string): string => {
    const words = toWords(str);
    return words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  };

  const toConstantCase = (str: string): string => {
    const words = toWords(str);
    return words.map((w) => w.toUpperCase()).join('_');
  };

  const toAlternatingCase = (str: string): string => {
    let alt = false;
    return str
      .split('')
      .map((char) => {
        if (/[\p{L}]/u.test(char)) {
          alt = !alt;
          return alt ? char.toLowerCase() : char.toUpperCase();
        }
        return char;
      })
      .join('');
  };

  // Case Conversion Catalog
  const caseOptions: CaseOption[] = useMemo(
    () => [
      {
        id: 'uppercase',
        name: 'UPPERCASE',
        badge: 'ALL CAPS',
        description: 'Converts every single character into capital letters.',
        example: 'HELLO WORLD',
        transform: (s) => s.toUpperCase(),
      },
      {
        id: 'lowercase',
        name: 'lowercase',
        badge: 'small letters',
        description: 'Transforms all characters into lowercase.',
        example: 'hello world',
        transform: (s) => s.toLowerCase(),
      },
      {
        id: 'sentence',
        name: 'Sentence case',
        badge: 'Grammatical',
        description: 'Capitalizes the first letter of each sentence and solitary "I".',
        example: 'Hello world. This is a sentence.',
        transform: toSentenceCase,
      },
      {
        id: 'title',
        name: 'Title Case',
        badge: 'Headlines',
        description: 'Capitalizes principal words while keeping minor prepositions lowercase.',
        example: 'Hello World: The Guide to Modern Web',
        transform: toTitleCase,
      },
      {
        id: 'snake',
        name: 'snake_case',
        badge: 'Python / SQL',
        description: 'Replaces spaces and separators with underscores in lowercase.',
        example: 'hello_world_example',
        transform: toSnakeCase,
      },
      {
        id: 'kebab',
        name: 'kebab-case',
        badge: 'URLs / CSS',
        description: 'Separates lowercase words with hyphens. Ideal for URL slugs and CSS classnames.',
        example: 'hello-world-example',
        transform: toKebabCase,
      },
      {
        id: 'camel',
        name: 'camelCase',
        badge: 'JS / TS',
        description: 'First word lowercase, each subsequent word starts capitalized.',
        example: 'helloWorldExample',
        transform: toCamelCase,
      },
      {
        id: 'pascal',
        name: 'PascalCase',
        badge: 'React / C#',
        description: 'Every word begins with an uppercase letter without spaces.',
        example: 'HelloWorldExample',
        transform: toPascalCase,
      },
      {
        id: 'constant',
        name: 'CONSTANT_CASE',
        badge: 'ENV / Constants',
        description: 'All uppercase words delimited by underscores. Standard for constants.',
        example: 'HELLO_WORLD_EXAMPLE',
        transform: toConstantCase,
      },
      {
        id: 'alternating',
        name: 'aLtErNaTiNg cAsE',
        badge: 'Meme / Sarcasm',
        description: 'Alternates uppercase and lowercase letters sequentially.',
        example: 'hElLo wOrLd eXaMpLe',
        transform: toAlternatingCase,
      },
    ],
    []
  );

  // Live Counts
  const wordCount = useMemo(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return 0;
    const matches = trimmed.match(/[\p{L}\p{N}'-]+/gu);
    return matches ? matches.length : 0;
  }, [inputText]);

  const charCount = inputText.length;

  // Copy converted result to clipboard
  const handleCopyResult = async (id: string, textToCopy: string, name: string) => {
    if (!textToCopy) {
      showToast('Text is empty', 'warning');
      return;
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      showToast(`Copied ${name} to clipboard!`, 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  // Convert the active text inside the primary editor
  const handleApplyTransformToEditor = (option: CaseOption) => {
    if (!inputText) return;
    const converted = option.transform(inputText);
    setInputText(converted);
    showToast(`Converted editor text to ${option.name}`, 'info');
  };

  const handleClear = () => {
    setInputText('');
    showToast('Editor cleared', 'info');
  };

  const handleLoadSample = () => {
    setInputText(
      'Quick brown fox jumps over the lazy dog. Programming in TypeScript and Python is fun!'
    );
    showToast('Loaded sample text', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Editor Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
        {/* Editor Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Input Text to Convert
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-semibold min-h-[36px]"
            >
              Load Sample
            </button>

            <button
              type="button"
              onClick={() => handleCopyResult('main', inputText, 'Input Text')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors min-h-[36px]"
            >
              {copiedId === 'main' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>{copiedId === 'main' ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent transition-colors min-h-[36px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here to convert into any case format instantly..."
            rows={5}
            className="w-full p-4 sm:p-5 text-sm sm:text-base text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all leading-relaxed font-sans"
          />
        </div>

        {/* Quick Transform Button Toolbar */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>Quick In-Place Transformations:</span>
            <span className="font-mono text-slate-400">
              {wordCount} words · {charCount} characters
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {caseOptions.slice(0, 5).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleApplyTransformToEditor(opt)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl border border-slate-200/80 transition-all min-h-[36px]"
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Case Results Showcase (Multi-Format Grid) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Converted Case Formats
            </h3>
            <p className="text-xs text-slate-500">
              Live updates as you type — click any card to copy with 1 click.
            </p>
          </div>

          <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-xl">
            {caseOptions.length} Formats
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseOptions.map((opt) => {
            const transformed = opt.transform(inputText);
            const isCopied = copiedId === opt.id;

            return (
              <div
                key={opt.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {opt.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {opt.badge}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyResult(opt.id, transformed, opt.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all min-h-[36px] ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 hover:bg-blue-100/80 text-blue-700 border-blue-100'
                      }`}
                      title={`Copy ${opt.name}`}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {opt.description}
                  </p>
                </div>

                {/* Formatted Output Box */}
                <div
                  onClick={() => handleCopyResult(opt.id, transformed, opt.name)}
                  className="p-3 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl cursor-pointer transition-colors group relative"
                  title="Click to copy"
                >
                  <p className="text-xs sm:text-sm text-slate-800 font-mono break-all line-clamp-3 leading-relaxed">
                    {transformed || <span className="text-slate-400 italic">Enter text above to preview</span>}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
