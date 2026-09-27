import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import {
  Upload,
  Download,
  FileText,
  FileArchive,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Trash2,
  Eye,
  X,
  Sliders,
  Sparkles,
  Layers,
  AlertCircle,
  CheckSquare,
  Square,
  ZoomIn,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  size: number;
  selected: boolean;
}

export const PdfToImageTool: React.FC = () => {
  const { showToast } = useToast();

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pages, setPages] = useState<ConvertedPage[]>([]);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [scale, setScale] = useState<number>(2.0); // 1.0 (standard), 1.5, 2.0 (high-res), 3.0 (ultra)
  const [quality, setQuality] = useState<number>(92);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // Full-size preview modal
  const [previewPage, setPreviewPage] = useState<ConvertedPage | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Convert PDF ArrayBuffer into images
  const processPdf = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please upload a valid PDF document.', 'error');
      return;
    }

    setPdfFile(file);
    setIsProcessing(true);
    setPages([]);
    setProgress({ current: 0, total: 0 });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const numPages = pdf.numPages;
      setTotalPages(numPages);
      setProgress({ current: 0, total: numPages });
      showToast(`Loaded PDF: ${numPages} page${numPages > 1 ? 's' : ''}`, 'info');

      const convertedList: ConvertedPage[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        // If rendering JPEG, fill white background to prevent black background
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        // Render PDF page to canvas
        await page.render(renderContext).promise;

        // Export to Blob
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(
            (b) => resolve(b),
            format,
            format === 'image/jpeg' ? quality / 100 : undefined
          );
        });

        if (blob) {
          const dataUrl = URL.createObjectURL(blob);
          convertedList.push({
            pageNumber: pageNum,
            dataUrl,
            blob,
            width: viewport.width,
            height: viewport.height,
            size: blob.size,
            selected: true,
          });
        }

        setProgress({ current: pageNum, total: numPages });
      }

      setPages(convertedList);
      showToast(`Successfully converted ${convertedList.length} pages!`, 'success');
    } catch (err: any) {
      console.error(err);
      if (err.name === 'PasswordException') {
        showToast('This PDF is password-protected and cannot be converted.', 'error');
      } else {
        showToast('Error reading PDF document. The file might be corrupted.', 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processPdf(e.dataTransfer.files[0]);
    }
  };

  // Re-run conversion if format or scale changes
  const handleReconvert = () => {
    if (pdfFile) {
      // Revoke old object URLs
      pages.forEach((p) => URL.revokeObjectURL(p.dataUrl));
      processPdf(pdfFile);
    }
  };

  // Toggle page selection
  const togglePageSelection = (pageNum: number) => {
    setPages((prev) =>
      prev.map((p) => (p.pageNumber === pageNum ? { ...p, selected: !p.selected } : p))
    );
  };

  // Select all or none
  const toggleSelectAll = () => {
    const allSelected = pages.every((p) => p.selected);
    setPages((prev) => prev.map((p) => ({ ...p, selected: !allSelected })));
  };

  // Download single page
  const downloadSinglePage = (page: ConvertedPage) => {
    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    const baseName = pdfFile ? pdfFile.name.replace(/\.pdf$/i, '') : 'document';
    const pagePadded = String(page.pageNumber).padStart(2, '0');
    const filename = `${baseName}-page-${pagePadded}.${ext}`;

    const link = document.createElement('a');
    link.href = page.dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloaded Page ${page.pageNumber}!`, 'success');
  };

  // Download all or selected pages as ZIP
  const downloadZip = async (onlySelected: boolean = false) => {
    const pagesToZip = onlySelected ? pages.filter((p) => p.selected) : pages;

    if (pagesToZip.length === 0) {
      showToast('No pages selected to download.', 'warning');
      return;
    }

    setIsZipping(true);
    showToast(`Generating ZIP package for ${pagesToZip.length} pages...`, 'info');

    try {
      const zip = new JSZip();
      const ext = format === 'image/jpeg' ? 'jpg' : 'png';
      const baseName = pdfFile ? pdfFile.name.replace(/\.pdf$/i, '') : 'document';

      pagesToZip.forEach((page) => {
        const pagePadded = String(page.pageNumber).padStart(2, '0');
        const filename = `${baseName}-page-${pagePadded}.${ext}`;
        zip.file(filename, page.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `${baseName}-images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);

      showToast(`ZIP archive downloaded successfully!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to create ZIP package.', 'error');
    } finally {
      setIsZipping(false);
    }
  };

  // Reset / Clear
  const handleClear = () => {
    pages.forEach((p) => URL.revokeObjectURL(p.dataUrl));
    setPages([]);
    setPdfFile(null);
    setTotalPages(0);
    setProgress({ current: 0, total: 0 });
    setPreviewPage(null);
    showToast('Document cleared', 'info');
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div className="space-y-8">
      {/* Upload Zone (when no PDF is selected) */}
      {!pdfFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                processPdf(e.target.files[0]);
                e.target.value = '';
              }
            }}
          />

          <div className="max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
              <Upload className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Upload PDF to Convert
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Drag and drop your PDF here or{' '}
                <span className="text-blue-600 font-semibold hover:underline">
                  browse from device
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
              <span>Extracts all pages</span>
              <span>·</span>
              <span>Convert to JPG or PNG</span>
              <span>·</span>
              <span className="text-emerald-600 font-semibold">100% In-Browser Privacy</span>
            </div>
          </div>
        </div>
      ) : (
        /* Workspace when PDF is loaded */
        <div className="space-y-6">
          {/* Header Info & Actions Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {pdfFile.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>{formatBytes(pdfFile.size)}</span>
                  <span>·</span>
                  <span>{totalPages} Total Pages</span>
                  <span>·</span>
                  <span className="text-blue-600 font-semibold uppercase">
                    {format.replace('image/', '')} ({scale}x scale)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-end md:self-auto shrink-0">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium flex items-center gap-1.5 min-h-[36px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Upload New PDF</span>
              </button>
            </div>
          </div>

          {/* Conversion Settings Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Image Export Settings
                </h3>
              </div>

              {pages.length > 0 && !isProcessing && (
                <button
                  type="button"
                  onClick={handleReconvert}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 min-h-[32px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-render with these settings</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Output Format */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Target Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'image/jpeg' | 'image/png')}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                >
                  <option value="image/jpeg">JPG / JPEG (Small File Size)</option>
                  <option value="image/png">PNG (Lossless & Sharp)</option>
                </select>
              </div>

              {/* Resolution Scale */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Render Resolution
                </label>
                <select
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                >
                  <option value={1.0}>1x – Standard (Web / Fast)</option>
                  <option value={1.5}>1.5x – Medium Quality</option>
                  <option value={2.0}>2x – High Definition (Recommended)</option>
                  <option value={3.0}>3x – Ultra High Resolution</option>
                </select>
              </div>

              {/* Quality slider for JPG */}
              {format === 'image/jpeg' ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>JPEG Quality:</span>
                    <span className="text-blue-600 font-mono">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer mt-1"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <span className="block text-xs font-semibold text-slate-700">
                    PNG Compression
                  </span>
                  <div className="text-xs text-slate-500 pt-2">
                    Lossless image output with maximum pixel clarity.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar (during rendering) */}
          {isProcessing && (
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex justify-between text-xs font-semibold text-blue-900">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                  Rendering PDF pages to images...
                </span>
                <span className="font-mono">
                  {progress.current} / {progress.total} Pages ({Math.round((progress.current / (progress.total || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-blue-200/80 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-200"
                  style={{ width: `${(progress.current / (progress.total || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Bulk Download & Selection Action Bar */}
          {pages.length > 0 && (
            <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors font-medium min-h-[36px]"
                >
                  {selectedCount === pages.length ? (
                    <CheckSquare className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>
                    {selectedCount === pages.length ? 'Deselect All' : 'Select All'} ({selectedCount}/{pages.length})
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => downloadZip(true)}
                  disabled={isZipping || selectedCount === 0}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 min-h-[40px]"
                >
                  <FileArchive className="w-4 h-4" />
                  <span>
                    {isZipping ? 'Creating ZIP...' : `Download Selected as ZIP (${selectedCount})`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadZip(false)}
                  disabled={isZipping}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 min-h-[40px]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All as ZIP</span>
                </button>
              </div>
            </div>
          )}

          {/* Converted Pages Gallery Grid */}
          {pages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pages.map((p) => (
                <div
                  key={p.pageNumber}
                  className={`bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 ${
                    p.selected ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'
                  }`}
                >
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => togglePageSelection(p.pageNumber)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 min-h-[32px]"
                    >
                      {p.selected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Page {p.pageNumber}</span>
                    </button>

                    <span className="text-[10px] font-mono text-slate-400">
                      {formatBytes(p.size)}
                    </span>
                  </div>

                  {/* Thumbnail Preview with View / Zoom hover */}
                  <div
                    onClick={() => setPreviewPage(p)}
                    className="relative aspect-3/4 bg-slate-100 rounded-xl overflow-hidden border border-slate-200/80 cursor-pointer group flex items-center justify-center"
                    title="Click to view full preview"
                  >
                    <img
                      src={p.dataUrl}
                      alt={`Page ${p.pageNumber}`}
                      className="max-h-full max-w-full object-contain"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                      <ZoomIn className="w-6 h-6 drop-shadow-md" />
                      <span className="text-xs font-semibold drop-shadow-md">Full Preview</span>
                    </div>
                  </div>

                  {/* Resolution info & Individual Download Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {p.width} × {p.height}px
                    </span>

                    <button
                      type="button"
                      onClick={() => downloadSinglePage(p)}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg transition-colors flex items-center gap-1 min-h-[32px]"
                      title={`Download Page ${p.pageNumber}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full Resolution Preview Modal */}
      {previewPage && (
        <div
          onClick={() => setPreviewPage(null)}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Page {previewPage.pageNumber} Preview
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({previewPage.width} × {previewPage.height}px · {formatBytes(previewPage.size)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadSinglePage(previewPage)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Page</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewPage(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] flex items-center justify-center bg-slate-50">
              <img
                src={previewPage.dataUrl}
                alt={`Page ${previewPage.pageNumber} full preview`}
                className="max-w-full h-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
