import React, { useState } from 'react';
import { 
  QrCode, 
  X, 
  Check, 
  Copy, 
  Gift, 
  Sparkles, 
  PlusCircle, 
  ExternalLink, 
  CheckCircle2, 
  Smartphone,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CustomerProfile, LoyaltyStamp } from '../types';
import { playStampSound, playRewardFanfare } from '../utils/audio';

interface QuickPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerProfile;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerProfile>>;
  selectedBranch: string;
  onViewFullCard: () => void;
  onAddStampHistory?: (stamp: LoyaltyStamp) => void;
}

export const QuickPassModal: React.FC<QuickPassModalProps> = ({
  isOpen,
  onClose,
  customer,
  setCustomer,
  selectedBranch,
  onViewFullCard,
  onAddStampHistory,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [walletSaved, setWalletSaved] = useState(false);
  const [activeView, setActiveView] = useState<'scan' | 'stamps'>('scan');
  const [showVoucherAlert, setShowVoucherAlert] = useState(false);

  if (!isOpen) return null;

  const stampsNeeded = 10;
  const currentStamps = customer.stampsCount;
  const stampsLeft = Math.max(0, stampsNeeded - currentStamps);

  const handleCopyId = () => {
    navigator.clipboard.writeText(customer.memberId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleQuickAddStamp = () => {
    playStampSound();
    const nextCount = currentStamps + 1;
    const isNowFree = nextCount >= stampsNeeded;

    const newStamp: LoyaltyStamp = {
      id: Date.now(),
      stampedAt: 'Just Now',
      drinkName: 'Iron Man Supreme (Quick Scan)',
      branchName: selectedBranch,
      earnedFree: isNowFree,
    };

    if (onAddStampHistory) {
      onAddStampHistory(newStamp);
    }

    if (isNowFree) {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#84cc16', '#10b981', '#ffffff', '#fbbf24']
      });
      playRewardFanfare();

      setCustomer((prev) => {
        const nextTotal = prev.totalStampsCollected + 1;
        let nextTier = prev.tier;
        if (nextTotal >= 30) nextTier = 'Champion Booster';
        else if (nextTotal >= 10) nextTier = 'Gold Booster';

        return {
          ...prev,
          stampsCount: 0,
          totalStampsCollected: nextTotal,
          freeDrinksAvailable: prev.freeDrinksAvailable + 1,
          tier: nextTier,
        };
      });
      setShowVoucherAlert(true);
    } else {
      setCustomer((prev) => {
        const nextTotal = prev.totalStampsCollected + 1;
        let nextTier = prev.tier;
        if (nextTotal >= 30) nextTier = 'Champion Booster';
        else if (nextTotal >= 10) nextTier = 'Gold Booster';

        return {
          ...prev,
          stampsCount: nextCount,
          totalStampsCollected: nextTotal,
          tier: nextTier,
        };
      });
    }
  };

  const handleSaveToWallet = () => {
    setWalletSaved(true);
    setTimeout(() => setWalletSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b3e28] text-white border border-emerald-600/70 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        {/* Top Bar with Dismiss and Branch */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-emerald-800/80 bg-[#072d1d]">
          <div className="flex items-center gap-2">
            <span className="font-['Outfit'] font-black text-xl tracking-tight text-white">BOOOST</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#84cc16]" />
            <span className="text-[11px] font-bold text-[#84cc16] uppercase tracking-wider bg-[#84cc16]/10 px-2 py-0.5 rounded-full border border-[#84cc16]/30">
              Quick Pass
            </span>
          </div>
          <button
            id="close-quick-pass-btn"
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded-xl transition"
            aria-label="Close pass"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branch Notice */}
        <div className="px-5 py-2 bg-emerald-950/60 border-b border-emerald-800/40 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#84cc16] shrink-0" />
            <span className="truncate">{selectedBranch}</span>
          </div>
          <span className="text-[11px] text-stone-300 shrink-0 font-medium">Valid all branches</span>
        </div>

        {/* Pass Card Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Member Banner & Quick Segmented Control */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-black text-white">{customer.name}</h4>
              <div className="text-xs text-emerald-300 flex items-center gap-1 font-semibold">
                <span>{customer.tier}</span>
                <span>•</span>
                <span className="text-[#84cc16] font-bold">{currentStamps}/10 Stamps</span>
              </div>
            </div>

            {/* Quick View Switcher */}
            <div className="flex p-1 bg-[#051c13] rounded-xl border border-emerald-800/80">
              <button
                onClick={() => setActiveView('scan')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeView === 'scan'
                    ? 'bg-[#84cc16] text-[#051811] shadow-xs'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Barcode</span>
              </button>
              <button
                onClick={() => setActiveView('stamps')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeView === 'stamps'
                    ? 'bg-[#84cc16] text-[#051811] shadow-xs'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <span>Stamps</span>
              </button>
            </div>
          </div>

          {/* View 1: Instant Cashier Barcode & QR code */}
          {activeView === 'scan' ? (
            <div className="bg-white text-stone-900 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 text-center">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Present to Cashier to Scan
              </div>

              {/* Scannable SVG QR Code */}
              <div className="bg-stone-50 p-3 rounded-xl inline-block mx-auto border border-stone-200">
                <svg className="w-44 h-44 sm:w-48 sm:h-48" viewBox="0 0 100 100" fill="currentColor">
                  {/* Top-left corner finder */}
                  <rect x="5" y="5" width="25" height="25" fill="#0e4a30" />
                  <rect x="9" y="9" width="17" height="17" fill="#fff" />
                  <rect x="12" y="12" width="11" height="11" fill="#0e4a30" />

                  {/* Top-right corner finder */}
                  <rect x="70" y="5" width="25" height="25" fill="#0e4a30" />
                  <rect x="74" y="9" width="17" height="17" fill="#fff" />
                  <rect x="77" y="12" width="11" height="11" fill="#0e4a30" />

                  {/* Bottom-left corner finder */}
                  <rect x="5" y="70" width="25" height="25" fill="#0e4a30" />
                  <rect x="9" y="74" width="17" height="17" fill="#fff" />
                  <rect x="12" y="77" width="11" height="11" fill="#0e4a30" />

                  {/* High contrast data pattern */}
                  <rect x="35" y="10" width="8" height="8" fill="#0e4a30" />
                  <rect x="48" y="14" width="14" height="6" fill="#0e4a30" />
                  <rect x="35" y="28" width="28" height="8" fill="#0e4a30" />
                  <rect x="42" y="42" width="18" height="18" fill="#0e4a30" />
                  <rect x="66" y="45" width="12" height="12" fill="#0e4a30" />
                  <rect x="15" y="40" width="12" height="14" fill="#0e4a30" />
                  <rect x="35" y="72" width="15" height="15" fill="#0e4a30" />
                  <rect x="58" y="75" width="25" height="10" fill="#0e4a30" />
                  <rect x="75" y="60" width="15" height="8" fill="#0e4a30" />
                </svg>
              </div>

              {/* High-Contrast Linear Barcode */}
              <div className="bg-stone-100 rounded-xl p-2.5 border border-stone-200">
                <div className="font-mono text-base sm:text-lg tracking-[0.25em] font-black text-stone-900 select-none">
                  ||||| || |||| ||| |||| || |||||
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="font-mono font-bold text-xs text-emerald-900 tracking-wider">
                    {customer.memberId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 hover:bg-stone-200 text-stone-600 rounded transition"
                    title="Copy Member ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-stone-600">
                Screen brightness automatically boosted for scanner optics
              </div>
            </div>
          ) : (
            /* View 2: Compact 10-Stamp Grid */
            <div className="bg-[#07281a] border border-emerald-700/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Current Card:</span>
                <span className="text-[#84cc16] font-black">{currentStamps} of 10 Collected</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#03130d] h-3 rounded-full overflow-hidden border border-emerald-800">
                <div 
                  className="bg-gradient-to-r from-emerald-500 via-[#84cc16] to-[#cbf738] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(currentStamps / stampsNeeded) * 100}%` }}
                />
              </div>

              {/* 10 stamp icons */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const num = idx + 1;
                  const isStamped = num <= currentStamps;
                  const isLast = num === 10;

                  return (
                    <div
                      key={idx}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1.5 text-center transition ${
                        isStamped
                          ? 'bg-[#114d33] border-2 border-[#84cc16] text-white shadow-xs'
                          : isLast
                          ? 'bg-amber-950/60 border-2 border-dashed border-amber-400 text-amber-300'
                          : 'bg-[#041910] border border-dashed border-emerald-800/70 text-emerald-600'
                      }`}
                    >
                      {isStamped ? (
                        <>
                          <span className="text-base leading-none">🥤</span>
                          <span className="text-[9px] font-bold text-[#84cc16] mt-0.5">#{num}</span>
                        </>
                      ) : isLast ? (
                        <>
                          <Gift className="w-4 h-4 text-amber-400" />
                          <span className="text-[8px] font-black text-amber-300 leading-tight">FREE!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-emerald-600">#{num}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-xs text-emerald-200/90 pt-1">
                {stampsLeft > 0 ? (
                  <span>Only <strong className="text-[#84cc16]">{stampsLeft} more drinks</strong> to your FREE 16oz shake!</span>
                ) : (
                  <span className="text-[#84cc16] font-black">🎉 Free Shake Ready to Claim!</span>
                )}
              </div>
            </div>
          )}

          {/* In-Store Quick Actions */}
          <div className="space-y-2 pt-1">
            {/* Quick Test / Add Stamp */}
            <div className="flex gap-2">
              <button
                id="quick-pass-add-stamp-btn"
                onClick={handleQuickAddStamp}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#84cc16]" />
                <span>Simulate In-Store Stamp (+1)</span>
              </button>

              <button
                id="quick-pass-wallet-btn"
                onClick={handleSaveToWallet}
                className="px-3 py-2.5 bg-stone-900/80 hover:bg-stone-900 border border-emerald-700/60 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shrink-0"
                title="Save to Phone Wallet"
              >
                <Smartphone className="w-4 h-4 text-[#84cc16]" />
                <span className="hidden sm:inline">Wallet</span>
              </button>
            </div>

            {walletSaved && (
              <div className="p-2 bg-emerald-950 border border-[#84cc16]/50 rounded-xl text-xs text-[#84cc16] flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pass shortcut saved to device!</span>
              </div>
            )}

            {/* Voucher notification alert */}
            {showVoucherAlert && (
              <div className="p-3 bg-amber-950/90 border border-amber-400 rounded-xl text-xs text-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Free 16oz drink voucher added!</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onViewFullCard();
                  }}
                  className="text-amber-300 font-bold underline"
                >
                  View
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Jump to Full Dashboard */}
        <div className="p-3 bg-[#072d1d] border-t border-emerald-800/80 flex items-center justify-between text-xs">
          <div className="text-emerald-300 text-[11px]">
            {customer.freeDrinksAvailable > 0 ? (
              <span className="text-amber-300 font-bold">★ {customer.freeDrinksAvailable} Free Drink Available</span>
            ) : (
              <span>SM Dasmariñas & SM Trece Kiosks</span>
            )}
          </div>
          <button
            onClick={() => {
              onClose();
              onViewFullCard();
            }}
            className="flex items-center gap-1 text-[#84cc16] hover:underline font-bold text-xs"
          >
            <span>Full Loyalty Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
