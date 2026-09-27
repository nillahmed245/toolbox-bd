import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Lock,
  Unlock,
  RefreshCw,
  Trash2,
  Maximize2,
  Sparkles,
  AlertCircle,
  FileImage,
  Check,
  Sliders,
  Image as ImageIcon,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ImageDetails {
  file: File;
  name: string;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  aspectRatio: number;
  originalUrl: string;
  mimeType: string;
}

export const ImageResizerTool: React.FC = () => {
  const { showToast } = useToast();

  const [image, setImage] = useState<ImageDetails | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [targetFormat, setTargetFormat] = useState<'original' | 'image/jpeg' | 'image/png' | 'image/webp'>('original');
  const [quality, setQuality] = useState<number>(90);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Live preview state
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resizedSize, setResizedSize] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Format bytes helper
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Supported image MIME types
  const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  // Handle image upload and validation
  const processFile = useCallback((file: File) => {
    if (!SUPPORTED_TYPES.includes(file.type)) {
      showToast('Unsupported file type. Please upload a JPG, PNG, or WebP image.', 'error');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const origW = img.naturalWidth;
      const origH = img.naturalHeight;
      const ratio = origW / origH;

      setImage({
        file,
        name: file.name,
        originalWidth: origW,
        originalHeight: origH,
        originalSize: file.size,
        aspectRatio: ratio,
        originalUrl: objectUrl,
        mimeType: file.type,
      });

      setWidth(origW);
      setHeight(origH);
      showToast(`Loaded ${file.name} (${origW} × ${origH}px)`, 'success');
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      showToast('Failed to load image. The file might be corrupted.', 'error');
    };

    img.src = objectUrl;
  }, [showToast]);

  // Handle Drag & Drop
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Dimension Change Handlers
  const handleWidthChange = (val: number) => {
    const newWidth = Math.max(1, Math.min(15000, val || 1));
    setWidth(newWidth);
    if (lockAspectRatio && image) {
      setHeight(Math.max(1, Math.round(newWidth / image.aspectRatio)));
    }
  };

  const handleHeightChange = (val: number) => {
    const newHeight = Math.max(1, Math.min(15000, val || 1));
    setHeight(newHeight);
    if (lockAspectRatio && image) {
      setWidth(Math.max(1, Math.round(newHeight * image.aspectRatio)));
    }
  };

  // Percentage Scaling Preset
  const handleScalePercentage = (pct: number) => {
    if (!image) return;
    const newW = Math.max(1, Math.round(image.originalWidth * (pct / 100)));
    const newH = Math.max(1, Math.round(image.originalHeight * (pct / 100)));
    setWidth(newW);
    setHeight(newH);
    showToast(`Scaled to ${pct}% (${newW} × ${newH}px)`, 'info');
  };

  // Common Presets
  const applyPreset = (presetW: number, presetH: number, label: string) => {
    setLockAspectRatio(false);
    setWidth(presetW);
    setHeight(presetH);
    showToast(`Applied preset: ${label} (${presetW} × ${presetH}px)`, 'info');
  };

  // Live Canvas Resizing & Preview generator
  const generatePreview = useCallback(() => {
    if (!image || width <= 0 || height <= 0) return;

    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      const chosenMime =
        targetFormat === 'original' ? image.mimeType : targetFormat;

      // Fill white background for transparent PNG when converting to JPEG
      if (chosenMime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const qRatio = quality / 100;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setPreviewUrl((oldUrl) => {
              if (oldUrl) URL.revokeObjectURL(oldUrl);
              return URL.createObjectURL(blob);
            });
            setResizedSize(blob.size);
          }
          setIsProcessing(false);
        },
        chosenMime,
        qRatio
      );
    };

    img.src = image.originalUrl;
  }, [image, width, height, targetFormat, quality]);

  // Debounced preview update when dimensions, format, or quality change
  useEffect(() => {
    if (!image) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      generatePreview();
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [image, width, height, targetFormat, quality, generatePreview]);

  // Reset / Clear Image
  const handleReset = () => {
    if (image) {
      URL.revokeObjectURL(image.originalUrl);
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setWidth(0);
    setHeight(0);
    setPreviewUrl('');
    setResizedSize(0);
    showToast('Image cleared', 'info');
  };

  // Revert back to original dimensions
  const handleRevertOriginal = () => {
    if (!image) return;
    setWidth(image.originalWidth);
    setHeight(image.originalHeight);
    showToast('Reset to original dimensions', 'info');
  };

  // Download the resized image
  const handleDownload = () => {
    if (!image || !previewUrl) return;

    const chosenMime =
      targetFormat === 'original' ? image.mimeType : targetFormat;
    let ext = 'jpg';
    if (chosenMime === 'image/png') ext = 'png';
    else if (chosenMime === 'image/webp') ext = 'webp';

    const baseName =
      image.name.substring(0, image.name.lastIndexOf('.')) || image.name;
    const downloadFilename = `${baseName}-${width}x${height}.${ext}`;

    const link = document.createElement('a');
    link.download = downloadFilename;
    link.href = previewUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloaded ${downloadFilename}!`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone (shown when no image is loaded) */}
      {!image ? (
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
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                processFile(e.target.files[0]);
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
                Upload image to resize
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Drag and drop your file here or{' '}
                <span className="text-blue-600 font-semibold hover:underline">
                  browse from device
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
              <span>Supports JPG, PNG, WebP</span>
              <span>·</span>
              <span>Preserves resolution clarity</span>
              <span>·</span>
              <span className="text-emerald-600 font-semibold">100% In-Browser</span>
            </div>
          </div>
        </div>
      ) : (
        /* Workspace when image is active */
        <div className="space-y-6">
          {/* Top Info Bar */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <FileImage className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {image.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>
                    Original: <strong className="text-slate-700">{image.originalWidth} × {image.originalHeight}px</strong>
                  </span>
                  <span>·</span>
                  <span>{formatBytes(image.originalSize)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleRevertOriginal}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors font-medium flex items-center gap-1.5 min-h-[36px]"
                title="Reset dimensions to original"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Size</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium flex items-center gap-1.5 min-h-[36px]"
                title="Clear and choose another image"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Main Grid: Controls on Left, Live Preview on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Dimension Settings Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-blue-600" />
                    <span>Target Dimensions</span>
                  </h3>

                  {/* Lock Aspect Ratio Toggle */}
                  <button
                    type="button"
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors min-h-[36px] ${
                      lockAspectRatio
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lockAspectRatio ? (
                      <Lock className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{lockAspectRatio ? 'Ratio Locked' : 'Ratio Unlocked'}</span>
                  </button>
                </div>

                {/* Width & Height Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Width (Pixels)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="15000"
                        value={width || ''}
                        onChange={(e) => handleWidthChange(parseInt(e.target.value, 10))}
                        className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="Width"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-sans pointer-events-none">
                        px
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Height (Pixels)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="15000"
                        value={height || ''}
                        onChange={(e) => handleHeightChange(parseInt(e.target.value, 10))}
                        className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="Height"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-sans pointer-events-none">
                        px
                      </span>
                    </div>
                  </div>
                </div>

                {/* Percentage Quick Scaling */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-medium text-slate-600">Quick Scale Percentage:</span>
                  <div className="flex flex-wrap gap-2">
                    {[25, 50, 75, 100, 150, 200].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleScalePercentage(pct)}
                        className="px-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg transition-colors min-h-[36px]"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Social Media & Standard Presets */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-600">Standard Presets:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { label: 'Passport Photo', w: 600, h: 600 },
                      { label: 'Square (1:1)', w: 1080, h: 1080 },
                      { label: 'Full HD (16:9)', w: 1920, h: 1080 },
                      { label: 'Story / Reel (9:16)', w: 1080, h: 1920 },
                      { label: 'YouTube Thumbnail', w: 1280, h: 720 },
                      { label: 'Facebook Cover', w: 820, h: 312 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyPreset(preset.w, preset.h, preset.label)}
                        className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                      >
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {preset.label}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {preset.w} × {preset.h}px
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Format & Quality Settings Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Output Format & Quality</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Save As Format
                    </label>
                    <select
                      value={targetFormat}
                      onChange={(e) =>
                        setTargetFormat(
                          e.target.value as 'original' | 'image/jpeg' | 'image/png' | 'image/webp'
                        )
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                    >
                      <option value="original">Original ({image.mimeType.replace('image/', '').toUpperCase()})</option>
                      <option value="image/jpeg">JPG / JPEG (Universal)</option>
                      <option value="image/png">PNG (Lossless Transparency)</option>
                      <option value="image/webp">WebP (High Compression)</option>
                    </select>
                  </div>

                  {(targetFormat === 'image/jpeg' ||
                    targetFormat === 'image/webp' ||
                    (targetFormat === 'original' &&
                      (image.mimeType === 'image/jpeg' || image.mimeType === 'image/webp'))) && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Quality:</span>
                        <span className="text-blue-600 font-mono">{quality}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Live Resized Preview & Download (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Live Preview
                  </span>
                  <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {width} × {height}px
                  </span>
                </div>

                {/* Preview Viewport */}
                <div className="h-64 sm:h-72 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3 relative">
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="text-xs font-medium">Rendering resize preview...</span>
                    </div>
                  ) : previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Resized preview"
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                    />
                  ) : (
                    <div className="text-xs text-slate-400">Preview rendering...</div>
                  )}
                </div>

                {/* Resized Metrics summary */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Output Size:</span>
                    <strong className="text-slate-800 font-mono">
                      {resizedSize > 0 ? formatBytes(resizedSize) : 'Calculating...'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scale Ratio:</span>
                    <span className="text-slate-700 font-mono">
                      {((width / image.originalWidth) * 100).toFixed(0)}% width · {((height / image.originalHeight) * 100).toFixed(0)}% height
                    </span>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isProcessing || width <= 0 || height <= 0}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resized Image</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  High-quality bicubic interpolation processed 100% locally in your browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
