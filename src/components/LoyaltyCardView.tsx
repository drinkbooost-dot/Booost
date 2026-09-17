import React, { useState } from 'react';
import { 
  Sparkles, 
  QrCode, 
  Award, 
  Gift, 
  PlusCircle, 
  RotateCcw, 
  CheckCircle2, 
  Copy, 
  Check, 
  Zap, 
  Coffee, 
  Info, 
  Flame,
  Smartphone,
  CreditCard,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CustomerProfile, LoyaltyStamp } from '../types';
import { playStampSound, playRewardFanfare } from '../utils/audio';
import { ScanAppQRModal } from './ScanAppQRModal';

interface LoyaltyCardViewProps {
  customer: CustomerProfile;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerProfile>>;
  stampsHistory: LoyaltyStamp[];
  setStampsHistory: React.Dispatch<React.SetStateAction<LoyaltyStamp[]>>;
  selectedBranch: string;
}

export const LoyaltyCardView: React.FC<LoyaltyCardViewProps> = ({
  customer,
  setCustomer,
  stampsHistory,
  setStampsHistory,
  selectedBranch,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showQRZoom, setShowQRZoom] = useState(false);
  const [showScanAppQR, setShowScanAppQR] = useState(false);
  const [cardDisplayMode, setCardDisplayMode] = useState<'stamps' | 'barcode'>('stamps');
  const [selectedShakeForStamp, setSelectedShakeForStamp] = useState('Iron Man Supreme');
  const [walletSavedNotice, setWalletSavedNotice] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'perks' | 'history' | 'referral'>('perks');

  const stampsNeeded = 10;
  const currentStamps = customer.stampsCount;
  const stampsLeft = Math.max(0, stampsNeeded - currentStamps);

  // Trigger stamp addition
  const handleAddStamp = () => {
    playStampSound();

    const nextCount = currentStamps + 1;
    const isNowFree = nextCount >= stampsNeeded;

    const newStamp: LoyaltyStamp = {
      id: Date.now(),
      stampedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      drinkName: selectedShakeForStamp,
      branchName: selectedBranch,
      earnedFree: isNowFree,
    };

    setStampsHistory((prev) => [newStamp, ...prev]);

    if (isNowFree) {
      confetti({
        particleCount: 120,
        spread: 70,
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
      setShowVoucherModal(true);
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

  const handleResetCard = () => {
    if (confirm('Reset current stamp card progress to 0 for testing?')) {
      setCustomer((prev) => ({ ...prev, stampsCount: 0 }));
    }
  };

  const handleUseFreeDrink = () => {
    if (customer.freeDrinksAvailable > 0) {
      setCustomer((prev) => ({
        ...prev,
        freeDrinksAvailable: prev.freeDrinksAvailable - 1,
      }));
      setShowVoucherModal(false);
      alert('Voucher redeemed! Present code #BOOOST-CLAIMED to cashier.');
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://booostshakes.com/join?ref=${customer.memberId}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyMemberId = () => {
    navigator.clipboard.writeText(customer.memberId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveToWallet = () => {
    setWalletSavedNotice(true);
    setTimeout(() => setWalletSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 sm:py-7 space-y-6">
      {/* Top Welcome & Quick Branch Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit'] flex items-center gap-2">
            <span>Customer Loyalty Pass</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              {customer.tier}
            </span>
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Collect 10 stamps at <span className="font-semibold text-emerald-800">{selectedBranch}</span> & get 1 FREE 16oz shake!
          </p>
        </div>

        {/* Free Drink Available Notification Banner */}
        {customer.freeDrinksAvailable > 0 && (
          <button
            id="claim-free-drink-top-btn"
            onClick={() => setShowVoucherModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs px-4 py-2 rounded-xl shadow-sm transition transform active:scale-95 shrink-0 animate-pulse"
          >
            <Gift className="w-4 h-4 text-stone-950" />
            <span>Claim Free Drink Voucher ({customer.freeDrinksAvailable})</span>
          </button>
        )}
      </div>

      {/* Main Digital Loyalty Card with 1-Tap Toggle */}
      <div className="bg-gradient-to-br from-[#082f1e] via-[#0e4a30] to-[#062618] border-2 border-emerald-600/70 p-5 sm:p-7 rounded-3xl shadow-xl text-white relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#84cc16]/10 blur-3xl pointer-events-none" />

        {/* Card Header & 1-Tap Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-emerald-500/40 flex items-center justify-center font-black text-xl text-[#84cc16]">
              🥤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Outfit'] font-black text-2xl tracking-tight text-white">
                  BOOOST
                </span>
                <span className="h-2 w-2 rounded-full bg-[#84cc16]" />
                <span className="text-[11px] uppercase font-bold text-emerald-300">
                  VIP Club
                </span>
              </div>
              <div className="text-xs text-emerald-200/90 font-medium">
                Member: <strong className="text-white">{customer.name}</strong> • ID: <span className="font-mono text-[#84cc16]">{customer.memberId}</span>
              </div>
            </div>
          </div>

          {/* Quick 1-Tap Mode Switcher */}
          <div className="flex items-center gap-2 bg-[#041910] p-1 rounded-2xl border border-emerald-700/60 self-start sm:self-auto shrink-0 flex-wrap">
            <button
              id="toggle-stamps-mode-btn"
              onClick={() => setCardDisplayMode('stamps')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                cardDisplayMode === 'stamps'
                  ? 'bg-[#84cc16] text-[#051811] shadow-xs'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>10 Stamps ({currentStamps}/10)</span>
            </button>

            <button
              id="toggle-barcode-mode-btn"
              onClick={() => setCardDisplayMode('barcode')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                cardDisplayMode === 'barcode'
                  ? 'bg-[#84cc16] text-[#051811] shadow-xs'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Show Cashier QR</span>
            </button>

            <button
              id="loyalty-card-scan-app-btn"
              onClick={() => setShowScanAppQR(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition bg-emerald-950/80 hover:bg-emerald-900 text-stone-200 hover:text-white border border-emerald-700/60 cursor-pointer"
              title="Generate QR code for customer to scan and open Booost App"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#84cc16]" />
              <span>Scan App QR</span>
            </button>
          </div>
        </div>

        {/* Display Mode 1: 10-Stamp Card Grid */}
        {cardDisplayMode === 'stamps' ? (
          <div className="py-5 space-y-4 relative z-10 animate-in fade-in duration-200">
            {/* Progress Headline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Card Progress:</span>
                <span className="text-[#84cc16] text-base font-black">{currentStamps} of 10 Stamps</span>
              </div>
              <div className="text-xs text-stone-300">
                {stampsLeft > 0 ? (
                  <span>Only <strong className="text-[#84cc16]">{stampsLeft} more drinks</strong> to 1 FREE 16oz shake!</span>
                ) : (
                  <span className="text-[#84cc16] font-bold">🎉 Congratulations! Reward ready!</span>
                )}
              </div>
            </div>

            {/* Continuous Progress Bar */}
            <div className="w-full bg-[#041910] h-3.5 rounded-full overflow-hidden border border-emerald-700/60 p-0.5">
              <div 
                className="bg-gradient-to-r from-emerald-500 via-[#84cc16] to-[#cbf738] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(currentStamps / stampsNeeded) * 100}%` }}
              />
            </div>

            {/* 10-Stamp Visual Grid (Clean 5x2 or 10x1) */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5 pt-1">
              {Array.from({ length: 10 }).map((_, index) => {
                const stampNumber = index + 1;
                const isStamped = stampNumber <= currentStamps;
                const isRewardSlot = stampNumber === 10;

                return (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all ${
                      isStamped
                        ? 'bg-gradient-to-b from-[#114d33] to-[#093220] border-2 border-[#84cc16] shadow-md text-white scale-[1.02]'
                        : isRewardSlot
                        ? 'bg-gradient-to-b from-amber-950/70 to-yellow-950/50 border-2 border-dashed border-amber-400 text-amber-200'
                        : 'bg-[#051c13]/90 border-2 border-dashed border-emerald-800/60 text-stone-400'
                    }`}
                  >
                    {isStamped ? (
                      <>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#84cc16] text-[#051811] flex items-center justify-center font-black shadow-inner">
                          <span className="text-sm">🥤</span>
                        </div>
                        <span className="text-[9px] font-bold text-[#84cc16] mt-1 uppercase">
                          #{stampNumber}
                        </span>
                        <div className="absolute top-1 right-1">
                          <Check className="w-3 h-3 text-[#84cc16] stroke-[3]" />
                        </div>
                      </>
                    ) : isRewardSlot ? (
                      <>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center font-black border border-amber-400/60 animate-pulse">
                          <Gift className="w-4 h-4" />
                        </div>
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-300 mt-1 uppercase leading-tight">
                          FREE 16oz!
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#03130d] flex items-center justify-center text-xs font-bold text-emerald-600">
                          {stampNumber}
                        </div>
                        <span className="text-[8px] font-medium text-emerald-500 mt-1">
                          Booost
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Display Mode 2: Large High-Contrast Cashier Scanner View */
          <div className="py-5 space-y-4 relative z-10 animate-in fade-in duration-200">
            <div className="bg-white text-stone-900 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
              {/* High Contrast QR Code */}
              <div className="bg-stone-50 p-3 rounded-2xl border-2 border-stone-200 shrink-0">
                <svg className="w-40 h-40 sm:w-44 sm:h-44" viewBox="0 0 100 100" fill="currentColor">
                  {/* Corner targets */}
                  <rect x="5" y="5" width="25" height="25" fill="#0e4a30" />
                  <rect x="9" y="9" width="17" height="17" fill="#fff" />
                  <rect x="12" y="12" width="11" height="11" fill="#0e4a30" />

                  <rect x="70" y="5" width="25" height="25" fill="#0e4a30" />
                  <rect x="74" y="9" width="17" height="17" fill="#fff" />
                  <rect x="77" y="12" width="11" height="11" fill="#0e4a30" />

                  <rect x="5" y="70" width="25" height="25" fill="#0e4a30" />
                  <rect x="9" y="74" width="17" height="17" fill="#fff" />
                  <rect x="12" y="77" width="11" height="11" fill="#0e4a30" />

                  {/* Scannable modules */}
                  <rect x="35" y="10" width="8" height="8" fill="#0e4a30" />
                  <rect x="48" y="15" width="12" height="6" fill="#0e4a30" />
                  <rect x="35" y="30" width="30" height="8" fill="#0e4a30" />
                  <rect x="40" y="45" width="20" height="20" fill="#0e4a30" />
                  <rect x="65" y="45" width="12" height="12" fill="#0e4a30" />
                  <rect x="15" y="40" width="12" height="15" fill="#0e4a30" />
                  <rect x="35" y="72" width="15" height="15" fill="#0e4a30" />
                  <rect x="58" y="75" width="25" height="10" fill="#0e4a30" />
                  <rect x="75" y="60" width="15" height="8" fill="#0e4a30" />
                </svg>
              </div>

              {/* Barcode & ID Info */}
              <div className="space-y-3 flex-1 max-w-sm">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-stone-500">
                    Present to Cashier
                  </div>
                  <h3 className="text-xl font-black text-stone-900 font-['Outfit']">
                    {customer.name}
                  </h3>
                  <div className="text-xs text-emerald-800 font-semibold">
                    Tier: {customer.tier} • {currentStamps}/10 Stamps
                  </div>
                </div>

                {/* Optical Barcode */}
                <div className="bg-stone-100 p-3 rounded-xl border border-stone-200">
                  <div className="font-mono text-base tracking-[0.25em] font-black text-stone-900 select-none text-center">
                    |||| || ||| |||| | ||||| ||| |||
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="font-mono font-bold text-xs text-emerald-900">
                      {customer.memberId}
                    </span>
                    <button
                      onClick={handleCopyMemberId}
                      className="p-1 hover:bg-stone-200 rounded text-stone-600 transition"
                      title="Copy Member ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQRZoom(true)}
                    className="flex-1 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen QR</span>
                  </button>
                  <button
                    onClick={handleSaveToWallet}
                    className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card Footer Info & Fast Actions */}
        <div className="pt-4 border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/90 gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#84cc16] shrink-0" />
            <span>Valid at SM City Dasmariñas & SM City Trece kiosks.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="card-add-to-wallet-btn"
              onClick={handleSaveToWallet}
              className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-stone-200 hover:text-white px-3 py-1 rounded-xl text-[11px] font-semibold transition border border-emerald-700/50"
            >
              <Smartphone className="w-3 h-3 text-[#84cc16]" />
              <span>+ Add to Wallet</span>
            </button>
            <div className="font-semibold text-white text-[11px]">
              Lifetime Shakes: <span className="text-[#84cc16] font-bold">{customer.totalStampsCollected}</span>
            </div>
          </div>
        </div>
      </div>

      {walletSavedNotice && (
        <div className="p-3 bg-emerald-950/90 border border-[#84cc16]/50 rounded-2xl text-xs text-[#84cc16] flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Loyalty Pass shortcut saved to your phone wallet! Ready for cashier optical scanning.</span>
        </div>
      )}

      {/* Simplified In-Store Purchase Simulator (Compact Bar) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900">In-Store Stamp Simulator</div>
            <div className="text-[11px] text-stone-500">Test adding stamps as if purchasing at {selectedBranch}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            id="simulate-stamp-drink-select"
            value={selectedShakeForStamp}
            onChange={(e) => setSelectedShakeForStamp(e.target.value)}
            aria-label="Select drink for stamp"
            className="bg-stone-50 border border-stone-300 text-stone-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 flex-1 sm:flex-none font-medium"
          >
            <option value="Iron Man Supreme">Iron Man Supreme (Best Seller)</option>
            <option value="Chocoloco">Chocoloco (Protein Deluxe)</option>
            <option value="Profee Supreme">Profee Supreme (Coffee Boost)</option>
            <option value="Biscoff Protein Deluxe">Biscoff Protein Deluxe</option>
            <option value="Lean Green Machine">Lean Green Machine</option>
            <option value="Classic Chocolate">Classic Chocolate (Kid Friendly)</option>
          </select>

          <button
            id="simulate-add-stamp-btn"
            onClick={handleAddStamp}
            className="flex items-center gap-1.5 bg-[#0e4a30] hover:bg-[#12593a] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#84cc16]" />
            <span>+1 Stamp</span>
          </button>

          <button
            id="simulate-reset-stamp-btn"
            onClick={handleResetCard}
            title="Reset Stamp Count to 0"
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 rounded-xl border border-stone-300 transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Organized Secondary Tabs: Perks, History, Referral */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200">
          <button
            onClick={() => setActiveSubTab('perks')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'perks'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>Membership Perks</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
            <span>Stamp History ({stampsHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('referral')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'referral'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-emerald-700" />
            <span>Invite Friend (+1 Stamp)</span>
          </button>
        </div>

        {/* Tab 1: Perks & Tiers */}
        {activeSubTab === 'perks' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 animate-in fade-in duration-150">
            {/* Silver */}
            <div className={`p-4 rounded-2xl border transition-all ${
              customer.tier === 'Silver Booster' 
                ? 'bg-emerald-50/70 border-2 border-emerald-600 shadow-xs' 
                : 'bg-white border-stone-200'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Entry Tier</span>
                <Award className="w-4 h-4 text-stone-400" />
              </div>
              <h3 className="text-sm font-black text-stone-900 font-['Outfit']">Silver Booster</h3>
              <div className="text-xs text-emerald-800 font-semibold mt-0.5">1 - 9 Lifetime Drinks</div>
              <ul className="text-xs text-stone-600 space-y-1.5 mt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Digital 10-stamp card access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>1 Free 16oz shake every 10 drinks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Order-ahead queue jump</span>
                </li>
              </ul>
            </div>

            {/* Gold */}
            <div className={`p-4 rounded-2xl border transition-all ${
              customer.tier === 'Gold Booster' 
                ? 'bg-amber-50/70 border-2 border-amber-500 shadow-xs' 
                : 'bg-white border-stone-200'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Popular Tier</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-sm font-black text-stone-900 font-['Outfit']">Gold Booster</h3>
              <div className="text-xs text-amber-800 font-semibold mt-0.5">10 - 29 Lifetime Drinks</div>
              <ul className="text-xs text-stone-600 space-y-1.5 mt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>All Silver tier perks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Free extra protein scoop Fridays</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Secret menu seasonal previews</span>
                </li>
              </ul>
            </div>

            {/* Champion */}
            <div className={`p-4 rounded-2xl border transition-all ${
              customer.tier === 'Champion Booster' 
                ? 'bg-emerald-50/70 border-2 border-emerald-600 shadow-xs' 
                : 'bg-white border-stone-200'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">VIP Master</span>
                <Sparkles className="w-4 h-4 text-emerald-700" />
              </div>
              <h3 className="text-sm font-black text-stone-900 font-['Outfit']">Champion Booster</h3>
              <div className="text-xs text-emerald-800 font-semibold mt-0.5">30+ Lifetime Drinks</div>
              <ul className="text-xs text-stone-600 space-y-1.5 mt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>All Gold tier perks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Free Birthday 22oz shake</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Free size upgrade (16oz to 22oz) anytime</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Stamp History */}
        {activeSubTab === 'history' && (
          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Purchase & Stamp Log</h3>
              <span className="text-[11px] text-stone-500 font-medium">
                {stampsHistory.length} total logged
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {stampsHistory.length === 0 ? (
                <div className="text-xs text-stone-500 py-6 text-center">
                  No purchases logged yet. Tap "+1 Stamp" above to log your first shake!
                </div>
              ) : (
                stampsHistory.map((stamp) => (
                  <div
                    key={stamp.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🥤</span>
                      <div>
                        <div className="font-bold text-stone-900">{stamp.drinkName || 'Booost Shake'}</div>
                        <div className="text-[11px] text-stone-500">{stamp.branchName} • {stamp.stampedAt}</div>
                      </div>
                    </div>
                    {stamp.earnedFree && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                        EARNED FREE!
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Invite Gym Buddy */}
        {activeSubTab === 'referral' && (
          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Coffee className="w-4 h-4 text-emerald-700" />
              <h3>Give 1 Stamp, Get 1 Stamp</h3>
            </div>
            <p className="text-stone-600 text-xs leading-relaxed">
              Invite a gym buddy or colleague to Booost. When they claim their first shake at SM Dasmariñas or SM Trece, you BOTH automatically get +1 Stamp on your loyalty pass!
            </p>

            <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 p-2 rounded-xl">
              <div className="px-3 text-xs font-mono text-stone-800 select-all truncate flex-1 font-semibold">
                https://booostshakes.com/join?ref={customer.memberId}
              </div>
              <button
                id="copy-referral-code-btn"
                onClick={handleCopyReferral}
                className="bg-[#0e4a30] hover:bg-[#12593a] text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shrink-0"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-[#84cc16]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen QR Code Modal */}
      {showQRZoom && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-300 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <div className="space-y-1">
              <h4 className="text-xl font-black text-stone-900 font-['Outfit']">Cashier Scan Pass</h4>
              <p className="text-xs text-stone-600">
                SM Dasmariñas & SM Trece Kiosks
              </p>
            </div>

            {/* High Contrast Scaled QR */}
            <div className="bg-stone-50 p-4 rounded-2xl inline-block mx-auto border border-stone-200">
              <svg className="w-48 h-48" viewBox="0 0 100 100" fill="currentColor">
                <rect x="5" y="5" width="25" height="25" fill="#0e4a30" />
                <rect x="9" y="9" width="17" height="17" fill="#fff" />
                <rect x="12" y="12" width="11" height="11" fill="#0e4a30" />

                <rect x="70" y="5" width="25" height="25" fill="#0e4a30" />
                <rect x="74" y="9" width="17" height="17" fill="#fff" />
                <rect x="77" y="12" width="11" height="11" fill="#0e4a30" />

                <rect x="5" y="70" width="25" height="25" fill="#0e4a30" />
                <rect x="9" y="74" width="17" height="17" fill="#fff" />
                <rect x="12" y="77" width="11" height="11" fill="#0e4a30" />

                <rect x="35" y="10" width="8" height="8" fill="#0e4a30" />
                <rect x="48" y="15" width="12" height="6" fill="#0e4a30" />
                <rect x="35" y="30" width="30" height="8" fill="#0e4a30" />
                <rect x="40" y="45" width="20" height="20" fill="#0e4a30" />
                <rect x="65" y="45" width="12" height="12" fill="#0e4a30" />
                <rect x="15" y="40" width="12" height="15" fill="#0e4a30" />
                <rect x="35" y="72" width="15" height="15" fill="#0e4a30" />
                <rect x="58" y="75" width="25" height="10" fill="#0e4a30" />
                <rect x="75" y="60" width="15" height="8" fill="#0e4a30" />
              </svg>
            </div>

            {/* Barcode & Member ID */}
            <div className="bg-stone-100 p-3 rounded-xl font-mono text-center border border-stone-200">
              <div className="tracking-[0.3em] text-xs font-black text-stone-800">
                ||| | |||| || | ||| |||| |
              </div>
              <div className="text-xs text-emerald-800 font-bold mt-1">
                {customer.memberId}
              </div>
            </div>

            <button
              id="close-qr-zoom-btn"
              onClick={() => setShowQRZoom(false)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition"
            >
              Done Scanning
            </button>
          </div>
        </div>
      )}

      {/* Free Drink Voucher Redemption Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-emerald-600 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm border border-emerald-300">
              <Gift className="w-7 h-7 text-emerald-700" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase font-black tracking-widest text-emerald-700">
                Congratulations!
              </span>
              <h4 className="text-xl font-black text-stone-900 font-['Outfit']">
                Free 16oz Booost Shake
              </h4>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                You collected 10 stamps! Redeem any 16oz Medium Shake (any flavor) at {selectedBranch}.
              </p>
            </div>

            {/* Voucher Code Card */}
            <div className="bg-emerald-50 border-2 border-dashed border-emerald-400 p-3.5 rounded-2xl space-y-1">
              <div className="text-[10px] text-stone-600 uppercase tracking-wider font-semibold">
                Cashier Claim Code
              </div>
              <div className="text-xl font-mono font-black text-emerald-900 tracking-widest">
                BOOOST-FREE-9842
              </div>
              <div className="text-[10px] text-emerald-800 font-medium">
                Single-use • Valid today for any 16oz flavor
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                id="cancel-voucher-modal-btn"
                onClick={() => setShowVoucherModal(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl border border-stone-300 transition"
              >
                Save for Later
              </button>
              <button
                id="redeem-free-drink-btn"
                onClick={handleUseFreeDrink}
                className="flex-1 py-2.5 bg-[#0e4a30] hover:bg-[#12593a] text-white text-xs font-black rounded-xl shadow-md transition"
              >
                Redeem Right Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scan App QR Modal */}
      <ScanAppQRModal
        isOpen={showScanAppQR}
        onClose={() => setShowScanAppQR(false)}
      />
    </div>
  );
};
