import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
export const ImageToPdfTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const createPDF = async () => {
    if (files.length === 0) {
      alert('কমপক্ষে ১টি ছবি নির্বাচন করুন।');
      return;
    }

    setLoading(true);

    try {
      const pdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();

        let image;

        if (file.type === 'image/png') {
          image = await pdf.embedPng(bytes);
        } else {
          image = await pdf.embedJpg(bytes);
        }

        const width = image.width;
        const height = image.height;

        const page = pdf.addPage([width, height]);

        page.drawImage(image, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdf.save();

      const blob = new Blob([pdfBytes], {
        type: 'application/pdf',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'images.pdf';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error(error);
      alert('PDF তৈরি করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800">

        <h2 className="text-2xl font-bold mb-2">
          Image to PDF
        </h2>

        <p className="text-slate-500 mb-5">
          JPG, PNG images একসাথে একটি PDF বানান।
        </p>

        <input
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={handleFiles}
          className="mb-5"
        />

        {files.length > 0 && (
          <div className="mb-5">
            <p className="font-semibold mb-2">
              Selected images: {files.length}
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
          onClick={createPDF}
          disabled={files.length === 0 || loading}
          className="px-5 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50"
        >
          {loading ? 'Creating PDF...' : 'Convert to PDF'}
        </button>

      </div>
    </div>
  );
};
