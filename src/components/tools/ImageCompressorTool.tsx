import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Image as ImageIcon,
  Sliders,
  Trash2,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Info,
  Layers,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface CompressedImageItem {
  id: string;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalUrl: string;
  compressedSize: number;
  compressedWidth: number;
  compressedHeight: number;
  compressedUrl: string;
  savingsPercentage: number;
  isProcessing: boolean;
  mimeType: string;
}

export const ImageCompressorTool: React.FC = () => {
  const { showToast } = useToast();
  const [images, setImages] = useState<CompressedImageItem[]>([]);
  const [quality, setQuality] = useState<number>(75); // 10 to 100
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'original'>('image/jpeg');
  const [maxDimension, setMaxDimension] = useState<number>(0); // 0 = original, or 1920, 1280, etc.
  const [isDragging, setIsDragging] = useState(false);
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size nicely
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Canvas compression function
  const compressSingleImage = useCallback(
    async (
      imgElement: HTMLImageElement,
      originalMime: string,
      targetQuality: number,
      targetFormat: string,
      maxDim: number
    ): Promise<{ blob: Blob; width: number; height: number }> => {
      let { width, height } = imgElement;

      // Downscale if maxDimension is set and exceeded
      if (maxDim > 0 && (width > maxDim || height > maxDim)) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        throw new Error('Canvas context could not be created');
      }

      // Draw white background for transparency in JPEG conversion
      let chosenMime = targetFormat === 'original' ? originalMime : targetFormat;
      if (chosenMime === 'image/jpeg' || chosenMime === 'image/jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(imgElement, 0, 0, width, height);

      return new Promise((resolve, reject) => {
        const qualityRatio = targetQuality / 100;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, width, height });
            } else {
              reject(new Error('Canvas compression failed'));
            }
          },
          chosenMime,
          qualityRatio
        );
      });
    },
    []
  );

  // Process files when added
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const validFiles = Array.from(files).filter((file) =>
        file.type.startsWith('image/')
      );

      if (validFiles.length === 0) return;

      const newItems: CompressedImageItem[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        originalSize: file.size,
        originalWidth: 0,
        originalHeight: 0,
        originalUrl: URL.createObjectURL(file),
        compressedSize: 0,
        compressedWidth: 0,
        compressedHeight: 0,
        compressedUrl: '',
        savingsPercentage: 0,
        isProcessing: true,
        mimeType: file.type || 'image/jpeg',
      }));

      setImages((prev) => [...prev, ...newItems]);
      if (!activePreviewId && newItems.length > 0) {
        setActivePreviewId(newItems[0].id);
      }

      // Process each file
      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];
        const img = new Image();
        img.src = item.originalUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        try {
          const { blob, width, height } = await compressSingleImage(
            img,
            item.mimeType,
            quality,
            outputFormat,
            maxDimension
          );

          const compressedUrl = URL.createObjectURL(blob);
          const savings = Math.max(
            0,
            Math.round(((item.originalSize - blob.size) / item.originalSize) * 100)
          );

          setImages((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? {
                    ...p,
                    originalWidth: img.naturalWidth,
                    originalHeight: img.naturalHeight,
                    compressedSize: blob.size,
                    compressedWidth: width,
                    compressedHeight: height,
                    compressedUrl,
                    savingsPercentage: savings,
                    isProcessing: false,
                  }
                : p
            )
          );
        } catch {
          setImages((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, isProcessing: false } : p
            )
          );
        }
      }
    },
    [compressSingleImage, quality, outputFormat, maxDimension, activePreviewId]
  );

  // Re-compress existing images when settings change
  const recompressAll = useCallback(
    async (
      newQuality: number,
      newFormat: string,
      newMaxDim: number
    ) => {
      setImages((prev) =>
        prev.map((item) => ({ ...item, isProcessing: true }))
      );

      for (const item of images) {
        const img = new Image();
        img.src = item.originalUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        try {
          const { blob, width, height } = await compressSingleImage(
            img,
            item.mimeType,
            newQuality,
            newFormat,
            newMaxDim
          );

          // Revoke old compressed URL to free memory
          if (item.compressedUrl) {
            URL.revokeObjectURL(item.compressedUrl);
          }

          const compressedUrl = URL.createObjectURL(blob);
          const savings = Math.max(
            0,
            Math.round(((item.originalSize - blob.size) / item.originalSize) * 100)
          );

          setImages((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? {
                    ...p,
                    compressedSize: blob.size,
                    compressedWidth: width,
                    compressedHeight: height,
                    compressedUrl,
                    savingsPercentage: savings,
                    isProcessing: false,
                  }
                : p
            )
          );
        } catch {
          setImages((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, isProcessing: false } : p
            )
          );
        }
      }
    },
    [images, compressSingleImage]
  );

  // Drag and drop handlers
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const item = images.find((i) => i.id === id);
    if (item) {
      URL.revokeObjectURL(item.originalUrl);
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
    }
    setImages((prev) => prev.filter((i) => i.id !== id));
    if (activePreviewId === id) {
      const remaining = images.filter((i) => i.id !== id);
      setActivePreviewId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleClearAll = () => {
    images.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
    });
    setImages([]);
    setActivePreviewId(null);
    showToast('All images removed from queue', 'info');
  };

  const downloadImage = (item: CompressedImageItem) => {
    if (!item.compressedUrl) return;
    const link = document.createElement('a');
    const ext = outputFormat === 'image/webp' ? 'webp' : 'jpg';
    const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    const downloadName = `${baseName}-compressed.${ext}`;
    link.download = downloadName;
    link.href = item.compressedUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${downloadName}!`, 'success');
  };

  const downloadAll = () => {
    images.forEach((item, index) => {
      if (item.compressedUrl) {
        setTimeout(() => downloadImage(item), index * 200);
      }
    });
    showToast(`Downloading all ${images.length} compressed images...`, 'info');
  };

  // Active preview item
  const activeItem = images.find((i) => i.id === activePreviewId) || images[0];

  // Aggregated stats
  const totalOriginalBytes = images.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressedBytes = images.reduce((acc, curr) => acc + (curr.compressedSize || curr.originalSize), 0);
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalCompressedBytes);
  const overallSavings =
    totalOriginalBytes > 0
      ? Math.round((totalSavedBytes / totalOriginalBytes) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/jpg"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
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
              Drag & Drop your images here
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              or <span className="text-blue-600 font-semibold hover:underline">browse files</span> from your phone or computer
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
            <span>Supports JPG, PNG, WebP</span>
            <span>·</span>
            <span>Up to 50MB per file</span>
            <span>·</span>
            <span className="text-emerald-600 font-semibold">100% In-Browser</span>
          </div>
        </div>
      </div>

      {/* When Images Are Loaded */}
      {images.length > 0 && (
        <div className="space-y-6">
          {/* Global Compression Controls Toolbar */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Compression Settings
                </h3>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium flex items-center gap-1 min-h-[36px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Sliders and Format Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
              {/* Quality Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Image Quality:</span>
                  <span className="text-blue-600 font-mono text-sm">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={quality}
                  onChange={(e) => {
                    const newQ = Number(e.target.value);
                    setQuality(newQ);
                    recompressAll(newQ, outputFormat, maxDimension);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Max Compression (10%)</span>
                  <span>Balanced (75%)</span>
                  <span>High Quality (100%)</span>
                </div>
              </div>

              {/* Target Format */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Target Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => {
                    const newFmt = e.target.value as 'image/jpeg' | 'image/webp' | 'original';
                    setOutputFormat(newFmt);
                    recompressAll(quality, newFmt, maxDimension);
                  }}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                >
                  <option value="image/jpeg">JPG / JPEG (Widely compatible)</option>
                  <option value="image/webp">WebP (Modern & Smallest size)</option>
                  <option value="original">Preserve Original Type</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  WebP offers ~30% higher compression efficiency than JPG.
                </p>
              </div>

              {/* Max Resolution Constraint */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Max Dimension (Optional Scaling)
                </label>
                <select
                  value={maxDimension}
                  onChange={(e) => {
                    const newDim = Number(e.target.value);
                    setMaxDimension(newDim);
                    recompressAll(quality, outputFormat, newDim);
                  }}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                >
                  <option value="0">Original Resolution (No resize)</option>
                  <option value="1920">Full HD (Max 1920px width/height)</option>
                  <option value="1280">Standard HD (Max 1280px)</option>
                  <option value="800">Compact Web (Max 800px)</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  Downscaling large camera photos saves up to 90% space.
                </p>
              </div>
            </div>
          </div>

          {/* Aggregate Summary Banner */}
          <div className="bg-blue-600 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                Compression Summary ({images.length} {images.length === 1 ? 'image' : 'images'})
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Saved {overallSavings}% space
                </span>
                <span className="text-blue-100 text-xs sm:text-sm">
                  ({formatBytes(totalOriginalBytes)} → {formatBytes(totalCompressedBytes)})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={downloadAll}
                className="w-full md:w-auto px-5 py-3 bg-white hover:bg-slate-100 text-blue-700 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>Download All ({images.length})</span>
              </button>
            </div>
          </div>

          {/* Active Image Comparison Box */}
          {activeItem && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-slate-900 truncate">
                    {activeItem.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>Original: {formatBytes(activeItem.originalSize)}</span>
                    <span>→</span>
                    <span className="text-emerald-600 font-semibold">
                      Compressed: {formatBytes(activeItem.compressedSize)}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold text-[10px]">
                      -{activeItem.savingsPercentage}%
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => downloadImage(activeItem)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 min-h-[40px] shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download This File</span>
                </button>
              </div>

              {/* Side-by-side or stacked visual preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Original File</span>
                    <span>
                      {activeItem.originalWidth} × {activeItem.originalHeight}px
                    </span>
                  </div>
                  <div className="h-64 sm:h-80 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-2">
                    <img
                      src={activeItem.originalUrl}
                      alt="Original preview"
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Optimized Output ({quality}%)
                    </span>
                    <span>
                      {activeItem.compressedWidth} × {activeItem.compressedHeight}px
                    </span>
                  </div>
                  <div className="h-64 sm:h-80 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-2 relative">
                    {activeItem.isProcessing ? (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                        <span className="text-xs">Compressing...</span>
                      </div>
                    ) : (
                      <img
                        src={activeItem.compressedUrl}
                        alt="Compressed preview"
                        className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* List of Loaded Images */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Queue & Processed Files ({images.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {images.map((item) => {
                const isSelected = activeItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActivePreviewId(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                      <img
                        src={item.compressedUrl || item.originalUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </h5>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span className="line-through">{formatBytes(item.originalSize)}</span>
                        <span>→</span>
                        <span className="text-emerald-600 font-semibold">
                          {formatBytes(item.compressedSize)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(item);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleRemoveImage(item.id, e)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
