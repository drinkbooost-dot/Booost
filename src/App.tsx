import React, { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { Header } from './components/Header';
import { LoyaltyCardView } from './components/LoyaltyCardView';
import { MenuFranchiseView } from './components/MenuFranchiseView';
import { WorkoutView } from './components/WorkoutView';
import { HealthHabitsView } from './components/HealthHabitsView';
import { InstagramSocialView } from './components/InstagramSocialView';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { OrderPickupModal } from './components/OrderPickupModal';
import { QuickPassModal } from './components/QuickPassModal';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { ScanAppQRModal } from './components/ScanAppQRModal';
import { CustomerProfile, DailyHabitLog, LoyaltyStamp, NavigationTab, MenuItem, CupSize } from './types';
import { MENU_ITEMS } from './data/menuData';

const INITIAL_PROFILE: CustomerProfile = {
  name: 'Alex Rivera',
  memberId: 'BOOOST-7729-VIP',
  email: 'alex.fitness@gmail.com',
  phone: '+63 917 555 1289',
  tier: 'Gold Booster',
  totalStampsCollected: 13,
  stampsCount: 5, // 5 of 10 completed
  freeDrinksAvailable: 1,
  favoriteBranch: 'SM City Dasmariñas',
  joinedDate: 'July 2025',
  fitnessGoal: 'Muscle Gain',
};

const INITIAL_STAMPS: LoyaltyStamp[] = [
  { id: 1, drinkName: 'Iron Man Supreme (22oz)', branchName: 'SM City Dasmariñas', stampedAt: 'Today, 8:40 AM' },
  { id: 2, drinkName: 'Profee Supreme (16oz)', branchName: 'SM City Dasmariñas', stampedAt: 'Yesterday, 9:15 AM' },
  { id: 3, drinkName: 'Chocoloco (22oz)', branchName: 'SM City Trece', stampedAt: 'Sep 10, 4:30 PM' },
  { id: 4, drinkName: 'Biscoff Protein Deluxe', branchName: 'SM City Dasmariñas', stampedAt: 'Sep 08, 2:10 PM' },
  { id: 5, drinkName: 'Lean Green Machine', branchName: 'SM City Trece', stampedAt: 'Sep 06, 11:20 AM' },
];

const INITIAL_HABIT_LOG: DailyHabitLog = {
  date: new Date().toISOString().split('T')[0],
  waterGlasses: 5,
  targetWaterGlasses: 8,
  proteinCurrentGrams: 56,
  targetProteinGrams: 110,
  drankBooostShake: true,
  loggedShakeName: 'Iron Man Supreme',
  completedWorkout: false,
  sleepHours: 7.5,
  mindfulnessDone: true,
  sunlightMorning: true,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('loyalty');
  const [selectedBranch, setSelectedBranch] = useState<string>('SM City Dasmariñas');
  
  // Stored state with localStorage fallback
  const [customer, setCustomer] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem('booost_customer_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [stampsHistory, setStampsHistory] = useState<LoyaltyStamp[]>(() => {
    const saved = localStorage.getItem('booost_stamps_history');
    return saved ? JSON.parse(saved) : INITIAL_STAMPS;
  });

  const [habitLog, setHabitLog] = useState<DailyHabitLog>(() => {
    const saved = localStorage.getItem('booost_habit_log');
    return saved ? JSON.parse(saved) : INITIAL_HABIT_LOG;
  });

  // Modal states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isQuickPassOpen, setIsQuickPassOpen] = useState(false);
  const [isScanAppQROpen, setIsScanAppQROpen] = useState(false);
  const [orderItem, setOrderItem] = useState<MenuItem | null>(MENU_ITEMS[0]);
  const [orderSize, setOrderSize] = useState<CupSize>('16oz');
  const [orderIsProtein, setOrderIsProtein] = useState<boolean>(true);
  const [orderCount, setOrderCount] = useState<number>(1);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('booost_customer_profile', JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    localStorage.setItem('booost_stamps_history', JSON.stringify(stampsHistory));
  }, [stampsHistory]);

  useEffect(() => {
    localStorage.setItem('booost_habit_log', JSON.stringify(habitLog));
  }, [habitLog]);

  // Handle selecting item for order
  const handleSelectItemForOrder = (item: MenuItem, size: CupSize, isProtein: boolean) => {
    setOrderItem(item);
    setOrderSize(size);
    setOrderIsProtein(isProtein);
    setIsOrderOpen(true);
  };

  // Handle workout shake order trigger
  const handleWorkoutOrderShake = (shakeId: string) => {
    const found = MENU_ITEMS.find(i => i.id === shakeId || i.id.includes(shakeId)) || MENU_ITEMS[0];
    handleSelectItemForOrder(found, '22oz', true);
  };

  // Workout completed callback
  const handleCompleteWorkout = (workoutName: string, calories: number) => {
    setHabitLog(prev => ({
      ...prev,
      completedWorkout: true,
    }));
  };

  // Order pickup success callback
  const handleOrderSuccess = (orderItemName: string) => {
    setOrderCount(prev => prev + 1);
    
    // Auto stamp card
    const nextCount = customer.stampsCount + 1;
    const isFreeEarned = nextCount >= 10;

    const newStamp: LoyaltyStamp = {
      id: Date.now(),
      stampedAt: 'Just Now',
      drinkName: orderItemName,
      branchName: selectedBranch,
      earnedFree: isFreeEarned,
    };

    setStampsHistory(prev => [newStamp, ...prev]);

    setCustomer(prev => {
      const nextTotal = prev.totalStampsCollected + 1;
      let nextTier = prev.tier;
      if (nextTotal >= 30) nextTier = 'Champion Booster';
      else if (nextTotal >= 10) nextTier = 'Gold Booster';

      return {
        ...prev,
        stampsCount: isFreeEarned ? 0 : nextCount,
        totalStampsCollected: nextTotal,
        freeDrinksAvailable: isFreeEarned ? prev.freeDrinksAvailable + 1 : prev.freeDrinksAvailable,
        tier: nextTier,
      };
    });

    // Also update habits
    setHabitLog(prev => ({
      ...prev,
      drankBooostShake: true,
      loggedShakeName: orderItemName,
      proteinCurrentGrams: Math.min(prev.proteinCurrentGrams + 28, prev.targetProteinGrams),
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-stone-900 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-[#cbf738] selection:text-[#051811]">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customer={customer}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenOrder={() => {
          setOrderItem(MENU_ITEMS[0]);
          setIsOrderOpen(true);
        }}
        onOpenQuickPass={() => setIsQuickPassOpen(true)}
        onOpenScanAppQR={() => setIsScanAppQROpen(true)}
        orderCount={orderCount}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {/* PWA In-App Install Banner */}
        <div className="max-w-5xl mx-auto px-4 pt-3 pb-1">
          <PWAInstallPrompt />
        </div>

        {activeTab === 'loyalty' && (
          <LoyaltyCardView
            customer={customer}
            setCustomer={setCustomer}
            stampsHistory={stampsHistory}
            setStampsHistory={setStampsHistory}
            selectedBranch={selectedBranch}
          />
        )}

        {activeTab === 'menu-franchise' && (
          <MenuFranchiseView
            selectedBranch={selectedBranch}
            onSelectItemForOrder={handleSelectItemForOrder}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutView
            onCompleteWorkout={handleCompleteWorkout}
            onOrderShake={handleWorkoutOrderShake}
          />
        )}

        {activeTab === 'habits' && (
          <HealthHabitsView
            habitLog={habitLog}
            setHabitLog={setHabitLog}
            customer={customer}
            onOrderShakeTab={() => setActiveTab('menu-franchise')}
          />
        )}

        {activeTab === 'social' && (
          <InstagramSocialView
            onSelectItemForOrder={handleSelectItemForOrder}
          />
        )}
      </main>

      {/* Floating Easy-Access Loyalty Card / QR Pass Button (Always accessible) */}
      <div className="fixed bottom-18 md:bottom-6 right-4 z-40">
        <button
          id="floating-quick-pass-btn"
          onClick={() => setIsQuickPassOpen(true)}
          className="flex items-center gap-2.5 bg-[#0b3e28] hover:bg-[#0e4a30] text-white pl-2.5 pr-4 py-2 rounded-full shadow-xl border-2 border-[#84cc16] transition-all transform hover:scale-105 active:scale-95 group cursor-pointer"
          title="Tap to show Cashier Loyalty QR / Barcode"
        >
          <div className="w-8 h-8 rounded-full bg-[#84cc16] text-[#051811] flex items-center justify-center font-black shrink-0 shadow-inner group-hover:rotate-12 transition-transform">
            <QrCode className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider font-black text-[#84cc16] leading-tight flex items-center gap-1">
              <span>Card Pass</span>
              {customer.freeDrinksAvailable > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <div className="text-xs font-black text-white leading-tight">
              {customer.stampsCount}/10 Stamps
            </div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 px-4 text-center text-xs text-stone-600 space-y-3">
        <div className="flex items-center justify-center gap-2 text-stone-900">
          <span className="font-['Outfit'] font-black text-lg text-[#0e4a30]">BOOOST</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#84cc16]" />
          <span className="font-bold text-xs tracking-wider text-emerald-800">POWER YOUR DAY WITH BOOOST</span>
        </div>
        <p className="max-w-md mx-auto text-[11px] text-stone-500">
          Plant-based goodness, whole real fruits, and ultra-filtered protein. Official branches at SM City Dasmariñas & SM City Trece (Cavite). Franchise inquiries: drinkbooost@gmail.com
        </p>
        <div className="flex justify-center gap-4 text-[11px] text-emerald-700 font-semibold flex-wrap">
          <button onClick={() => setActiveTab('loyalty')} className="hover:underline">Digital Loyalty Pass</button>
          <span>•</span>
          <button onClick={() => setActiveTab('menu-franchise')} className="hover:underline">Franchise Packages</button>
          <span>•</span>
          <button onClick={() => setActiveTab('workout')} className="hover:underline">Workout Programs</button>
          <span>•</span>
          <button onClick={() => setActiveTab('habits')} className="hover:underline">Daily Habits Tracker</button>
          <span>•</span>
          <button onClick={() => setActiveTab('social')} className="hover:underline text-[#e1306c] font-bold">Instagram @drinkbooost</button>
        </div>
      </footer>

      {/* Modals */}
      <CustomerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        customer={customer}
        setCustomer={setCustomer}
      />

      <OrderPickupModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        selectedItem={orderItem}
        initialSize={orderSize}
        initialIsProtein={orderIsProtein}
        selectedBranch={selectedBranch}
        onOrderSuccess={handleOrderSuccess}
      />

      <QuickPassModal
        isOpen={isQuickPassOpen}
        onClose={() => setIsQuickPassOpen(false)}
        customer={customer}
        setCustomer={setCustomer}
        selectedBranch={selectedBranch}
        onViewFullCard={() => {
          setIsQuickPassOpen(false);
          setActiveTab('loyalty');
        }}
        onAddStampHistory={(stamp) => setStampsHistory(prev => [stamp, ...prev])}
      />

      <ScanAppQRModal
        isOpen={isScanAppQROpen}
        onClose={() => setIsScanAppQROpen(false)}
      />
    </div>
  );
}
