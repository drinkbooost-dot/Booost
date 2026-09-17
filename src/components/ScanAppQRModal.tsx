import React, { useState } from 'react';
import { QrCode, X, Copy, Check, ExternalLink, Download, Sparkles, Smartphone } from 'lucide-react';

interface ScanAppQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScanAppQRModal: React.FC<ScanAppQRModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Derive the current window URL or production domain
  const currentUrl = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://ais-pre-do3y5en5txdl22ecs2xw65-154144249563.asia-southeast1.run.app';

  // High precision QR API endpoint that encodes the live app URL
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=ffffff&color=0b3e28&margin=1&format=svg`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#051811] border-2 border-emerald-600 rounded-3xl max-w-md w-full p-6 sm:p-7 text-white shadow-2xl relative overflow-hidden">
        {/* Glow background accents */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#84cc16]/20 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 rounded-full hover:bg-emerald-900/50 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center relative z-10 mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0e4a30] to-[#84cc16] text-[#051811] shadow-lg mb-2.5">
            <QrCode className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-black text-white font-['Outfit'] tracking-tight">
            Scan to Open Booost App
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
            Point your phone camera at this QR code to launch the official Booost app instantly.
          </p>
        </div>

        {/* High-Contrast Scannable QR Code Card */}
        <div className="bg-white p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center relative z-10 mx-auto max-w-[280px]">
          <div className="relative">
            <img
              src={qrApiUrl}
              alt="Scan QR code to open Booost App"
              className="w-56 h-56 rounded-lg object-contain"
              referrerPolicy="no-referrer"
            />
            {/* Center Logo Stamp inside QR */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-11 h-11 rounded-xl bg-[#0b3e28] border-2 border-[#84cc16] flex items-center justify-center shadow-lg">
                <span className="text-base">🥤</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
            <span>Works on Android & iPhone Camera</span>
          </div>
        </div>

        {/* Action Link Row */}
        <div className="mt-5 space-y-3 relative z-10">
          <div className="flex items-center gap-2 bg-[#0a281c] p-2.5 rounded-xl border border-emerald-900/80 text-xs">
            <div className="truncate flex-1 font-mono text-stone-300 select-all">
              {currentUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#84cc16] hover:bg-[#9ee61a] text-[#051811] font-black text-xs transition shrink-0 cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-300 px-1">
            <span className="flex items-center gap-1 text-[#84cc16] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Kiosk & Customer Ready
            </span>
            <span>SM City Dasmariñas • SM City Trece</span>
          </div>
        </div>
      </div>
    </div>
  );
};
