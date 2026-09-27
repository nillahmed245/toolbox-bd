import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const PDFPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;

    setMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        const pages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();

      const blob = new Blob([mergedBytes], {
        type: 'application/pdf',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'merged.pdf';
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('PDF merge করা যায়নি।');
    } finally {
      setMerging(false);
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
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFiles}
          className="mb-5"
        />

        {files.length > 0 && (
          <div className="mb-5">
            <p className="font-semibold mb-2">
              Selected files: {files.length}
            </p>

            {files.map((file, index) => (
              <p
                key={index}
                className="text-sm text-slate-600 mb-1"
              >
                {index + 1}. {file.name}
              </p>
            ))}
          </div>
        )}

        <button
          onClick={mergePDFs}
          disabled={files.length < 2 || merging}
          className="px-5 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50"
        >
          {merging ? 'Merging...' : 'Merge PDF'}
        </button>

      </div>
    </div>
  );
};

export default PDFPage;
