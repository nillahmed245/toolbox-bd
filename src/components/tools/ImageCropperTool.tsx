import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Crop as CropIcon,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Trash2,
  Check,
  Sparkles,
  Sliders,
  FileImage,
  Move,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

type AspectRatio = 'free' | '1:1' | '4:3' | '16:9' | '9:16';

interface CropBox {
  x: number; // percentage (0 - 100) or pixel in crop stage
  y: number;
  width: number;
  height: number;
}

export const ImageCropperTool: React.FC = () => {
  const { showToast } = useToast();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Crop Controls
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('free');
  const [zoom, setZoom] = useState<number>(1); // 1x to 3x
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Position offset of image inside viewport
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Output format & quality
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(92);

  // Cropped preview state
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string>('');
  const [croppedDimensions, setCroppedDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [croppedBytes, setCroppedBytes] = useState<number>(0);
  const [isRendering, setIsRendering] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Process uploaded image file
  const processFile = useCallback(
    (file: File) => {
      if (!SUPPORTED_TYPES.includes(file.type)) {
        showToast('Unsupported file type. Please upload a JPG, PNG, or WebP image.', 'error');
        return;
      }

      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        imageElementRef.current = img;
        setImageSrc(url);
        setImageName(file.name);
        setImageMime(file.type);
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setZoom(1);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setPanOffset({ x: 0, y: 0 });
        showToast(`Loaded ${file.name} (${img.naturalWidth} × ${img.naturalHeight}px)`, 'success');
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        showToast('Failed to load image. The file might be corrupted.', 'error');
      };

      img.src = url;
    },
    [showToast]
  );

  // Drag and drop handlers on upload box
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Mouse & Touch Pan controls for the image stage
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - panOffset.x, y: clientY - panOffset.y });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPanOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(3.5, Math.max(0.5, parseFloat((prev + zoomDelta).toFixed(2)))));
  };

  // Generate Cropped Output via Canvas
  const generateCroppedResult = useCallback(() => {
    if (!imageElementRef.current || !stageRef.current) return;

    setIsRendering(true);
    const img = imageElementRef.current;
    const stage = stageRef.current;
    const stageRect = stage.getBoundingClientRect();

    if (stageRect.width === 0 || stageRect.height === 0) {
      setIsRendering(false);
      return;
    }

    // Determine target crop frame dimensions inside the stage
    let cropWidth = stageRect.width * 0.85;
    let cropHeight = stageRect.height * 0.85;

    if (aspectRatio === '1:1') {
      const size = Math.min(cropWidth, cropHeight);
      cropWidth = size;
      cropHeight = size;
    } else if (aspectRatio === '4:3') {
      if (cropWidth / cropHeight > 4 / 3) {
        cropWidth = cropHeight * (4 / 3);
      } else {
        cropHeight = cropWidth / (4 / 3);
      }
    } else if (aspectRatio === '16:9') {
      if (cropWidth / cropHeight > 16 / 9) {
        cropWidth = cropHeight * (16 / 9);
      } else {
        cropHeight = cropWidth / (16 / 9);
      }
    } else if (aspectRatio === '9:16') {
      if (cropWidth / cropHeight > 9 / 16) {
        cropWidth = cropHeight * (9 / 16);
      } else {
        cropHeight = cropWidth / (9 / 16);
      }
    }

    const cropX = (stageRect.width - cropWidth) / 2;
    const cropY = (stageRect.height - cropHeight) / 2;

    // Calculate image base display scale (contain mode)
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const baseScale = Math.min(stageRect.width / naturalW, stageRect.height / naturalH);
    const currentScale = baseScale * zoom;

    // Image center coordinates on stage
    const imgCenterX = stageRect.width / 2 + panOffset.x;
    const imgCenterY = stageRect.height / 2 + panOffset.y;

    // High resolution canvas export
    // Export resolution corresponds to the natural image pixels covered by the crop window
    const exportResolutionMultiplier = 1 / currentScale;
    const targetCanvasW = Math.max(1, Math.round(cropWidth * exportResolutionMultiplier));
    const targetCanvasH = Math.max(1, Math.round(cropHeight * exportResolutionMultiplier));

    const canvas = document.createElement('canvas');
    canvas.width = targetCanvasW;
    canvas.height = targetCanvasH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      setIsRendering(false);
      return;
    }

    // White background for transparent PNG when converting to JPEG
    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetCanvasW, targetCanvasH);
    }

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Translate coordinate origin to the center of the crop window
    ctx.translate(targetCanvasW / 2, targetCanvasH / 2);

    // Apply rotation and flips
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // Relative center of image from center of crop window in canvas pixel space
    const relCenterStageX = imgCenterX - (cropX + cropWidth / 2);
    const relCenterStageY = imgCenterY - (cropY + cropHeight / 2);

    const relCenterCanvasX = relCenterStageX * exportResolutionMultiplier;
    const relCenterCanvasY = relCenterStageY * exportResolutionMultiplier;

    // Draw the image centered
    const drawW = naturalW;
    const drawH = naturalH;
    ctx.drawImage(img, relCenterCanvasX - drawW / 2, relCenterCanvasY - drawH / 2, drawW, drawH);

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCroppedPreviewUrl((old) => {
            if (old) URL.revokeObjectURL(old);
            return URL.createObjectURL(blob);
          });
          setCroppedDimensions({ width: targetCanvasW, height: targetCanvasH });
          setCroppedBytes(blob.size);
        }
        setIsRendering(false);
      },
      outputFormat,
      quality / 100
    );
  }, [aspectRatio, zoom, rotation, flipH, flipV, panOffset, outputFormat, quality]);

  // Debounce live preview update when crop parameters change
  useEffect(() => {
    if (!imageSrc) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      generateCroppedResult();
    }, 150);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [imageSrc, aspectRatio, zoom, rotation, flipH, flipV, panOffset, outputFormat, quality, generateCroppedResult]);

  // Reset adjustments (zoom, pan, rotation, flip)
  const handleResetAdjustments = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setPanOffset({ x: 0, y: 0 });
    showToast('Crop adjustments reset to default', 'info');
  };

  // Clear loaded image
  const handleClearImage = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
    setImageSrc(null);
    setImageName('');
    setCroppedPreviewUrl('');
    setCroppedBytes(0);
    imageElementRef.current = null;
    showToast('Image cleared', 'info');
  };

  // Download cropped image
  const handleDownload = () => {
    if (!croppedPreviewUrl) return;

    let ext = 'jpg';
    if (outputFormat === 'image/png') ext = 'png';
    else if (outputFormat === 'image/webp') ext = 'webp';

    const baseName = imageName.substring(0, imageName.lastIndexOf('.')) || imageName;
    const filename = `${baseName}-cropped.${ext}`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = croppedPreviewUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloaded ${filename}!`, 'success');
  };

  // Calculate crop window frame style for the visual overlay
  const getCropBoxStyle = () => {
    switch (aspectRatio) {
      case '1:1':
        return { aspectRatio: '1 / 1', maxWidth: '85%', maxHeight: '85%' };
      case '4:3':
        return { aspectRatio: '4 / 3', maxWidth: '85%', maxHeight: '85%' };
      case '16:9':
        return { aspectRatio: '16 / 9', maxWidth: '85%', maxHeight: '85%' };
      case '9:16':
        return { aspectRatio: '9 / 16', maxWidth: '85%', maxHeight: '85%' };
      case 'free':
      default:
        return { width: '85%', height: '85%' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone when no image is loaded */}
      {!imageSrc ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative rounded-3xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50 p-8 sm:p-14 text-center cursor-pointer transition-all duration-200"
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
              <CropIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Upload image to crop
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
              <span>Touch & Drag controls</span>
              <span>·</span>
              <span className="text-emerald-600 font-semibold">100% In-Browser</span>
            </div>
          </div>
        </div>
      ) : (
        /* Workspace when image is loaded */
        <div className="space-y-6">
          {/* Top Info Bar */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <FileImage className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{imageName}</h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>
                    Original: <strong className="text-slate-700">{originalDimensions.width} × {originalDimensions.height}px</strong>
                  </span>
                  <span>·</span>
                  <span>Zoom: {Math.round(zoom * 100)}%</span>
                  {rotation > 0 && (
                    <>
                      <span>·</span>
                      <span>Rotated {rotation}°</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleResetAdjustments}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors font-medium flex items-center gap-1.5 min-h-[36px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset View</span>
              </button>

              <button
                type="button"
                onClick={handleClearImage}
                className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium flex items-center gap-1.5 min-h-[36px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Change Image</span>
              </button>
            </div>
          </div>

          {/* Aspect Ratio Selector Pills */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-slate-500 px-3 uppercase tracking-wider shrink-0">
              Aspect Ratio:
            </span>

            {[
              { id: 'free', label: 'Freeform' },
              { id: '1:1', label: 'Square (1:1)' },
              { id: '4:3', label: 'Standard (4:3)' },
              { id: '16:9', label: 'Widescreen (16:9)' },
              { id: '9:16', label: 'Portrait / Story (9:16)' },
            ].map((ratio) => (
              <button
                key={ratio.id}
                type="button"
                onClick={() => setAspectRatio(ratio.id as AspectRatio)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap min-h-[38px] ${
                  aspectRatio === ratio.id
                    ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>

          {/* Interactive Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Stage & Transform Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Interactive Cropping Viewport */}
              <div
                ref={stageRef}
                onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
                onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches.length === 1) {
                    handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchEnd={handlePointerUp}
                onWheel={handleWheel}
                className="relative h-80 sm:h-96 w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none"
              >
                {/* Image Layer undergoing transform */}
                <img
                  src={imageSrc}
                  alt="Crop Stage"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) rotate(${rotation}deg) scale(${
                      flipH ? -zoom : zoom
                    }, ${flipV ? -zoom : zoom})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.08s ease-out',
                  }}
                  className="max-h-full max-w-full object-contain pointer-events-none"
                />

                {/* Dark Vignette Overlay outside the crop frame */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
                  <div
                    style={getCropBoxStyle()}
                    className="relative border-2 border-white/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] rounded-lg pointer-events-none flex items-center justify-center"
                  >
                    {/* Grid rule of thirds lines */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                      <div className="border-r border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-b border-white/20" />
                      <div className="border-r border-white/20" />
                      <div className="border-r border-white/20" />
                      <div />
                    </div>

                    {/* Corner Reticle Markers */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
                  </div>
                </div>

                {/* Drag hint chip */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-full border border-slate-700/80 pointer-events-none flex items-center gap-1.5">
                  <Move className="w-3 h-3 text-blue-400" />
                  <span>Drag to reposition · Scroll or slider to zoom</span>
                </div>
              </div>

              {/* Transform Control Buttons Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-4">
                {/* Zoom Slider */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.max(0.5, parseFloat((prev - 0.2).toFixed(2))))}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Zoom Level</span>
                      <span className="font-mono text-blue-600">{Math.round(zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.5"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.min(3.5, parseFloat((prev + 0.2).toFixed(2))))}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Rotate & Flip Tools */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 flex items-center gap-1 min-h-[36px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Rotate Left</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 flex items-center gap-1 min-h-[36px]"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Rotate Right</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFlipH(!flipH)}
                      className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 min-h-[36px] ${
                        flipH
                          ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span>Flip H</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFlipV(!flipV)}
                      className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 min-h-[36px] ${
                        flipV
                          ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <FlipVertical className="w-3.5 h-3.5" />
                      <span>Flip V</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Cropped Result Preview & Export (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Cropped Result Preview
                  </span>
                  {croppedDimensions.width > 0 && (
                    <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {croppedDimensions.width} × {croppedDimensions.height}px
                    </span>
                  )}
                </div>

                {/* Preview Box */}
                <div className="h-64 sm:h-72 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3 relative">
                  {isRendering ? (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="text-xs font-medium">Processing crop...</span>
                    </div>
                  ) : croppedPreviewUrl ? (
                    <img
                      src={croppedPreviewUrl}
                      alt="Cropped preview"
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                    />
                  ) : (
                    <div className="text-xs text-slate-400">Preview rendering...</div>
                  )}
                </div>

                {/* Output Format and Quality */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Output Format
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) =>
                        setOutputFormat(e.target.value as 'image/jpeg' | 'image/png' | 'image/webp')
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                    >
                      <option value="image/jpeg">JPG / JPEG</option>
                      <option value="image/png">PNG (Lossless)</option>
                      <option value="image/webp">WebP (Compact)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Quality: {quality}%
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      step="5"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      disabled={outputFormat === 'image/png'}
                      className="w-full accent-blue-600 cursor-pointer mt-1"
                    />
                  </div>
                </div>

                {/* File size indicator */}
                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <span>Estimated File Size:</span>
                  <strong className="text-slate-800 font-mono">
                    {croppedBytes > 0 ? formatBytes(croppedBytes) : 'Calculating...'}
                  </strong>
                </div>

                {/* Download Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!croppedPreviewUrl || isRendering}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Cropped Image</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  100% private: Image cropping executes locally inside your web browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
