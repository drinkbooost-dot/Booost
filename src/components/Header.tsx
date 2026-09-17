import React from 'react';
import { MapPin, User, Sparkles, ShoppingBag, ShieldCheck, Instagram, QrCode, Gift } from 'lucide-react';
import { CustomerProfile, NavigationTab } from '../types';
import { PWAInstallPrompt } from './PWAInstallPrompt';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  customer: CustomerProfile;
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  onOpenProfile: () => void;
  onOpenOrder: () => void;
  onOpenQuickPass: () => void;
  onOpenScanAppQR: () => void;
  orderCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  customer,
  selectedBranch,
  setSelectedBranch,
  onOpenProfile,
  onOpenOrder,
  onOpenQuickPass,
  onOpenScanAppQR,
  orderCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-[#0e4a30] border-b border-emerald-900 text-[11px] md:text-xs py-1.5 px-4 text-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-2xl overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 rounded-full bg-[#84cc16] animate-pulse shrink-0" />
          <span className="font-semibold text-white">SM City Dasmariñas & SM City Trece Branches Open Today!</span>
          <span className="hidden sm:inline text-emerald-200">| Buy 10 drinks, get a FREE 16oz drink (any flavor)!</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('menu-franchise')}
            className="text-[#cbf738] hover:underline font-semibold flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Franchise Info</span>
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              id="header-brand-logo-btn"
              onClick={() => setActiveTab('loyalty')}
              className="text-left group focus:outline-none"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-2xl md:text-3xl tracking-tight text-[#0e4a30] font-['Outfit'] group-hover:text-emerald-700 transition-colors">
                  BOOOST
                </span>
                <span className="h-2 w-2 rounded-full bg-[#84cc16]" />
              </div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-widest font-bold text-stone-500 -mt-1">
                Power Your Day
              </div>
            </button>

            {/* Location Selector */}
            <div className="hidden lg:flex items-center gap-1.5 bg-stone-100 border border-stone-200 rounded-full px-3 py-1.5 text-xs text-stone-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <select
                id="branch-selector"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                aria-label="Select Booost Branch"
                className="bg-transparent text-stone-800 font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="SM City Dasmariñas">SM City Dasmariñas (Cavite)</option>
                <option value="SM City Trece">SM City Trece (Cavite)</option>
              </select>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            <button
              id="nav-tab-loyalty"
              onClick={() => setActiveTab('loyalty')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'loyalty'
                  ? 'bg-[#0e4a30] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#84cc16]" />
              <span>Loyalty Card</span>
              {customer.freeDrinksAvailable > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                  FREE!
                </span>
              )}
            </button>

            <button
              id="nav-tab-menu-franchise"
              onClick={() => setActiveTab('menu-franchise')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'menu-franchise'
                  ? 'bg-[#0e4a30] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              <span>Menu & Franchise</span>
            </button>

            <button
              id="nav-tab-workout"
              onClick={() => setActiveTab('workout')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'workout'
                  ? 'bg-[#0e4a30] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              <span>Workout Routines</span>
            </button>

            <button
              id="nav-tab-habits"
              onClick={() => setActiveTab('habits')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'habits'
                  ? 'bg-[#0e4a30] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              <span>Health Habits</span>
            </button>

            <button
              id="nav-tab-social"
              onClick={() => setActiveTab('social')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'social'
                  ? 'bg-gradient-to-r from-[#e1306c] to-[#fd1d1d] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#e1306c] hover:bg-rose-50'
              }`}
            >
              <Instagram className="w-4 h-4 text-current" />
              <span>Instagram</span>
            </button>
          </nav>

          {/* Right Action: Fast Loyalty Pass, Customer Profile & Order */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Scan QR to Open App on Mobile */}
            <button
              id="header-scan-app-qr-btn"
              onClick={onOpenScanAppQR}
              className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs group cursor-pointer"
              title="Generate QR code to scan and open Booost App on mobile"
            >
              <QrCode className="w-3.5 h-3.5 text-[#0e4a30] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Scan App QR</span>
            </button>

            {/* Install Native PWA Button */}
            <PWAInstallPrompt compact={true} />

            {/* Quick-Access Scannable Loyalty Pass Button */}
            <button
              id="header-quick-pass-btn"
              onClick={onOpenQuickPass}
              className="flex items-center gap-1.5 bg-[#0e4a30] hover:bg-[#12593a] text-white border border-emerald-600 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs group"
              title="Quick Show Loyalty Pass & Barcode to Cashier"
            >
              <QrCode className="w-4 h-4 text-[#84cc16] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">My Pass</span>
              <span className="bg-[#84cc16] text-[#051811] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {customer.stampsCount}/10
              </span>
              {customer.freeDrinksAvailable > 0 && (
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>

            {/* Quick Order Pickup Button */}
            <button
              id="open-order-modal-btn"
              onClick={onOpenOrder}
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all relative group"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Order Pickup</span>
              {orderCount > 0 && (
                <span className="bg-[#0e4a30] text-[#cbf738] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {orderCount}
                </span>
              )}
            </button>

            {/* Profile Avatar & Loyalty Quick Badge */}
            <button
              id="open-profile-btn"
              onClick={onOpenProfile}
              className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0e4a30] to-emerald-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <span>{customer.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold border border-emerald-200">
                    {customer.tier.split(' ')[0]}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Tab Bottom Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 bg-white py-2 px-1 shadow-xs">
        <button
          id="mobile-nav-loyalty"
          onClick={() => setActiveTab('loyalty')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold relative ${
            activeTab === 'loyalty' ? 'text-emerald-800 font-black' : 'text-stone-500'
          }`}
        >
          <div className="relative">
            <Sparkles className="w-4 h-4" />
            <span className="absolute -top-1 -right-2 bg-[#84cc16] text-[#051811] text-[8px] font-black px-1 rounded-full">
              {customer.stampsCount}
            </span>
          </div>
          <span>Loyalty</span>
        </button>

        <button
          id="mobile-nav-menu"
          onClick={() => setActiveTab('menu-franchise')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold ${
            activeTab === 'menu-franchise' ? 'text-emerald-800 font-black' : 'text-stone-500'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Menu</span>
        </button>

        <button
          id="mobile-nav-workout"
          onClick={() => setActiveTab('workout')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold ${
            activeTab === 'workout' ? 'text-emerald-800 font-black' : 'text-stone-500'
          }`}
        >
          <span className="text-sm">🏋️</span>
          <span>Workout</span>
        </button>

        <button
          id="mobile-nav-habits"
          onClick={() => setActiveTab('habits')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold ${
            activeTab === 'habits' ? 'text-emerald-800 font-black' : 'text-stone-500'
          }`}
        >
          <span className="text-sm">🥗</span>
          <span>Habits</span>
        </button>

        <button
          id="mobile-nav-social"
          onClick={() => setActiveTab('social')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold ${
            activeTab === 'social' ? 'text-[#e1306c] font-black' : 'text-stone-500'
          }`}
        >
          <Instagram className="w-4 h-4" />
          <span>Instagram</span>
        </button>
      </div>
    </header>
  );
};
