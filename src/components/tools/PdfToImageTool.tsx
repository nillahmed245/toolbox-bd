import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const PdfToImageTool: React.FC = () => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');

  const handlePDF = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }

    setLoading(true);
    setPages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      const images: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const image = canvas.toDataURL(
          format === 'png' ? 'image/png' : 'image/jpeg',
          0.9
        );

        images.push(image);
      }

      setPages(images);
    } catch (error) {
      console.error(error);
      alert('PDF থেকে Image তৈরি করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (src: string, index: number) => {
    const link = document.createElement('a');

    link.href = src;
    link.download = `ToolBox-BD-page-${index + 1}.${format === 'png' ? 'png' : 'jpg'}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          PDF to Image
        </h2>

        <p className="text-slate-500 mb-5">
          Convert PDF pages to JPG or PNG directly in your browser.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">

          <label className="flex-1">
            <span className="block text-sm font-medium text-slate-700 mb-2">
              Select PDF
            </span>

            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  handlePDF(file);
                }
              }}
              className="block w-full text-sm border border-slate-300 rounded-xl p-3"
            />
          </label>

          <div>
            <span className="block text-sm font-medium text-slate-700 mb-2">
              Format
            </span>

            <select
              value={format}
              onChange={(e) =>
                setFormat(e.target.value as 'jpeg' | 'png')
              }
              className="border border-slate-300 rounded-xl p-3"
            >
              <option value="jpeg">JPG</option>
              <option value="png">PNG</option>
            </select>
          </div>

        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-blue-600 font-medium">
              Converting PDF pages...
            </p>
          </div>
        )}

        {!loading && pages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">

            {pages.map((image, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-xl p-3 bg-slate-50"
              >

                <img
                  src={image}
                  alt={`PDF page ${index + 1}`}
                  className="w-full rounded-lg bg-white"
                />

                <div className="flex items-center justify-between gap-3 mt-3">

                  <span className="text-sm font-medium text-slate-700">
                    Page {index + 1}
                  </span>

                  <button
                    onClick={() => downloadImage(image, index)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Download
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

        {!loading && pages.length === 0 && (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
            Select a PDF file to see page previews here.
          </div>
        )}

      </div>
    </div>
  );
};

export default PdfToImageTool;
