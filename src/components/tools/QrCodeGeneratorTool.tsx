import React, { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import {
  Download,
  Copy,
  Check,
  RefreshCw,
  Globe,
  Type,
  Wifi,
  Mail,
  Phone,
  Palette,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

type QRType = 'url' | 'text' | 'wifi' | 'email' | 'phone';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export const QrCodeGeneratorTool: React.FC = () => {
  const { showToast } = useToast();
  const [qrType, setQrType] = useState<QRType>('url');
  
  // Specific input fields
  const [urlInput, setUrlInput] = useState('https://toolboxbd.com');
  const [textInput, setTextInput] = useState('ToolBox BD – Free Online Tools');
  
  // Wi-Fi inputs
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // Email inputs
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Phone inputs
  const [phoneNumber, setPhoneNumber] = useState('');

  // QR Customization
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('M');
  const [size, setSize] = useState<number>(260);

  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Compute final QR payload
  const getPayload = (): string => {
    switch (qrType) {
      case 'url':
        return urlInput.trim();
      case 'text':
        return textInput;
      case 'wifi': {
        const ssid = wifiSsid.replace(/([\\;,:"])/g, '\\$1');
        const pass = wifiPassword.replace(/([\\;,:"])/g, '\\$1');
        const type = wifiEncryption === 'nopass' ? 'nopass' : wifiEncryption;
        return `WIFI:S:${ssid};T:${type};P:${pass};H:${wifiHidden ? 'true' : 'false'};;`;
      }
      case 'email': {
        const params = new URLSearchParams();
        if (emailSubject) params.append('subject', emailSubject);
        if (emailBody) params.append('body', emailBody);
        const query = params.toString() ? `?${params.toString()}` : '';
        return `mailto:${emailTo.trim()}${query}`;
      }
      case 'phone':
        return `tel:${phoneNumber.trim()}`;
      default:
        return 'https://toolboxbd.com';
    }
  };

  const payload = getPayload() || 'https://toolboxbd.com';

  // Download handlers
  const handleDownloadPng = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Create high-res download
    const highResCanvas = document.createElement('canvas');
    const scale = 4; // High DPI 4x export
    highResCanvas.width = size * scale;
    highResCanvas.height = size * scale;
    const ctx = highResCanvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, highResCanvas.width, highResCanvas.height);

    const imageUri = highResCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `toolbox-bd-qr-${Date.now()}.png`;
    link.href = imageUri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('QR Code (PNG) downloaded successfully!', 'success');
  };

  const handleDownloadSvg = () => {
    const svgElem = canvasRef.current?.querySelector('svg');
    if (!svgElem) return;

    const svgData = new XMLSerializer().serializeToString(svgElem);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.download = `toolbox-bd-qr-${Date.now()}.svg`;
    link.href = svgUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(svgUrl);
    showToast('Vector QR Code (SVG) downloaded!', 'success');
  };

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      showToast('QR content copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Type Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setQrType('url')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap min-h-[40px] ${
            qrType === 'url'
              ? 'bg-white text-blue-600 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Website URL</span>
        </button>

        <button
          onClick={() => setQrType('text')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap min-h-[40px] ${
            qrType === 'text'
              ? 'bg-white text-blue-600 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Plain Text</span>
        </button>

        <button
          onClick={() => setQrType('wifi')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap min-h-[40px] ${
            qrType === 'wifi'
              ? 'bg-white text-blue-600 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>Wi-Fi Network</span>
        </button>

        <button
          onClick={() => setQrType('email')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap min-h-[40px] ${
            qrType === 'email'
              ? 'bg-white text-blue-600 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </button>

        <button
          onClick={() => setQrType('phone')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap min-h-[40px] ${
            qrType === 'phone'
              ? 'bg-white text-blue-600 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Phone Call</span>
        </button>
      </div>

      {/* Main Studio Grid: Controls & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form & Design Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dynamic Content Inputs */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200/90 p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              1. Enter Content
            </h3>

            {qrType === 'url' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Target Website Link (URL)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Include &apos;https://&apos; so phones open the web browser automatically.
                </p>
              </div>
            )}

            {qrType === 'text' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Message or Content
                </label>
                <textarea
                  rows={3}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter any text message, note, or code snippet..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <div className="text-[11px] text-slate-400 text-right">
                  {textInput.length} characters
                </div>
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="e.g. Home_WiFi_5G"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Wi-Fi Password
                  </label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Password (leave empty if open network)"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Security Type
                    </label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) =>
                        setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="wifiHidden"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <label htmlFor="wifiHidden" className="text-xs text-slate-700 font-medium">
                      Hidden SSID
                    </label>
                  </div>
                </div>
              </div>
            )}

            {qrType === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g. Project Inquiry"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Message
                  </label>
                  <textarea
                    rows={2}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Pre-filled email body..."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {qrType === 'phone' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +8801700000000"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <p className="text-[11px] text-slate-400">
                  Include international country prefix (e.g., +880 for Bangladesh).
                </p>
              </div>
            )}
          </div>

          {/* Design & Style Customization */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                2. Colors & Appearance
              </h3>
              <button
                type="button"
                onClick={() => {
                  setFgColor('#0f172a');
                  setBgColor('#ffffff');
                  setErrorLevel('M');
                  setIncludeMargin(true);
                }}
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Styles
              </button>
            </div>

            {/* Quick color preset palettes */}
            <div className="space-y-2">
              <span className="text-xs text-slate-600 font-medium">Color Presets:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Classic', fg: '#0f172a', bg: '#ffffff' },
                  { label: 'Brand Blue', fg: '#1d4ed8', bg: '#ffffff' },
                  { label: 'Emerald', fg: '#047857', bg: '#ffffff' },
                  { label: 'Dark Mode', fg: '#ffffff', bg: '#0f172a' },
                  { label: 'Violet', fg: '#6d28d9', bg: '#fbfbfe' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setFgColor(preset.fg);
                      setBgColor(preset.bg);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs text-slate-700 transition-colors"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300"
                      style={{ backgroundColor: preset.fg }}
                    />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Error Correction Level
                </label>
                <select
                  value={errorLevel}
                  onChange={(e) => setErrorLevel(e.target.value as ErrorCorrectionLevel)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                >
                  <option value="L">L – Low (7% damage recovery)</option>
                  <option value="M">M – Medium (15% recovery)</option>
                  <option value="Q">Q – Quartile (25% recovery)</option>
                  <option value="H">H – High (30% best for print)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="includeMargin"
                  checked={includeMargin}
                  onChange={(e) => setIncludeMargin(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="includeMargin" className="text-xs text-slate-700 font-medium">
                  Include quiet zone border margin
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive QR Preview & Download (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Real-time Preview
            </span>

            {/* QR Render Target Container */}
            <div
              ref={canvasRef}
              className="p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center transition-all max-w-full"
              style={{ backgroundColor: bgColor }}
            >
              <QRCodeCanvas
                value={payload}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level={errorLevel}
                includeMargin={includeMargin}
              />
              {/* Hidden SVG element for vector downloads */}
              <div className="hidden">
                <QRCodeSVG
                  value={payload}
                  size={size * 2}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level={errorLevel}
                  includeMargin={includeMargin}
                />
              </div>
            </div>

            {/* Payload preview chip */}
            <div className="w-full mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-left">
              <span className="text-xs text-slate-500 truncate mr-2 font-mono">
                {payload}
              </span>
              <button
                type="button"
                onClick={handleCopyPayload}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium shrink-0 flex items-center gap-1 min-h-[36px] px-2"
                aria-label="Copy QR code payload"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Export Buttons */}
            <div className="w-full grid grid-cols-2 gap-3 mt-5">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="w-full py-3 px-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSvg}
                className="w-full py-3 px-3 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Vector SVG</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>High-resolution 300+ DPI suitable for print</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
