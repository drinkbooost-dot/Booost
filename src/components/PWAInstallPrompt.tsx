import React, { useState } from 'react';
import { Download, Share2, PlusSquare, CheckCircle, Smartphone, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallPromptProps {
  className?: string;
  compact?: boolean;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '', compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already installed or dismissed, do not render
  if (isInstalled || isDismissed) {
    return null;
  }

  // If compact header / pill button is requested
  if (compact) {
    if (isInstallable) {
      return (
        <button
          id="header-install-app-btn"
          onClick={install}
          className={`flex items-center gap-1.5 bg-[#84cc16] hover:bg-[#9ee61a] text-[#051811] px-2.5 py-1.5 rounded-xl text-xs font-black transition shadow-xs cursor-pointer ${className}`}
          title="Install Booost App on your device"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      );
    }

    if (isIOS) {
      return (
        <>
          <button
            id="header-install-ios-btn"
            onClick={() => setShowIOSModal(true)}
            className={`flex items-center gap-1.5 bg-[#84cc16] hover:bg-[#9ee61a] text-[#051811] px-2.5 py-1.5 rounded-xl text-xs font-black transition shadow-xs cursor-pointer ${className}`}
            title="Add Booost App to iPhone Home Screen"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get App</span>
          </button>

          {showIOSModal && (
            <IOSInstallModal onClose={() => setShowIOSModal(false)} />
          )}
        </>
      );
    }

    return null;
  }

  // Full banner / floating card prompt
  return (
    <>
      <div
        id="pwa-install-banner"
        className={`bg-gradient-to-r from-[#0b3e28] to-[#12593a] border border-emerald-600/60 text-white rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#84cc16] to-[#cbf738] p-0.5 shadow-md shrink-0 flex items-center justify-center text-[#051811]">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white">Download Booost Native App</span>
              <span className="text-[10px] bg-[#84cc16] text-[#051811] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Instant
              </span>
            </div>
            <p className="text-xs text-stone-200 mt-0.5">
              Add to your phone's home screen for 1-tap loyalty check-in, offline menu access & instant kiosk QR scan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          {isInstallable ? (
            <button
              id="banner-install-confirm-btn"
              onClick={install}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#84cc16] hover:bg-[#9ee61a] text-[#051811] px-4 py-2 rounded-xl text-xs font-black transition shadow-md cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen</span>
            </button>
          ) : isIOS ? (
            <button
              id="banner-install-ios-btn"
              onClick={() => setShowIOSModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#84cc16] hover:bg-[#9ee61a] text-[#051811] px-4 py-2 rounded-xl text-xs font-black transition shadow-md cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>How to Install on iPhone</span>
            </button>
          ) : (
            <button
              id="banner-install-guide-btn"
              onClick={() => setShowIOSModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#84cc16] hover:bg-[#9ee61a] text-[#051811] px-4 py-2 rounded-xl text-xs font-black transition shadow-md cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Install Guide</span>
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="text-stone-400 hover:text-white p-2 rounded-lg transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSModal && (
        <IOSInstallModal onClose={() => setShowIOSModal(false)} />
      )}
    </>
  );
};

// Modal specifically guiding iOS Safari / Android users on Add to Home Screen
const IOSInstallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#051811] border border-emerald-700/80 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-emerald-900/50 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0e4a30] to-[#84cc16] flex items-center justify-center text-[#051811] font-black shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Install Booost on Mobile</h3>
            <p className="text-xs text-stone-300">Run as a standalone full-screen native app</p>
          </div>
        </div>

        <div className="space-y-3.5 my-5 text-xs text-stone-200">
          <div className="flex items-start gap-3 bg-[#0a281c] p-3.5 rounded-2xl border border-emerald-900/60">
            <div className="w-7 h-7 rounded-xl bg-emerald-800 flex items-center justify-center font-bold text-white shrink-0">
              1
            </div>
            <div>
              <div className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                <span>Tap the Share Button</span>
                <Share2 className="w-3.5 h-3.5 text-[#84cc16]" />
              </div>
              <p className="text-stone-300">
                In Safari at the bottom of your screen (or Chrome menu on top right), tap the Share icon.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#0a281c] p-3.5 rounded-2xl border border-emerald-900/60">
            <div className="w-7 h-7 rounded-xl bg-emerald-800 flex items-center justify-center font-bold text-white shrink-0">
              2
            </div>
            <div>
              <div className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                <span>Select "Add to Home Screen"</span>
                <PlusSquare className="w-3.5 h-3.5 text-[#84cc16]" />
              </div>
              <p className="text-stone-300">
                Scroll down the options list and tap <strong>Add to Home Screen</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#0a281c] p-3.5 rounded-2xl border border-emerald-900/60">
            <div className="w-7 h-7 rounded-xl bg-emerald-800 flex items-center justify-center font-bold text-white shrink-0">
              3
            </div>
            <div>
              <div className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                <span>Tap "Add"</span>
                <CheckCircle className="w-3.5 h-3.5 text-[#84cc16]" />
              </div>
              <p className="text-stone-300">
                Confirm by tapping <strong>Add</strong> in the top-right corner. The Booost icon will now appear on your phone's home screen!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#84cc16] hover:bg-[#9ee61a] text-[#051811] font-black py-3 rounded-xl text-sm transition shadow-lg cursor-pointer"
        >
          Got It, Ready to Install
        </button>
      </div>
    </div>
  );
};
