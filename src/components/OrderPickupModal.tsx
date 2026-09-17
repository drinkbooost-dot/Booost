import React, { useState } from 'react';
import { ShoppingBag, X, Check, MapPin, Clock, Plus, Sparkles, QrCode, Smartphone, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MenuItem, CupSize } from '../types';
import { playStampSound, playRewardFanfare } from '../utils/audio';

interface OrderPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: MenuItem | null;
  initialSize?: CupSize;
  initialIsProtein?: boolean;
  selectedBranch: string;
  onOrderSuccess: (orderItemName: string) => void;
}

export const OrderPickupModal: React.FC<OrderPickupModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  initialSize = '16oz',
  initialIsProtein = true,
  selectedBranch,
  onOrderSuccess,
}) => {
  const [size, setSize] = useState<CupSize>(initialSize);
  const [isProtein, setIsProtein] = useState<boolean>(initialIsProtein);
  const [proteinType, setProteinType] = useState<'whey' | 'plant'>('whey');
  const [sweetness, setSweetness] = useState<string>('Standard 100%');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'maya' | 'cash' | 'card'>('gcash');
  const [gcashPhone, setGcashPhone] = useState<string>('0917-555-1289');
  const [showGcashQR, setShowGcashQR] = useState<boolean>(false);
  const [orderTicket, setOrderTicket] = useState<any | null>(null);

  if (!isOpen || !selectedItem) return null;

  // Calculate price
  let basePrice = size === '16oz' 
    ? (isProtein ? selectedItem.price16ozProtein : (selectedItem.price16ozNonProtein || 180))
    : (isProtein ? selectedItem.price22ozProtein : (selectedItem.price22ozNonProtein || 220));

  let addOnPrice = 0;
  if (addOns.includes('extra-protein')) addOnPrice += 35;
  if (addOns.includes('chia')) addOnPrice += 20;
  if (addOns.includes('espresso')) addOnPrice += 30;

  const totalPrice = basePrice + addOnPrice;

  const toggleAddon = (id: string) => {
    setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleConfirmOrder = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#cbf738', '#10b981', '#fbbf24']
    });
    playRewardFanfare();

    const ticketNumber = Math.floor(100 + Math.random() * 900);
    const gcashRef = paymentMethod === 'gcash' ? `GC-${Math.floor(100000 + Math.random() * 900000)}` : null;

    setOrderTicket({
      ticketNumber: `#B-${ticketNumber}`,
      itemName: selectedItem.name,
      size,
      branch: selectedBranch,
      price: totalPrice,
      paymentMethod,
      gcashRef,
      estimatedMinutes: '10 - 15 Mins',
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    onOrderSuccess(selectedItem.name);
  };

  const handleCloseAll = () => {
    setOrderTicket(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#072418] border-2 border-emerald-600 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {orderTicket ? (
          /* ORDER CONFIRMATION TICKET */
          <div className="text-center space-y-5 py-2 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#cbf738] text-[#051811] flex items-center justify-center mx-auto shadow-lg shadow-[#cbf738]/30">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-black tracking-widest text-[#cbf738]">
                Order Confirmed!
              </span>
              <h3 className="text-3xl font-black text-white font-['Outfit']">
                {orderTicket.ticketNumber}
              </h3>
              <p className="text-xs text-stone-300">
                Your shake is being blended fresh at <span className="text-[#cbf738] font-bold">{orderTicket.branch}</span>!
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-[#04150e] border-2 border-dashed border-emerald-700/80 p-5 rounded-2xl space-y-3 text-left">
              <div className="flex justify-between items-start border-b border-emerald-900 pb-2">
                <div>
                  <div className="font-bold text-white text-base">{orderTicket.itemName}</div>
                  <div className="text-xs text-stone-400">{orderTicket.size} • {isProtein ? (proteinType === 'whey' ? 'Whey Isolate' : 'Plant Protein') : 'Non-Protein'}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-[#cbf738]">₱{orderTicket.price}</div>
                  <span className="text-[10px] text-emerald-400 font-semibold block">
                    {orderTicket.paymentMethod === 'gcash' ? 'Paid via GCash' : orderTicket.paymentMethod === 'maya' ? 'Paid via Maya' : 'Cash on Counter'}
                  </span>
                </div>
              </div>

              {orderTicket.gcashRef && (
                <div className="bg-[#0052cc]/20 border border-[#0070ba]/40 p-2 rounded-xl flex items-center justify-between text-xs text-blue-200">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    GCash Reference:
                  </span>
                  <span className="font-mono font-black text-white">{orderTicket.gcashRef}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs text-stone-300">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase">Estimated Prep</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#cbf738]" />
                    {orderTicket.estimatedMinutes}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase">Pickup Station</span>
                  <span className="font-bold text-white">{orderTicket.branch}</span>
                </div>
              </div>

              <div className="bg-[#0b2b1d] p-2.5 rounded-xl border border-emerald-700/60 text-xs text-[#cbf738] font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>+1 Stamp has been automatically credited to your Booost Pass!</span>
              </div>
            </div>

            <button
              onClick={handleCloseAll}
              className="w-full py-3 bg-[#cbf738] hover:bg-[#b2df28] text-[#051811] text-xs font-black rounded-xl shadow-lg transition"
            >
              Done & View Loyalty Pass
            </button>
          </div>
        ) : (
          /* ORDER CUSTOMIZATION FORM */
          <>
            <div className="flex items-start justify-between border-b border-emerald-900 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#cbf738] tracking-wider">
                  Pickup Order • {selectedBranch}
                </span>
                <h3 className="text-2xl font-black text-white font-['Outfit']">
                  {selectedItem.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sizing & Protein toggle */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1.5">Select Cup Size</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSize('16oz')}
                    className={`p-3 rounded-2xl border text-left transition ${
                      size === '16oz'
                        ? 'bg-[#0d3b27] border-2 border-[#cbf738] text-white'
                        : 'bg-[#04150e] border-emerald-900 text-stone-400'
                    }`}
                  >
                    <div className="text-xs font-bold">16oz Medium</div>
                    <div className="text-sm font-black text-[#cbf738] mt-0.5">
                      ₱{isProtein ? selectedItem.price16ozProtein : (selectedItem.price16ozNonProtein || 180)}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSize('22oz')}
                    className={`p-3 rounded-2xl border text-left transition ${
                      size === '22oz'
                        ? 'bg-[#0d3b27] border-2 border-[#cbf738] text-white'
                        : 'bg-[#04150e] border-emerald-900 text-stone-400'
                    }`}
                  >
                    <div className="text-xs font-bold">22oz Large (Extra Fuel)</div>
                    <div className="text-sm font-black text-[#cbf738] mt-0.5">
                      ₱{isProtein ? selectedItem.price22ozProtein : (selectedItem.price22ozNonProtein || 220)}
                    </div>
                  </button>
                </div>
              </div>

              {/* Protein Formulation */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1.5">Protein Option</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => { setIsProtein(true); setProteinType('whey'); }}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      isProtein && proteinType === 'whey'
                        ? 'bg-[#0d3b27] border-[#cbf738] text-white'
                        : 'bg-[#04150e] border-emerald-900 text-stone-400'
                    }`}
                  >
                    Whey Isolate
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsProtein(true); setProteinType('plant'); }}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      isProtein && proteinType === 'plant'
                        ? 'bg-[#0d3b27] border-[#cbf738] text-white'
                        : 'bg-[#04150e] border-emerald-900 text-stone-400'
                    }`}
                  >
                    Plant-Based
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsProtein(false)}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      !isProtein
                        ? 'bg-[#0d3b27] border-[#cbf738] text-white'
                        : 'bg-[#04150e] border-emerald-900 text-stone-400'
                    }`}
                  >
                    {selectedItem.category === 'Kid Friendly' 
                      ? 'Non-Protein' 
                      : `Non-Protein (₱${size === '16oz' ? (selectedItem.price16ozNonProtein || 180) : (selectedItem.price22ozNonProtein || 220)})`}
                  </button>
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1.5">Superfood Add-Ons</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleAddon('extra-protein')}
                    className={`p-2 rounded-xl border text-center transition ${
                      addOns.includes('extra-protein')
                        ? 'bg-[#0d3b27] border-[#cbf738] text-[#cbf738] font-bold'
                        : 'bg-[#04150e] border-emerald-900 text-stone-400'
                    }`}
                  >
                    +Extra Scoop (+₱35)
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAddon('chia')}
                    className={`p-2 rounded-xl border text-center transition ${
                      addOns.includes('chia')
                        ? 'bg-[#0d3b27] border-[#cbf738] text-[#cbf738] font-bold'
                        : 'bg-[#04150e] border-emerald-900 text-stone-400'
                    }`}
                  >
                    +Chia Seeds (+₱20)
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAddon('espresso')}
                    className={`p-2 rounded-xl border text-center transition ${
                      addOns.includes('espresso')
                        ? 'bg-[#0d3b27] border-[#cbf738] text-[#cbf738] font-bold'
                        : 'bg-[#04150e] border-emerald-900 text-stone-400'
                    }`}
                  >
                    +Espresso (+₱30)
                  </button>
                </div>
              </div>

              {/* Sweetness */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1.5">Sweetness Preference</label>
                <select
                  value={sweetness}
                  onChange={(e) => setSweetness(e.target.value)}
                  className="w-full bg-[#04150e] border border-emerald-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cbf738]"
                >
                  <option value="Standard 100%">Standard 100% (Natural Whole Fruit & Pure Honey)</option>
                  <option value="Less Sweet 50%">Less Sweet 50%</option>
                  <option value="Zero Added Sugar">Zero Added Sugar / Honey</option>
                </select>
              </div>

              {/* Payment Method Selection (GCash Integrated) */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2 text-xs mb-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gcash')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'gcash'
                        ? 'bg-[#005ce6]/20 border-2 border-[#0070ba] text-white shadow-xs'
                        : 'bg-[#04150e] border-emerald-900 text-stone-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#00a3ff]" />
                    <span className="text-xs font-black text-white">GCash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('maya')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'maya'
                        ? 'bg-emerald-900/50 border-2 border-[#84cc16] text-white'
                        : 'bg-[#04150e] border-emerald-900 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-black text-[#84cc16]">M</span>
                    <span>Maya</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-900/50 border-2 border-[#cbf738] text-white'
                        : 'bg-[#04150e] border-emerald-900 text-stone-400 hover:text-white'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#cbf738]" />
                    <span>Counter Cash</span>
                  </button>
                </div>

                {/* GCash Specific Details & QR option */}
                {paymentMethod === 'gcash' && (
                  <div className="bg-[#002b66]/40 border border-[#0070ba]/60 rounded-2xl p-3.5 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#0070ba] flex items-center justify-center font-black text-white text-xs">
                          G
                        </div>
                        <div>
                          <div className="text-xs font-black text-white">GCash Express Checkout</div>
                          <div className="text-[10px] text-blue-200">Official Merchant: BOOOST PH (SM Kiosks)</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowGcashQR(!showGcashQR)}
                        className="px-2.5 py-1 bg-[#0070ba]/40 hover:bg-[#0070ba]/70 text-blue-200 border border-[#00a3ff]/40 rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <QrCode className="w-3 h-3 text-[#00a3ff]" />
                        <span>{showGcashQR ? 'Hide QR' : 'Show QR Ph'}</span>
                      </button>
                    </div>

                    {showGcashQR ? (
                      <div className="bg-white p-3 rounded-xl text-center text-stone-900 space-y-1.5 animate-in zoom-in-95">
                        <div className="text-[11px] font-black text-[#005ce6] font-['Outfit']">
                          SCAN TO PAY VIA GCASH / QR PH
                        </div>
                        <div className="bg-stone-50 p-2 rounded-lg border border-stone-200 inline-block">
                          <svg className="w-28 h-28 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                            <rect x="5" y="5" width="26" height="26" fill="#005ce6" rx="2" />
                            <rect x="9" y="9" width="18" height="18" fill="#fff" rx="1" />
                            <rect x="13" y="13" width="10" height="10" fill="#005ce6" />
                            <rect x="69" y="5" width="26" height="26" fill="#005ce6" rx="2" />
                            <rect x="73" y="9" width="18" height="18" fill="#fff" rx="1" />
                            <rect x="77" y="13" width="10" height="10" fill="#005ce6" />
                            <rect x="5" y="69" width="26" height="26" fill="#005ce6" rx="2" />
                            <rect x="9" y="73" width="18" height="18" fill="#fff" rx="1" />
                            <rect x="13" y="77" width="10" height="10" fill="#005ce6" />
                            <rect x="36" y="8" width="8" height="8" fill="#005ce6" />
                            <rect x="48" y="8" width="6" height="6" fill="#005ce6" />
                            <rect x="36" y="22" width="14" height="6" fill="#005ce6" />
                            <rect x="54" y="20" width="8" height="8" fill="#005ce6" />
                            <rect x="38" y="38" width="24" height="24" fill="#005ce6" rx="3" />
                            <circle cx="50" cy="50" r="4" fill="#fff" />
                            <rect x="10" y="38" width="14" height="8" fill="#005ce6" />
                            <rect x="10" y="50" width="8" height="14" fill="#005ce6" />
                            <rect x="70" y="38" width="8" height="14" fill="#005ce6" />
                            <rect x="82" y="42" width="10" height="8" fill="#005ce6" />
                            <rect x="36" y="72" width="14" height="8" fill="#005ce6" />
                            <rect x="56" y="72" width="10" height="14" fill="#005ce6" />
                            <rect x="72" y="72" width="20" height="8" fill="#005ce6" />
                            <rect x="72" y="84" width="12" height="8" fill="#005ce6" />
                          </svg>
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium">
                          Amount to send: <span className="font-bold text-stone-900">₱{totalPrice}.00</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-[10px] text-blue-200 block mb-1">GCash Mobile Number</label>
                        <input
                          type="text"
                          value={gcashPhone}
                          onChange={(e) => setGcashPhone(e.target.value)}
                          placeholder="09XX-XXX-XXXX"
                          className="w-full bg-[#03152b] border border-[#0070ba]/60 rounded-xl px-3 py-1.5 text-xs text-white font-mono placeholder-stone-400 focus:outline-none focus:border-[#00a3ff]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Total & Submit Button */}
            <div className="pt-3 border-t border-emerald-900/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Total Amount</span>
                <span className="text-2xl font-black text-white font-['Outfit']">₱{totalPrice}</span>
              </div>

              <button
                type="button"
                onClick={handleConfirmOrder}
                className="px-6 py-2.5 bg-[#cbf738] hover:bg-[#b2df28] text-[#051811] text-xs font-black rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <span>Place Order Pickup</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
