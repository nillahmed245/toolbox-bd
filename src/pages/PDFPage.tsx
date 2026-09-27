import React from 'react';

const PDFPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
        PDF Tools
      </h1>

      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Free online PDF tools — fast and easy to use.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold mb-2">Merge PDF</h2>
          <p className="text-sm text-slate-500">
            Combine multiple PDF files into one.
          </p>
        </div>

        <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold mb-2">Split PDF</h2>
          <p className="text-sm text-slate-500">
            Split a PDF into separate pages.
          </p>
        </div>

        <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold mb-2">Compress PDF</h2>
          <p className="text-sm text-slate-500">
            Reduce PDF file size easily.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFPage;
