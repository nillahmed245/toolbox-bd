import React, { useState } from 'react';

const PDFPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
        PDF Tools
      </h1>

      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Free online PDF tools — fast and easy to use.
      </p>

      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800">
        <h2 className="text-2xl font-bold mb-2">
          Merge PDF
        </h2>

        <p className="text-slate-500 mb-5">
          Combine multiple PDF files into one.
        </p>

        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFiles}
          className="mb-5"
        />

        {files.length > 0 && (
          <div className="mb-5">
            <p className="font-semibold">
              Selected files: {files.length}
            </p>

            {files.map((file, index) => (
              <p key={index} className="text-sm text-slate-600">
                {index + 1}. {file.name}
              </p>
            ))}
          </div>
        )}

        <button
          disabled={files.length < 2}
          className="px-5 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50"
        >
          Merge PDF
        </button>
      </div>
    </div>
  );
};

export default PDFPage;
