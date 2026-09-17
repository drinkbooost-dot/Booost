import React, { useState } from 'react';
import { 
  Droplets, 
  Dumbbell, 
  Moon, 
  Sun, 
  Sparkles, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  Heart, 
  ShieldCheck, 
  Flame, 
  Apple,
  Award,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyHabitLog, CustomerProfile } from '../types';
import { playStampSound, playRewardFanfare } from '../utils/audio';

interface HealthHabitsViewProps {
  habitLog: DailyHabitLog;
  setHabitLog: React.Dispatch<React.SetStateAction<DailyHabitLog>>;
  customer: CustomerProfile;
  onOrderShakeTab: () => void;
}

export const HealthHabitsView: React.FC<HealthHabitsViewProps> = ({
  habitLog,
  setHabitLog,
  customer,
  onOrderShakeTab,
}) => {
  const [streakDays] = useState<number>(5);
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);

  // Water increment/decrement
  const handleAddWater = () => {
    playStampSound();
    setHabitLog((prev) => ({
      ...prev,
      waterGlasses: Math.min(prev.waterGlasses + 1, 12),
    }));
  };

  const handleMinusWater = () => {
    setHabitLog((prev) => ({
      ...prev,
      waterGlasses: Math.max(prev.waterGlasses - 1, 0),
    }));
  };

  // Protein increment by shake (+28g)
  const handleAddShakeProtein = () => {
    playStampSound();
    setHabitLog((prev) => ({
      ...prev,
      drankBooostShake: true,
      loggedShakeName: 'Booost Protein Shake',
      proteinCurrentGrams: prev.proteinCurrentGrams + 28,
    }));
    if (habitLog.proteinCurrentGrams + 28 >= habitLog.targetProteinGrams) {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    }
  };

  // Toggle habit checkbox
  const toggleHabit = (key: keyof DailyHabitLog) => {
    playStampSound();
    setHabitLog((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const waterPercent = Math.min(100, Math.round((habitLog.waterGlasses / habitLog.targetWaterGlasses) * 100));
  const proteinPercent = Math.min(100, Math.round((habitLog.proteinCurrentGrams / habitLog.targetProteinGrams) * 100));

  // Count habits completed
  const checklistItems = [
    { key: 'waterGlasses', done: habitLog.waterGlasses >= habitLog.targetWaterGlasses, label: 'Hit 8 Glasses Water (2,000ml)', icon: '💧' },
    { key: 'drankBooostShake', done: habitLog.drankBooostShake, label: 'Enjoy 1 Booost Protein / Antioxidant Shake', icon: '🥤' },
    { key: 'completedWorkout', done: habitLog.completedWorkout, label: 'Completed 20+ Mins Exercise / Movement', icon: '🏋️' },
    { key: 'sunlightMorning', done: habitLog.sunlightMorning, label: '10 Mins Morning Sun & Fresh Air', icon: '☀️' },
    { key: 'mindfulnessDone', done: habitLog.mindfulnessDone, label: '5 Mins Deep Breathing / Stretch', icon: '🧘' },
  ];

  const completedCount = checklistItems.filter(i => i.done).length;
  const wellnessScore = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#072c1c] via-[#093522] to-[#051a11] border-2 border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cbf738]/20 border border-[#cbf738]/30 text-[#cbf738] text-xs font-black uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5" />
              Daily Vitality & Nutrition
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
              Health Habits & Fueling Tracker
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl">
              Consistent daily habits compound into extraordinary health. Track hydration, hit your protein target with Booost, and keep your wellness streak alive.
            </p>
          </div>

          {/* Daily Wellness Score Dial */}
          <div className="flex items-center gap-4 bg-[#051910] border border-emerald-700/80 p-4 rounded-3xl shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#082b1c"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#cbf738"
                  strokeWidth="5"
                  strokeDasharray={163}
                  strokeDashoffset={163 - (163 * wellnessScore) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-['Outfit'] font-black text-white text-base">
                {wellnessScore}%
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-stone-400 uppercase">Daily Score</div>
              <div className="text-base font-black text-white">
                {completedCount} of 5 Completed
              </div>
              <div className="text-[11px] text-[#cbf738] font-semibold mt-0.5">
                🔥 {streakDays}-Day Healthy Streak
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Hydration & Protein Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WATER TRACKER */}
        <div className="bg-[#061e15] border border-emerald-800/80 rounded-3xl p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-['Outfit']">Hydration Station</h3>
                <div className="text-xs text-stone-400">Target: 2,000ml (8 Glasses)</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-400 font-mono">
                {habitLog.waterGlasses * 250}
              </span>
              <span className="text-xs text-stone-400"> / 2,000 ml</span>
            </div>
          </div>

          {/* Water Progress Gauge */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-300">{habitLog.waterGlasses} of {habitLog.targetWaterGlasses} Glasses</span>
              <span className="text-blue-400">{waterPercent}% Hydrated</span>
            </div>
            <div className="w-full bg-[#04150e] h-3.5 rounded-full overflow-hidden border border-emerald-900">
              <div 
                className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          {/* Visual Glasses Icons */}
          <div className="grid grid-cols-8 gap-2 py-1">
            {Array.from({ length: 8 }).map((_, i) => {
              const filled = i < habitLog.waterGlasses;
              return (
                <button
                  key={i}
                  onClick={() => {
                    playStampSound();
                    setHabitLog(prev => ({ ...prev, waterGlasses: i + 1 }));
                  }}
                  title={`Set to ${i + 1} glasses`}
                  className={`aspect-[3/4] rounded-xl border flex flex-col items-center justify-end p-1 transition ${
                    filled
                      ? 'bg-blue-600/30 border-blue-400 text-blue-300 scale-105 shadow-sm shadow-blue-500/20'
                      : 'bg-[#04150e] border-emerald-900/60 text-stone-600 hover:border-emerald-700'
                  }`}
                >
                  <span className="text-xs">💧</span>
                  <span className="text-[9px] font-mono mt-0.5">{i + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60">
            <button
              onClick={handleMinusWater}
              disabled={habitLog.waterGlasses === 0}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#04160f] hover:bg-emerald-950 text-stone-300 text-xs font-bold rounded-xl border border-emerald-900 disabled:opacity-40 transition"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>-250ml</span>
            </button>

            <button
              onClick={handleAddWater}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-500 hover:bg-blue-400 text-stone-950 text-xs font-black rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Drink 1 Glass (+250ml)</span>
            </button>
          </div>
        </div>

        {/* PROTEIN GOAL TRACKER */}
        <div className="bg-[#061e15] border border-emerald-800/80 rounded-3xl p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#cbf738]/20 text-[#cbf738] flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-['Outfit']">Daily Protein Goal</h3>
                <div className="text-xs text-stone-400">Target for {customer.fitnessGoal}: {habitLog.targetProteinGrams}g</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#cbf738] font-mono">
                {habitLog.proteinCurrentGrams}g
              </span>
              <span className="text-xs text-stone-400"> / {habitLog.targetProteinGrams}g</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-300">
                {habitLog.targetProteinGrams - habitLog.proteinCurrentGrams > 0 
                  ? `${habitLog.targetProteinGrams - habitLog.proteinCurrentGrams}g needed to hit target` 
                  : 'Goal Achieved! 🎉'}
              </span>
              <span className="text-[#cbf738]">{proteinPercent}%</span>
            </div>
            <div className="w-full bg-[#04150e] h-3.5 rounded-full overflow-hidden border border-emerald-900">
              <div 
                className="bg-gradient-to-r from-emerald-500 via-[#9ae600] to-[#cbf738] h-full rounded-full transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Booost Shake Fast Log Button */}
          <div className="bg-[#04150e] border border-emerald-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>🥤 1 Booost Shake = +28g Protein</span>
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Ultra-pure whey isolate or plant-based protein blend.
              </div>
            </div>

            <button
              onClick={handleAddShakeProtein}
              className="px-4 py-2 bg-[#cbf738] hover:bg-[#b2df28] text-[#051811] text-xs font-black rounded-xl shadow-md transition shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log Booost Shake (+28g)</span>
            </button>
          </div>

          {/* Reset / Adjust goal */}
          <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60 text-xs text-stone-400">
            <span>Current Status: {habitLog.drankBooostShake ? 'Shake logged today! ✨' : 'No shake logged yet'}</span>
            <button
              onClick={() => setHabitLog(prev => ({ ...prev, proteinCurrentGrams: 0, drankBooostShake: false }))}
              className="text-stone-400 hover:text-white"
            >
              Reset Protein
            </button>
          </div>
        </div>
      </div>

      {/* Daily Habits Checklist & Weekly Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checklist */}
        <div className="lg:col-span-2 bg-[#061e15] border border-emerald-800/80 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-900/80 pb-3">
            <div>
              <h3 className="text-xl font-black text-white font-['Outfit']">
                Today's Booost Habit Checklist
              </h3>
              <p className="text-xs text-stone-400">Check off your daily pillars of high energy and vitality</p>
            </div>
            <span className="text-xs font-bold text-[#cbf738] bg-[#04150e] px-3 py-1 rounded-xl border border-emerald-800">
              {completedCount} / 5 Done
            </span>
          </div>

          <div className="space-y-3">
            {/* 1. Water */}
            <div 
              onClick={handleAddWater}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                habitLog.waterGlasses >= habitLog.targetWaterGlasses
                  ? 'bg-[#08291b] border-emerald-600 text-white'
                  : 'bg-[#04140d] border-emerald-900/80 text-stone-300 hover:bg-[#072418]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">💧</span>
                <div>
                  <div className="text-xs font-bold">Drink 8 Glasses of Water</div>
                  <div className="text-[11px] text-stone-400">Current: {habitLog.waterGlasses}/8 glasses logged</div>
                </div>
              </div>
              {habitLog.waterGlasses >= habitLog.targetWaterGlasses ? (
                <CheckCircle2 className="w-5 h-5 text-[#cbf738]" />
              ) : (
                <Circle className="w-5 h-5 text-stone-600" />
              )}
            </div>

            {/* 2. Shake */}
            <div 
              onClick={handleAddShakeProtein}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                habitLog.drankBooostShake
                  ? 'bg-[#08291b] border-emerald-600 text-white'
                  : 'bg-[#04140d] border-emerald-900/80 text-stone-300 hover:bg-[#072418]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🥤</span>
                <div>
                  <div className="text-xs font-bold">Enjoy 1 Booost Protein or Antioxidant Shake</div>
                  <div className="text-[11px] text-stone-400">
                    {habitLog.drankBooostShake ? 'Completed! 28g clean protein absorbed.' : 'Tap to log your shake today'}
                  </div>
                </div>
              </div>
              {habitLog.drankBooostShake ? (
                <CheckCircle2 className="w-5 h-5 text-[#cbf738]" />
              ) : (
                <Circle className="w-5 h-5 text-stone-600" />
              )}
            </div>

            {/* 3. Workout */}
            <div 
              onClick={() => toggleHabit('completedWorkout')}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                habitLog.completedWorkout
                  ? 'bg-[#08291b] border-emerald-600 text-white'
                  : 'bg-[#04140d] border-emerald-900/80 text-stone-300 hover:bg-[#072418]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🏋️</span>
                <div>
                  <div className="text-xs font-bold">20+ Mins Exercise / Strength Movement</div>
                  <div className="text-[11px] text-stone-400">Check off after your gym, HIIT, or mobility session</div>
                </div>
              </div>
              {habitLog.completedWorkout ? (
                <CheckCircle2 className="w-5 h-5 text-[#cbf738]" />
              ) : (
                <Circle className="w-5 h-5 text-stone-600" />
              )}
            </div>

            {/* 4. Sunlight */}
            <div 
              onClick={() => toggleHabit('sunlightMorning')}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                habitLog.sunlightMorning
                  ? 'bg-[#08291b] border-emerald-600 text-white'
                  : 'bg-[#04140d] border-emerald-900/80 text-stone-300 hover:bg-[#072418]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">☀️</span>
                <div>
                  <div className="text-xs font-bold">10 Mins Morning Sun & Outdoors</div>
                  <div className="text-[11px] text-stone-400">Sets your circadian rhythm and natural cortisol curve</div>
                </div>
              </div>
              {habitLog.sunlightMorning ? (
                <CheckCircle2 className="w-5 h-5 text-[#cbf738]" />
              ) : (
                <Circle className="w-5 h-5 text-stone-600" />
              )}
            </div>

            {/* 5. Mindfulness */}
            <div 
              onClick={() => toggleHabit('mindfulnessDone')}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                habitLog.mindfulnessDone
                  ? 'bg-[#08291b] border-emerald-600 text-white'
                  : 'bg-[#04140d] border-emerald-900/80 text-stone-300 hover:bg-[#072418]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🧘</span>
                <div>
                  <div className="text-xs font-bold">5 Mins Deep Breathing / Stretch</div>
                  <div className="text-[11px] text-stone-400">Calms the nervous system and lowers inflammation</div>
                </div>
              </div>
              {habitLog.mindfulnessDone ? (
                <CheckCircle2 className="w-5 h-5 text-[#cbf738]" />
              ) : (
                <Circle className="w-5 h-5 text-stone-600" />
              )}
            </div>
          </div>
        </div>

        {/* Weekly Calendar & Streak */}
        <div className="bg-[#061e15] border border-emerald-800/80 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white font-['Outfit']">Weekly Habit Streak</h3>
              <span className="text-xs text-[#cbf738] font-bold">5 Days Active</span>
            </div>

            {/* Mon to Sun badges */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {[
                { day: 'M', done: true },
                { day: 'T', done: true },
                { day: 'W', done: true },
                { day: 'T', done: true },
                { day: 'F', done: true },
                { day: 'S', done: completedCount >= 3 },
                { day: 'S', done: false },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[10px] text-stone-400 font-bold">{item.day}</div>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold mx-auto ${
                    item.done
                      ? 'bg-[#cbf738] text-[#051811] shadow-sm'
                      : 'bg-[#04150e] border border-emerald-900 text-stone-600'
                  }`}>
                    {item.done ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#04150e] p-3 rounded-2xl border border-emerald-900 space-y-1 mt-4">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#cbf738]" />
                <span>Streak Milestone</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Reach a 7-day streak to unlock a bonus <span className="text-[#cbf738] font-bold">+1 Loyalty Stamp</span> on your Booost Pass!
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-900/60">
            <button
              onClick={onOrderShakeTab}
              className="w-full py-2.5 bg-[#cbf738] hover:bg-[#b2df28] text-[#051811] text-xs font-black rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Order Today's Shake at SM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Educational Nutrition Insights Section */}
      <div className="bg-[#061e15] border border-emerald-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-xl font-black text-white font-['Outfit'] flex items-center gap-2">
          <Apple className="w-5 h-5 text-[#cbf738]" />
          <span>Booost Nutrition Insights</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#04150e] border border-emerald-900/80 p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-black text-[#cbf738] uppercase tracking-wider">
              1. The 30-Minute Anabolic Window
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Consuming 25-35g of rapid-digesting whey or plant protein within 30 minutes after training accelerates muscle protein synthesis and minimizes delayed onset muscle soreness (DOMS).
            </p>
          </div>

          <div className="bg-[#04150e] border border-emerald-900/80 p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-black text-[#cbf738] uppercase tracking-wider">
              2. Real Fruits vs Artificial Syrups
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              At Booost, our smoothies and shakes use real frozen berries, Cavendish bananas, and pure cocoa rather than synthetic syrups, providing real dietary fiber and natural micronutrients.
            </p>
          </div>

          <div className="bg-[#04150e] border border-emerald-900/80 p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-black text-[#cbf738] uppercase tracking-wider">
              3. Cellular Antioxidant Defense
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Our <em>Antioxidant Booster</em> line (such as Green Carrebean and Blueberry Glow) supplies anthocyanins and polyphenols to counteract cellular oxidative stress caused by urban pollution and hard workouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
