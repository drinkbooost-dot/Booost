import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Send, 
  Layers, 
  Coffee, 
  Zap, 
  ShieldCheck, 
  Plus, 
  ChevronRight,
  ExternalLink,
  Flame,
  Droplets,
  Award,
  Instagram,
  Heart
} from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';
import { OFFICIAL_BRANCHES, FRANCHISE_PACKAGES, FRANCHISE_FAQS } from '../data/franchiseData';
import { MenuItem, ShakeCategory, ShakeBenefit, CupSize, FranchiseInquiryForm } from '../types';

interface MenuFranchiseViewProps {
  selectedBranch: string;
  onSelectItemForOrder: (item: MenuItem, size: CupSize, isProtein: boolean) => void;
}

export const MenuFranchiseView: React.FC<MenuFranchiseViewProps> = ({
  selectedBranch,
  onSelectItemForOrder,
}) => {
  const [subView, setSubView] = useState<'menu' | 'franchise'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBenefit, setSelectedBenefit] = useState<ShakeBenefit | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<CupSize>('16oz');
  const [selectedItemDetail, setSelectedItemDetail] = useState<MenuItem | null>(null);

  // Franchise ROI Calculator State
  const [dailyCups, setDailyCups] = useState<number>(90);
  const [cupSizePref, setCupSizePref] = useState<'16oz' | '22oz'>('16oz');

  // Franchise Inquiry Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState<FranchiseInquiryForm>({
    fullName: '',
    email: '',
    contactNumber: '',
    preferredLocation: '',
    investmentBudget: '₱400,000 - ₱600,000 (Standard Mall Kiosk)',
    experienceInFoodBev: 'Yes, 1-3 years',
    notes: '',
  });

  const CUSTOMER_FAVORITE_IDS = [
    'iron-man-supreme',
    'chocoloco',
    'profee-supreme-coffee',
    'biscoff-protein-deluxe',
    'classic-chocolate',
    'lean-green-machine',
    'classic-strawberry'
  ];

  // Filter menu items
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = 
      selectedCategory === 'All' ? true :
      selectedCategory === 'Customer Favorites' ? (CUSTOMER_FAVORITE_IDS.includes(item.id) || item.isBestSeller) :
      item.category === selectedCategory;
    const matchesBenefit = selectedBenefit === 'All' || item.benefits.includes(selectedBenefit as ShakeBenefit);
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBenefit && matchesSearch;
  });

  // ROI Calculator Math
  const avgCupPrice = cupSizePref === '16oz' ? 199 : 245;
  const grossMarginPercent = 0.68; // 68% gross profit margin
  const dailySales = dailyCups * avgCupPrice;
  const monthlySales = dailySales * 30;
  const monthlyCOGS = monthlySales * (1 - grossMarginPercent);
  const estimatedMonthlyLaborRent = 75000; // Estimated mall rent + 2 staff salaries
  const estimatedNetProfit = monthlySales - monthlyCOGS - estimatedMonthlyLaborRent;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.fullName || !inquiryForm.email || !inquiryForm.contactNumber) {
      alert('Please fill out your name, email, and contact number.');
      return;
    }
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Sub-navigation Switcher */}
      <div className="flex items-center justify-center">
        <div className="bg-[#051a11] p-1.5 rounded-2xl border border-emerald-800/80 flex items-center shadow-lg">
          <button
            id="subnav-menu-btn"
            onClick={() => setSubView('menu')}
            className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
              subView === 'menu'
                ? 'bg-[#cbf738] text-[#051811] shadow-md shadow-[#cbf738]/20'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <span>Official Drink Menu</span>
          </button>

          <button
            id="subnav-franchise-btn"
            onClick={() => setSubView('franchise')}
            className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
              subView === 'franchise'
                ? 'bg-[#cbf738] text-[#051811] shadow-md shadow-[#cbf738]/20'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Franchise Opportunity</span>
          </button>
        </div>
      </div>

      {subView === 'menu' ? (
        /* MENU SECTION */
        <div className="space-y-6">
          {/* Header Banner mirroring the official board */}
          <div className="bg-gradient-to-r from-[#062417] via-[#093522] to-[#04190f] border-2 border-emerald-700/50 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#cbf738]/15 border border-[#cbf738]/30 text-[#cbf738] text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Power Your Day With Booost
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight">
              BOOOST SHAKE MENU
            </h1>
            <p className="text-stone-300 text-sm max-w-2xl mx-auto mt-2">
              Crafted with plant-based goodness, pure whey isolate, and real whole fruit ingredients. Available at <span className="text-[#cbf738] font-bold">SM City Dasmariñas</span> & <span className="text-[#cbf738] font-bold">SM City Trece</span>.
            </p>

            {/* Official Pricing Callout Bar */}
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-[#03150d]/90 border border-emerald-700/60 p-2.5 rounded-2xl">
              <div className="px-3.5 py-1.5 bg-emerald-900/60 rounded-xl flex items-center gap-2">
                <span className="text-xs text-stone-300 font-bold">16oz Medium</span>
                <span className="text-base font-black text-[#cbf738]">₱199</span>
                <span className="text-[10px] text-stone-400">(Non-Protein ₱180)</span>
              </div>
              <div className="px-3.5 py-1.5 bg-emerald-900/60 rounded-xl flex items-center gap-2">
                <span className="text-xs text-stone-300 font-bold">22oz Large</span>
                <span className="text-base font-black text-[#cbf738]">₱245</span>
                <span className="text-[10px] text-stone-400">(Non-Protein ₱220)</span>
              </div>
              <div className="px-3.5 py-1.5 bg-amber-950/60 border border-amber-600/40 rounded-xl flex items-center gap-2">
                <span className="text-xs text-amber-300 font-bold">👶 Kid Friendly</span>
                <span className="text-xs font-black text-white">16oz:</span>
                <span className="text-base font-black text-[#cbf738]">₱180</span>
                <span className="text-stone-500">•</span>
                <span className="text-xs font-black text-white">22oz:</span>
                <span className="text-base font-black text-[#cbf738]">₱220</span>
              </div>
            </div>

            {/* Badges Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span>💧 Immunity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#cbf738]" />
                <span>🟢 High Protein</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>⚡ Natural Energy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🌱 Plant-Based Goodness</span>
              </div>
            </div>
          </div>

          {/* Search, Size & Benefit Filters */}
          <div className="bg-[#061e15] border border-emerald-800/80 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="search-menu-input"
                type="text"
                placeholder="Search shakes, fruits, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#04150e] border border-emerald-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#cbf738]"
              />
            </div>

            {/* Size Preference Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-bold">Showing Size:</span>
              <div className="flex bg-[#04150e] p-1 rounded-xl border border-emerald-800">
                <button
                  id="size-toggle-16oz"
                  onClick={() => setSelectedSize('16oz')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    selectedSize === '16oz'
                      ? 'bg-[#cbf738] text-[#051811]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  16oz Medium (₱199)
                </button>
                <button
                  id="size-toggle-22oz"
                  onClick={() => setSelectedSize('22oz')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    selectedSize === '22oz'
                      ? 'bg-[#cbf738] text-[#051811]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  22oz Large (₱245)
                </button>
              </div>
            </div>

            {/* Benefit Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs text-stone-400 font-bold shrink-0">Benefit:</span>
              {(['All', 'Protein', 'Immunity', 'Energy'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBenefit(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 ${
                    selectedBenefit === b
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#04160f] text-stone-300 hover:bg-emerald-900/60'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition ${
                selectedCategory === 'All'
                  ? 'bg-[#cbf738] text-[#051811]'
                  : 'bg-[#072418] text-stone-300 hover:bg-emerald-900 border border-emerald-800/60'
              }`}
            >
              All Shakes ({MENU_ITEMS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('Customer Favorites')}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory === 'Customer Favorites'
                  ? 'bg-[#cbf738] text-[#051811]'
                  : 'bg-amber-950/70 text-amber-300 hover:bg-amber-900/80 border border-amber-600/50'
              }`}
            >
              <span>🏆 Customer Favorites</span>
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-[#cbf738] text-[#051811]'
                    : 'bg-[#072418] text-stone-300 hover:bg-emerald-900 border border-emerald-800/60'
                }`}
              >
                <span>{cat}</span>
                {cat === 'Kid Friendly' && (
                  <span className="bg-amber-400 text-stone-900 text-[9px] px-1 py-0.2 rounded font-black">
                    ₱180
                  </span>
                )}
                {cat.includes('Profee') && (
                  <span className="bg-amber-500 text-stone-900 text-[9px] px-1 py-0.2 rounded font-black">
                    NEW!
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Instagram Official Community Banner */}
          <div className="bg-gradient-to-r from-[#0d2a1f] via-[#081e15] to-[#120817] border border-emerald-700/50 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                  <span>Follow Our Daily Blends On Instagram</span>
                  <span className="text-[10px] text-[#cbf738] font-mono font-bold">@drinkbooost</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  Tag #BooostPH at SM Dasmariñas & SM Trece kiosks to get featured on our feed!
                </div>
              </div>
            </div>

            <a
              href="https://www.instagram.com/drinkbooost"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#e1306c] to-[#fd1d1d] hover:opacity-95 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Visit @drinkbooost</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Customer Favorites Shelf (Strictly zero reviews) */}
          {(selectedCategory === 'All' || selectedCategory === 'Customer Favorites') && !searchQuery && (
            <div className="bg-[#051e15]/90 border border-emerald-700/60 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white font-['Outfit']">
                      Customer Favorites Drinks
                    </h2>
                    <p className="text-xs text-stone-400">
                      The top most-ordered protein shakes & kid-friendly blends in Cavite.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#cbf738] bg-[#03150d] px-2.5 py-1 rounded-full border border-emerald-700/50">
                  Daily Top Picks
                </span>
              </div>

              {/* Horizontal Scroll of Customer Favorites */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  {
                    id: 'iron-man-supreme',
                    rank: '#1',
                    name: 'Iron Man Supreme',
                    tag: 'Most Ordered',
                    color: 'from-emerald-950 to-emerald-900 border-emerald-500/50 text-emerald-300',
                    price: '₱199 / ₱245'
                  },
                  {
                    id: 'chocoloco',
                    rank: '#2',
                    name: 'Chocoloco',
                    tag: 'Crowd Favorite',
                    color: 'from-amber-950 to-stone-900 border-amber-700/50 text-amber-300',
                    price: '₱199 / ₱245'
                  },
                  {
                    id: 'profee-supreme-coffee',
                    rank: '#3',
                    name: 'Profee Supreme',
                    tag: 'Coffee + Whey',
                    color: 'from-amber-950 to-yellow-950 border-yellow-700/50 text-yellow-300',
                    price: '₱199 / ₱245'
                  },
                  {
                    id: 'biscoff-protein-deluxe',
                    rank: '#4',
                    name: 'Biscoff Deluxe',
                    tag: 'Lotus Caramel',
                    color: 'from-amber-900 to-yellow-950 border-amber-600/50 text-amber-200',
                    price: '₱199 / ₱245'
                  },
                  {
                    id: 'classic-chocolate',
                    rank: '#5',
                    name: 'Classic Chocolate',
                    tag: 'Kid Friendly',
                    color: 'from-amber-950 to-stone-900 border-amber-700/50 text-amber-300',
                    price: '16oz ₱180 | 22oz ₱220'
                  },
                  {
                    id: 'lean-green-machine',
                    rank: '#6',
                    name: 'Lean Green',
                    tag: 'Detox Power',
                    color: 'from-emerald-950 to-green-950 border-lime-500/50 text-lime-300',
                    price: '₱199 / ₱245'
                  }
                ].map((fav) => {
                  const item = MENU_ITEMS.find(i => i.id === fav.id) || MENU_ITEMS[0];
                  return (
                    <div
                      key={fav.id}
                      onClick={() => onSelectItemForOrder(item, '16oz', true)}
                      className={`bg-gradient-to-b ${fav.color} p-3 rounded-2xl border text-center cursor-pointer hover:scale-105 transition shadow-sm flex flex-col justify-between group`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-black mb-1">
                          <span className="bg-black/60 px-1.5 py-0.5 rounded text-white font-mono">{fav.rank}</span>
                          <span className="text-[#cbf738]">{fav.tag}</span>
                        </div>
                        <div className="text-2xl my-1 group-hover:scale-110 transition-transform">🥤</div>
                        <h3 className="text-xs font-bold text-white truncate">{fav.name}</h3>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <span className="text-[10px] font-bold text-stone-300 block">{fav.price}</span>
                        <span className="text-[10px] font-black text-[#cbf738] block group-hover:underline">
                          + Order Now
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const currentPrice = selectedSize === '16oz' ? item.price16ozProtein : item.price22ozProtein;
              const nonProteinPrice = selectedSize === '16oz' ? item.price16ozNonProtein : item.price22ozNonProtein;

              return (
                <div
                  key={item.id}
                  className={`bg-gradient-to-b ${item.colorTheme.bg} border ${item.colorTheme.border} rounded-3xl p-5 flex flex-col justify-between hover:shadow-xl hover:scale-[1.01] transition-all group relative overflow-hidden`}
                >
                  <div>
                    {/* Top Row Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.colorTheme.tagBg}`}>
                        {item.category.split(' ')[0]}
                      </span>

                      <div className="flex items-center gap-1">
                        {item.isBestSeller && (
                          <span className="bg-amber-500 text-stone-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                            ★ Best Seller
                          </span>
                        )}
                        {item.isNew && (
                          <span className="bg-[#cbf738] text-[#051811] text-[10px] font-black px-2 py-0.5 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Drink Name */}
                    <h3 className="text-xl font-black text-white font-['Outfit'] group-hover:text-[#cbf738] transition-colors">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-stone-300 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Ingredients Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="text-[10px] bg-black/40 text-stone-300 px-2 py-0.5 rounded-md border border-white/10">
                          {ing}
                        </span>
                      ))}
                      {item.ingredients.length > 3 && (
                        <span className="text-[10px] text-stone-400 self-center">
                          +{item.ingredients.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nutrition & Action Bottom Bar */}
                  <div className="mt-5 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[#cbf738] font-bold">
                          {item.proteinGrams16oz}g Protein
                        </span>
                        <span className="text-stone-400">•</span>
                        <span className="text-stone-300">
                          {item.calories16oz} kcal
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-white">₱{currentPrice}</span>
                        <span className="text-[10px] text-stone-400 block -mt-1">
                          {item.category === 'Kid Friendly' ? '👶 Kid Friendly Special' : `Non-prot. ₱${nonProteinPrice}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedItemDetail(item)}
                        className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-bold rounded-xl transition text-center"
                      >
                        Details & Nutrition
                      </button>
                      <button
                        onClick={() => onSelectItemForOrder(item, selectedSize, true)}
                        className="px-3.5 py-2 bg-[#cbf738] hover:bg-[#b8e229] text-[#051811] text-xs font-black rounded-xl transition flex items-center gap-1 shrink-0 shadow-md shadow-[#cbf738]/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Item Detail Modal */}
          {selectedItemDetail && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-gradient-to-b from-[#092e1e] to-[#04150e] border-2 border-emerald-600 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase text-[#cbf738] tracking-wider">
                      {selectedItemDetail.category}
                    </span>
                    <h3 className="text-2xl font-black text-white font-['Outfit']">
                      {selectedItemDetail.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedItemDetail(null)}
                    className="text-stone-400 hover:text-white p-1"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-stone-300 text-xs leading-relaxed">
                  {selectedItemDetail.description}
                </p>

                {/* Macro Nutrients Grid */}
                <div className="grid grid-cols-4 gap-2 bg-[#03130d] p-3 rounded-2xl border border-emerald-800 text-center">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase">Protein</div>
                    <div className="text-base font-black text-[#cbf738]">{selectedItemDetail.proteinGrams16oz}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase">Calories</div>
                    <div className="text-base font-black text-white">{selectedItemDetail.calories16oz}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase">Carbs</div>
                    <div className="text-base font-black text-stone-300">{selectedItemDetail.carbsGrams16oz}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase">Healthy Fat</div>
                    <div className="text-base font-black text-stone-300">{selectedItemDetail.fatGrams16oz}g</div>
                  </div>
                </div>

                {/* Ingredients List */}
                <div>
                  <h4 className="text-xs font-bold text-white mb-2">Real Whole Ingredients:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItemDetail.ingredients.map((ing, i) => (
                      <span key={i} className="text-xs bg-emerald-950 text-emerald-200 border border-emerald-700/60 px-2.5 py-1 rounded-lg">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Best Time & Pairing */}
                <div className="bg-[#051c13] p-3 rounded-xl border border-emerald-800/80 text-xs text-stone-300 flex items-center gap-3">
                  <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white">Recommended Fuel Window: </span>
                    <span>Best taken as a {selectedItemDetail.bestTime} nutrition booster to maximize protein synthesis.</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      onSelectItemForOrder(selectedItemDetail, '16oz', true);
                      setSelectedItemDetail(null);
                    }}
                    className="flex-1 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
                  >
                    Order 16oz (₱{selectedItemDetail.price16ozProtein})
                  </button>
                  <button
                    onClick={() => {
                      onSelectItemForOrder(selectedItemDetail, '22oz', true);
                      setSelectedItemDetail(null);
                    }}
                    className="flex-1 py-2.5 bg-[#cbf738] hover:bg-[#b5e028] text-[#051811] font-black text-xs rounded-xl shadow-lg transition"
                  >
                    Order 22oz (₱{selectedItemDetail.price22ozProtein})
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* FRANCHISE OPPORTUNITY SECTION */
        <div className="space-y-10">
          {/* Franchise Hero */}
          <div className="bg-gradient-to-r from-[#06291b] via-[#0b3c26] to-[#041a10] border-2 border-emerald-600/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#cbf738]/20 border border-[#cbf738]/40 text-[#cbf738] text-xs font-black uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                Franchise Opportunity 2026
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">
                Bring Booost to Your City
              </h2>
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
                Join the Philippines' fastest growing functional protein shake franchise. High gross profit margins (65%+), rapid turn-key setup in 30 days, and strong recurring demand from gym-goers, health enthusiasts, and mall shoppers.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
                <span>✓ Centralized Commissary Supply</span>
                <span>✓ Turn-Key Equipment Package</span>
                <span>✓ Staff & Barista Training</span>
                <span>✓ Full Digital POS & Loyalty App</span>
              </div>
            </div>
          </div>

          {/* Current Official Operating Branches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white font-['Outfit'] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#cbf738]" />
                  <span>Official Operating Branches</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Visit our operational stores in Cavite to experience the Booost standard firsthand.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {OFFICIAL_BRANCHES.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#061e15] border border-emerald-700/60 p-5 rounded-3xl space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black bg-[#cbf738] text-[#051811] px-2 py-0.5 rounded uppercase">
                        {b.isFlagship ? 'Flagship Store' : 'Mall Kiosk'}
                      </span>
                      <h4 className="text-lg font-black text-white font-['Outfit'] mt-1">{b.name}</h4>
                      <div className="text-xs text-emerald-300">{b.city}, {b.province}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-950 text-[#cbf738] border border-emerald-700/80 rounded-lg text-xs font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#cbf738] animate-ping" />
                      {b.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-emerald-900/60 space-y-1.5 text-xs text-stone-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{b.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{b.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Franchise Packages */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white font-['Outfit'] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#cbf738]" />
              <span>Available Franchise Formats</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {FRANCHISE_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-[#061e15] rounded-3xl p-6 flex flex-col justify-between border transition-all ${
                    pkg.popular
                      ? 'border-2 border-[#cbf738] shadow-xl shadow-[#cbf738]/10 relative'
                      : 'border-emerald-800/70'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 right-6 bg-[#cbf738] text-[#051811] text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-stone-400 font-bold">{pkg.type}</span>
                      <h4 className="text-xl font-black text-white font-['Outfit']">{pkg.name}</h4>
                    </div>

                    <div className="bg-[#04140d] p-3 rounded-2xl border border-emerald-900/80 space-y-1">
                      <div className="text-xs text-stone-400">Total Investment:</div>
                      <div className="text-xl font-black text-[#cbf738]">{pkg.investmentRange}</div>
                      <div className="text-[11px] text-emerald-300">Space Needed: {pkg.idealSpace} • Est. ROI: {pkg.estimatedRoiMonths}</div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-white">Inclusions:</div>
                      <ul className="text-xs text-stone-300 space-y-1.5">
                        {pkg.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#cbf738] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-900/60">
                    <button
                      onClick={() => {
                        setInquiryForm(prev => ({ ...prev, investmentBudget: pkg.name }));
                        const formElem = document.getElementById('franchise-inquiry-section');
                        formElem?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 bg-emerald-900 hover:bg-[#cbf738] hover:text-[#051811] text-white text-xs font-black rounded-xl transition"
                    >
                      Inquire for this Format
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive ROI Calculator */}
          <div className="bg-gradient-to-br from-[#062417] to-[#03140d] border border-emerald-700/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-black text-white font-['Outfit'] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#cbf738]" />
                  <span>Franchise Profitability & ROI Calculator</span>
                </h3>
                <p className="text-xs text-stone-300">
                  Estimate your monthly cashflow based on daily cup volume and Booost's 68% gross margin.
                </p>
              </div>
              <span className="text-xs bg-[#0b3323] text-[#cbf738] px-3 py-1 rounded-full font-bold border border-emerald-600/40">
                Industry Benchmark: 65-72% Margins
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Sliders */}
              <div className="space-y-5 bg-[#051910] p-5 rounded-2xl border border-emerald-800/80">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-300">Expected Daily Cups Sold:</span>
                    <span className="text-[#cbf738] text-base font-black">{dailyCups} Cups / Day</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="220"
                    step="5"
                    value={dailyCups}
                    onChange={(e) => setDailyCups(Number(e.target.value))}
                    className="w-full accent-[#cbf738] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>30 Cups (Quiet)</span>
                    <span>90 Cups (Avg Mall Kiosk)</span>
                    <span>220 Cups (High Traffic)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-300">Average Cup Size Base:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCupSizePref('16oz')}
                      className={`py-2 text-xs font-bold rounded-xl border ${
                        cupSizePref === '16oz'
                          ? 'bg-[#cbf738] text-[#051811] border-[#cbf738]'
                          : 'bg-[#04150e] text-stone-300 border-emerald-800'
                      }`}
                    >
                      16oz Medium (₱199 avg)
                    </button>
                    <button
                      onClick={() => setCupSizePref('22oz')}
                      className={`py-2 text-xs font-bold rounded-xl border ${
                        cupSizePref === '22oz'
                          ? 'bg-[#cbf738] text-[#051811] border-[#cbf738]'
                          : 'bg-[#04150e] text-stone-300 border-emerald-800'
                      }`}
                    >
                      22oz Large (₱245 avg)
                    </button>
                  </div>
                </div>
              </div>

              {/* Outputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#04150e] p-4 rounded-2xl border border-emerald-800 text-center">
                  <div className="text-[11px] text-stone-400 uppercase font-medium">Monthly Gross Sales</div>
                  <div className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
                    ₱{monthlySales.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1">30 business days</div>
                </div>

                <div className="bg-[#04150e] p-4 rounded-2xl border border-emerald-800 text-center">
                  <div className="text-[11px] text-stone-400 uppercase font-medium">Gross Profit (68%)</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300 font-['Outfit'] mt-1">
                    ₱{(monthlySales * grossMarginPercent).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1">Ingredient COGS removed</div>
                </div>

                <div className="col-span-2 bg-gradient-to-r from-[#0c3924] to-[#062417] p-5 rounded-2xl border-2 border-[#cbf738] text-center shadow-lg">
                  <div className="text-xs text-[#cbf738] uppercase font-black tracking-wider">
                    Estimated Net Monthly Profit (Take-Home)
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] mt-1">
                    ₱{Math.max(0, estimatedNetProfit).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-stone-300 mt-1">
                    After deducting ~₱75,000 estimated rent + utilities + 2 staff salaries.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Franchise Inquiry Form */}
          <div id="franchise-inquiry-section" className="bg-[#061e15] border border-emerald-700/60 p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs uppercase font-black text-[#cbf738] tracking-widest">
                Direct Application
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                Submit Franchise Inquiry
              </h3>
              <p className="text-xs text-stone-300">
                Fill out the application below. Our expansion team will email the official franchise disclosure packet and schedule a discovery call. Official franchise contact: <span className="text-[#cbf738] font-mono">drinkbooost@gmail.com</span>.
              </p>
            </div>

            {formSubmitted ? (
              <div className="bg-gradient-to-b from-[#0a3b25] to-[#051c12] border-2 border-[#cbf738] p-8 rounded-3xl text-center space-y-4 max-w-lg mx-auto animate-in zoom-in-95">
                <div className="w-14 h-14 bg-[#cbf738] text-[#051811] rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-white font-['Outfit']">
                  Inquiry Received!
                </h4>
                <p className="text-xs text-stone-200">
                  Thank you, <span className="font-bold text-[#cbf738]">{inquiryForm.fullName}</span>! Your franchise dossier for <span className="font-bold text-white">{inquiryForm.preferredLocation || 'your requested area'}</span> has been routed to our franchise development team at <span className="font-mono text-[#cbf738]">drinkbooost@gmail.com</span>.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2 bg-emerald-900 text-stone-200 hover:text-white rounded-xl text-xs font-bold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria Santos"
                      value={inquiryForm.fullName}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full bg-[#04140d] border border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#cbf738]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. maria@gmail.com"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-[#04140d] border border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#cbf738]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +63 917 123 4567"
                      value={inquiryForm.contactNumber}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                      className="w-full bg-[#04140d] border border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#cbf738]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Preferred City / Mall *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SM Bacoor, Tagaytay, or BGC"
                      value={inquiryForm.preferredLocation}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, preferredLocation: e.target.value }))}
                      className="w-full bg-[#04140d] border border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#cbf738]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Format / Budget Range</label>
                    <select
                      value={inquiryForm.investmentBudget}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, investmentBudget: e.target.value }))}
                      className="w-full bg-[#04140d] border border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#cbf738]"
                    >
                      <option value="Gym & Fitness Counter (₱290k - ₱350k)">Gym & Fitness Counter (₱290k - ₱350k)</option>
                      <option value="Standard Mall Kiosk (₱420k - ₱490k)">Standard Mall Kiosk (₱420k - ₱490k)</option>
                      <option value="Wellness Lounge & Cafe (₱680k - ₱780k)">Wellness Lounge & Cafe (₱680k - ₱780k)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">F&B Experience</label>
                    <select
                      value={inquiryForm.experienceInFoodBev}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, experienceInFoodBev: e.target.value }))}
                      className="w-full bg-[#04140d] border border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#cbf738]"
                    >
                      <option value="First-time business owner">First-time business owner</option>
                      <option value="Yes, 1-3 years F&B / Gym">Yes, 1-3 years F&B / Gym</option>
                      <option value="Seasoned Multi-Unit Franchisee">Seasoned Multi-Unit Franchisee</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Additional Notes / Proposed Site Details</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your proposed location or why you want to bring Booost to your area..."
                    value={inquiryForm.notes}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-[#04140d] border border-emerald-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cbf738]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#cbf738] hover:bg-[#b2df28] text-[#051811] text-sm font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Franchise Application to drinkbooost@gmail.com</span>
                </button>
              </form>
            )}
          </div>

          {/* Franchise FAQs */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white font-['Outfit']">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FRANCHISE_FAQS.map((faq, i) => (
                <div key={i} className="bg-[#061e15] border border-emerald-800/80 p-5 rounded-2xl space-y-1.5">
                  <h4 className="text-sm font-black text-white font-['Outfit']">{faq.q}</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
