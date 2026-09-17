import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Phone, 
  User, 
  MapPin, 
  ShieldCheck,
  ChevronRight,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CustomerProfile, LoyaltyStamp } from '../types';

interface RegisterMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerProfile;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerProfile>>;
  setStampsHistory?: React.Dispatch<React.SetStateAction<LoyaltyStamp[]>>;
  selectedBranch: string;
}

export interface WelcomeReplyNotice {
  type: 'email' | 'sms';
  recipient: string;
  sender: string;
  timestamp: string;
  subject?: string;
  message: string;
}

export const RegisterMemberModal: React.FC<RegisterMemberModalProps> = ({
  isOpen,
  onClose,
  customer,
  setCustomer,
  setStampsHistory,
  selectedBranch,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    favoriteBranch: selectedBranch || 'SM City Dasmariñas',
    fitnessGoal: 'Muscle Gain' as CustomerProfile['fitnessGoal'],
  });

  const [activeTab, setActiveTab] = useState<'register' | 'replies'>('register');
  const [submittedReplies, setSubmittedReplies] = useState<WelcomeReplyNotice[] | null>(null);
  const [activeReplyView, setActiveReplyView] = useState<'all' | 'email' | 'sms'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();

    if (!trimmedName) {
      setValidationError('Please enter your full name');
      return;
    }

    if (!trimmedEmail && !trimmedPhone) {
      setValidationError('Please provide at least an email address or mobile phone number to receive your automatic Booost reply!');
      return;
    }

    setIsSubmitting(true);

    // Generate fresh VIP member code
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newMemberId = `BOOOST-${randomDigits}-VIP`;
    const nowTimestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    // Build the automatic replies requested by user:
    // "enjoy your Booost we are glad you are part of our healthy community"
    const replies: WelcomeReplyNotice[] = [];

    if (trimmedEmail) {
      replies.push({
        type: 'email',
        recipient: trimmedEmail,
        sender: 'membership@drinkbooost.com (Booost VIP Team)',
        timestamp: `Sent at ${nowTimestamp} • Just now`,
        subject: 'Welcome to Booost! Enjoy your Booost & Your Digital Stamp Pass 🥤',
        message: `Enjoy your Booost we are glad you are part of our healthy community! Your digital loyalty card is officially activated with 0 stamps. Present your digital QR code at ${formData.favoriteBranch} on every shake purchase to collect 10 stamps and earn your 1st FREE 16oz shake!`,
      });
    }

    if (trimmedPhone) {
      replies.push({
        type: 'sms',
        recipient: trimmedPhone,
        sender: 'BOOOST-SMS (SM Cavite)',
        timestamp: `Delivered at ${nowTimestamp}`,
        message: `Enjoy your Booost we are glad you are part of our healthy community! Your member ID is ${newMemberId}. Start fresh with 0 stamps and earn 1 FREE 16oz shake after 10 drinks!`,
      });
    }

    // Set customer state:
    // When the customer registers on the app loyalty digital app there's NO digital stamp yet (stampsCount: 0, totalStampsCollected: 0)
    const newProfile: CustomerProfile = {
      name: trimmedName,
      memberId: newMemberId,
      email: trimmedEmail || 'guest@drinkbooost.com',
      phone: trimmedPhone || '+63 900 000 0000',
      tier: 'Silver Booster', // Fresh registration starts at entry tier
      totalStampsCollected: 0, // No stamps yet
      stampsCount: 0, // No digital stamp yet (0/10)
      freeDrinksAvailable: 0,
      favoriteBranch: formData.favoriteBranch,
      joinedDate: 'Joined Today',
      fitnessGoal: formData.fitnessGoal,
    };

    // Update global state
    setCustomer(newProfile);

    // Reset stamp purchase history if customer is a new registration
    if (setStampsHistory) {
      setStampsHistory([]);
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#84cc16', '#10b981', '#065f46', '#ffffff'],
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedReplies(replies);
      setActiveTab('replies');
    }, 400);
  };

  const handleDoneAndClose = () => {
    onClose();
    // reset local modal form state after animation
    setTimeout(() => {
      setSubmittedReplies(null);
      setActiveTab('register');
      setFormData({
        name: '',
        email: '',
        phone: '',
        favoriteBranch: selectedBranch || 'SM City Dasmariñas',
        fitnessGoal: 'Muscle Gain',
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="register-member-modal-container"
        className="bg-white border-2 border-emerald-600/60 rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto"
      >
        {/* Modal Close Button */}
        <button
          id="close-register-modal-btn"
          onClick={handleDoneAndClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 border-b border-stone-200 pb-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0e4a30] to-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
            🥤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#0e4a30] bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                VIP Digital Loyalty Pass
              </span>
              <span className="text-[10px] text-stone-500 font-bold">SM Cavite</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
              {activeTab === 'register' ? 'Register on Booost Loyalty' : 'Welcome to the Community! 🎉'}
            </h3>
            <p className="text-xs text-stone-600">
              {activeTab === 'register' 
                ? 'Create your customer pass. Starts with 0 digital stamps and triggers your instant automatic welcome reply.'
                : 'Your membership is activated with 0 stamps. Automatic replies dispatched below.'}
            </p>
          </div>
        </div>

        {/* Registration Form View */}
        {activeTab === 'register' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Stamp Status Guarantee Badge */}
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900 font-bold block">Brand New Member Activation (0 Digital Stamps):</strong>
                <span>Once registered, your loyalty card begins cleanly with <strong>0 of 10 stamps</strong>. Collect 1 stamp per shake at SM Dasmariñas or SM Trece!</span>
              </div>
            </div>

            {validationError && (
              <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                <X className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Input: Full Name */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Full Name <span className="text-rose-500">*</span></span>
              </label>
              <input
                id="register-customer-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Maria Santos"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              />
            </div>

            {/* Input: Email (Automatic reply will trigger here) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Customer Email Address</span>
                </label>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Instant Automatic Reply
                </span>
              </div>
              <input
                id="register-customer-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="maria.santos@gmail.com"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Triggers automatic email reply: <em>"Enjoy your Booost we are glad you are part of our healthy community"</em>
              </p>
            </div>

            {/* Input: Mobile Phone (Automatic SMS reply will trigger here) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Mobile Phone Number</span>
                </label>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Instant Automatic Text
                </span>
              </div>
              <input
                id="register-customer-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+63 917 123 4567 or 09171234567"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Triggers automatic text SMS: <em>"Enjoy your Booost we are glad you are part of our healthy community"</em>
              </p>
            </div>

            {/* Two-column: Branch & Fitness Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Preferred Kiosk Branch</span>
                </label>
                <select
                  id="register-customer-branch"
                  value={formData.favoriteBranch}
                  onChange={(e) => setFormData(prev => ({ ...prev, favoriteBranch: e.target.value }))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                >
                  <option value="SM City Dasmariñas">SM City Dasmariñas (Cavite)</option>
                  <option value="SM City Trece">SM City Trece (Cavite)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Fitness Focus</span>
                </label>
                <select
                  id="register-customer-goal"
                  value={formData.fitnessGoal}
                  onChange={(e) => setFormData(prev => ({ ...prev, fitnessGoal: e.target.value as CustomerProfile['fitnessGoal'] }))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                >
                  <option value="Muscle Gain">Muscle Gain (High Protein)</option>
                  <option value="Fat Loss">Fat Loss & Toning</option>
                  <option value="Daily Energy & Vitality">Daily Energy & Vitality</option>
                  <option value="Athletic Endurance">Athletic Endurance</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-3 border-t border-stone-200">
              <button
                type="button"
                id="cancel-register-btn"
                onClick={handleDoneAndClose}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl border border-stone-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-register-btn"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-[#0e4a30] hover:bg-[#12593a] text-white text-xs font-black rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Loyalty Pass...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#84cc16]" />
                    <span>Register & Send Automatic Reply</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Success & Automatic Reply Notification View */}
        {activeTab === 'replies' && submittedReplies && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Success Summary Header */}
            <div className="bg-gradient-to-br from-[#082f1e] via-[#0e4a30] to-[#062618] text-white p-4 rounded-2xl shadow-md border border-emerald-600/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#84cc16] text-[#051811] flex items-center justify-center font-black text-xl shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                    Registration Complete
                  </div>
                  <div className="text-sm font-black text-white">
                    {customer.name} • {customer.memberId}
                  </div>
                  <div className="text-xs text-[#84cc16] font-semibold">
                    Current Stamp Balance: 0 / 10 (No digital stamps yet)
                  </div>
                </div>
              </div>
              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full border border-white/20 text-emerald-200 shrink-0 font-medium">
                Silver Booster
              </span>
            </div>

            {/* Filter filter buttons if both email & phone were entered */}
            {submittedReplies.length > 1 && (
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveReplyView('all')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                    activeReplyView === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  All Automatic Replies ({submittedReplies.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReplyView('email')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                    activeReplyView === 'email' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Email Reply</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReplyView('sms')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                    activeReplyView === 'sms' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>SMS Text Reply</span>
                </button>
              </div>
            )}

            {/* Replies Display Cards */}
            <div className="space-y-3">
              {submittedReplies
                .filter(r => activeReplyView === 'all' || r.type === activeReplyView)
                .map((reply, index) => (
                  <div 
                    key={index}
                    className={`rounded-2xl border p-4 space-y-2.5 transition-all shadow-xs ${
                      reply.type === 'email' 
                        ? 'bg-emerald-50/70 border-emerald-300' 
                        : 'bg-stone-50 border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-stone-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        {reply.type === 'email' ? (
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                            <Mail className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-[#0e4a30] text-[#84cc16] flex items-center justify-center">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-black text-stone-900">
                            {reply.type === 'email' ? 'Automatic Reply on Email' : 'Automatic Reply on Text / SMS'}
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono">
                            To: {reply.recipient}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Sent by Booost</span>
                      </span>
                    </div>

                    {reply.subject && (
                      <div className="text-xs font-bold text-stone-800">
                        Subject: <span className="text-stone-900">{reply.subject}</span>
                      </div>
                    )}

                    {/* The Required Exact Message from User */}
                    <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-inner">
                      <div className="text-xs font-semibold text-emerald-900 leading-relaxed">
                        "{reply.message}"
                      </div>
                    </div>

                    <div className="text-[10px] text-stone-500 flex items-center justify-between">
                      <span>{reply.sender}</span>
                      <span>{reply.timestamp}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Completion Button */}
            <div className="pt-2">
              <button
                type="button"
                id="view-my-loyalty-pass-btn"
                onClick={handleDoneAndClose}
                className="w-full py-3 bg-[#0e4a30] hover:bg-[#12593a] text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open My 0-Stamp Digital Loyalty Pass</span>
                <ChevronRight className="w-4 h-4 text-[#84cc16]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
