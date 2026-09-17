import React, { useState } from 'react';
import { User, Award, Shield, Phone, Mail, MapPin, Target, Sparkles, X, RotateCcw } from 'lucide-react';
import { CustomerProfile } from '../types';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerProfile;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerProfile>>;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  customer,
  setCustomer,
}) => {
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    fitnessGoal: customer.fitnessGoal,
    favoriteBranch: customer.favoriteBranch,
  });

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomer(prev => ({
      ...prev,
      ...formData,
    }));
    onClose();
  };

  const setTestStamps = (count: number) => {
    setCustomer(prev => ({
      ...prev,
      stampsCount: count,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0e4a30] to-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-xs">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-stone-900 font-['Outfit']">
                {customer.name}
              </h3>
              <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{customer.tier} • Member ID: {customer.memberId}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Stats Snapshot */}
        <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center text-xs">
          <div>
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Card Stamps</div>
            <div className="text-lg font-black text-emerald-800">{customer.stampsCount}/10</div>
          </div>
          <div>
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Lifetime Shakes</div>
            <div className="text-lg font-black text-stone-900">{customer.totalStampsCollected}</div>
          </div>
          <div>
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Free Vouchers</div>
            <div className="text-lg font-black text-amber-600">{customer.freeDrinksAvailable}</div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Customer Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Mobile Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Primary Fitness Goal</label>
              <select
                value={formData.fitnessGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, fitnessGoal: e.target.value as any }))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Muscle Gain">Muscle Gain & Strength</option>
                <option value="Fat Loss">Fat Loss & Shred</option>
                <option value="Daily Energy & Vitality">Daily Energy & Vitality</option>
                <option value="Athletic Endurance">Athletic Endurance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Home Branch</label>
              <select
                value={formData.favoriteBranch}
                onChange={(e) => setFormData(prev => ({ ...prev, favoriteBranch: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="SM City Dasmariñas">SM City Dasmariñas (Cavite)</option>
                <option value="SM City Trece">SM City Trece (Cavite)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl border border-stone-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#0e4a30] hover:bg-[#12593a] text-white text-xs font-black rounded-xl transition shadow-xs"
            >
              Save Profile
            </button>
          </div>
        </form>

        {/* Demo / Sandbox Controls */}
        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 space-y-2">
          <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tester Quick Tools</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setTestStamps(9)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold rounded-lg shadow-xs"
            >
              Set Stamps to 9/10 (Ready for Free Drink)
            </button>
            <button
              onClick={() => setTestStamps(0)}
              className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-semibold rounded-lg shadow-xs"
            >
              Reset to 0/10
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
