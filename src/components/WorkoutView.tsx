import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Sparkles, 
  Coffee, 
  Trophy, 
  CheckSquare, 
  Square,
  ArrowRight,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WORKOUT_ROUTINES } from '../data/workoutData';
import { WorkoutRoutine, ExerciseItem } from '../types';
import { playTimerBeep, playRewardFanfare } from '../utils/audio';

interface WorkoutViewProps {
  onCompleteWorkout: (workoutName: string, calories: number) => void;
  onOrderShake: (shakeId: string) => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  onCompleteWorkout,
  onOrderShake,
}) => {
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine>(WORKOUT_ROUTINES[0]);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  // Timer state for current exercise / rest
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'work' | 'rest'>('work');
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [workoutSessionFinished, setWorkoutSessionFinished] = useState<boolean>(false);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 4 && prev > 1) {
            playTimerBeep(false);
          } else if (prev === 1) {
            playTimerBeep(true);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (timerMode === 'work') {
        setTimerMode('rest');
        setTimerSeconds(20); // 20 sec rest
      } else {
        setTimerMode('work');
        setTimerSeconds(45); // back to next set
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, timerMode]);

  const toggleExerciseComplete = (id: string) => {
    setCompletedExercises((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleFinishRoutine = () => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#cbf738', '#10b981', '#ffffff']
    });
    playRewardFanfare();
    setWorkoutSessionFinished(true);
    onCompleteWorkout(selectedRoutine.title, selectedRoutine.caloriesBurnEstimate);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const currentExercise = selectedRoutine.exercises[activeExerciseIndex] || selectedRoutine.exercises[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Hero Workout Header */}
      <div className="bg-gradient-to-r from-[#072c1c] via-[#093522] to-[#051a11] border-2 border-emerald-700/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cbf738]/20 border border-[#cbf738]/30 text-[#cbf738] text-xs font-black uppercase tracking-wider">
            <Dumbbell className="w-3.5 h-3.5" />
            Booost Athletic Performance
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
            Workouts & Shake Fueling Guide
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Every workout is paired with an authentic Booost Shake formula to maximize protein synthesis, speed up muscle recovery, and power sustained vitality.
          </p>
        </div>

        {/* Floating background aesthetic elements */}
        <div className="absolute right-4 bottom-2 text-8xl opacity-10 select-none pointer-events-none">
          🏋️
        </div>
      </div>

      {/* Routine Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {WORKOUT_ROUTINES.map((routine) => {
          const isSelected = selectedRoutine.id === routine.id;
          return (
            <button
              key={routine.id}
              onClick={() => {
                setSelectedRoutine(routine);
                setCompletedExercises([]);
                setWorkoutSessionFinished(false);
                setActiveExerciseIndex(0);
                setTimerSeconds(45);
                setIsTimerRunning(false);
              }}
              className={`p-5 rounded-3xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#0e442c] to-[#08291a] border-2 border-[#cbf738] shadow-xl shadow-[#cbf738]/15 scale-[1.02]'
                  : 'bg-[#061e15] border-emerald-800/70 hover:bg-[#09291d]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2">
                  <span className="font-bold text-[#cbf738]">{routine.category}</span>
                  <span className="px-2 py-0.5 rounded-full bg-black/40 text-stone-300">
                    {routine.intensity}
                  </span>
                </div>
                <h3 className="text-base font-black text-white font-['Outfit']">{routine.title}</h3>
                <p className="text-stone-400 text-xs mt-1 line-clamp-2">{routine.tagline}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-900/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-stone-300">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{routine.durationMinutes} mins</span>
                </div>
                <div className="flex items-center gap-1 text-[#cbf738] font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>~{routine.caloriesBurnEstimate} kcal</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Exercise Routine & Interactive Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Routine Overview */}
          <div className="bg-[#061e15] border border-emerald-800/80 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/80 pb-4">
              <div>
                <span className="text-xs font-bold text-[#cbf738] uppercase">
                  {selectedRoutine.category}
                </span>
                <h2 className="text-2xl font-black text-white font-['Outfit']">
                  {selectedRoutine.title}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-stone-400">
                  Completed: <span className="font-bold text-[#cbf738]">{completedExercises.length} / {selectedRoutine.exercises.length}</span>
                </div>
                {completedExercises.length === selectedRoutine.exercises.length && !workoutSessionFinished && (
                  <button
                    onClick={handleFinishRoutine}
                    className="px-4 py-1.5 bg-[#cbf738] text-[#051811] text-xs font-black rounded-xl animate-pulse shadow-md"
                  >
                    Log Finished Workout!
                  </button>
                )}
              </div>
            </div>

            {workoutSessionFinished && (
              <div className="bg-gradient-to-r from-emerald-900 via-[#0d4029] to-emerald-900 border-2 border-[#cbf738] p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#cbf738] text-[#051811] flex items-center justify-center font-black">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">Workout Complete! +{selectedRoutine.caloriesBurnEstimate} kcal Burned</div>
                    <div className="text-xs text-emerald-200">Great work! Now sip your paired Booost shake within 30 minutes.</div>
                  </div>
                </div>
                <button
                  onClick={() => onOrderShake(selectedRoutine.pairedShakeId)}
                  className="px-3.5 py-1.5 bg-white text-[#051811] text-xs font-black rounded-xl shrink-0 hover:bg-[#cbf738] transition"
                >
                  Order Paired Shake
                </button>
              </div>
            )}

            {/* Exercise List */}
            <div className="space-y-3">
              {selectedRoutine.exercises.map((ex, index) => {
                const isDone = completedExercises.includes(ex.id);
                const isActive = activeExerciseIndex === index;

                return (
                  <div
                    key={ex.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-[#092b1d] border-emerald-500 shadow-md'
                        : isDone
                        ? 'bg-[#04150e]/60 border-emerald-900/60 opacity-80'
                        : 'bg-[#04160f] border-emerald-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleExerciseComplete(ex.id)}
                          className="mt-0.5 text-stone-400 hover:text-[#cbf738] transition"
                          title="Toggle completion"
                        >
                          {isDone ? (
                            <CheckSquare className="w-5 h-5 text-[#cbf738]" />
                          ) : (
                            <Square className="w-5 h-5 text-stone-500" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-emerald-400">0{index + 1}.</span>
                            <h4 className={`text-sm sm:text-base font-bold text-white ${isDone ? 'line-through text-stone-400' : ''}`}>
                              {ex.name}
                            </h4>
                          </div>
                          <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                            {ex.instructions}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-[11px] bg-[#020e08] text-[#cbf738] font-bold px-2 py-0.5 rounded border border-emerald-900">
                              {ex.sets} • {ex.reps}
                            </span>
                            <span className="text-[11px] bg-[#020e08] text-stone-400 px-2 py-0.5 rounded border border-emerald-900">
                              Target: {ex.targetMuscle}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveExerciseIndex(index);
                          setTimerSeconds(ex.durationSeconds || 45);
                          setTimerMode('work');
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold shrink-0 transition ${
                          isActive
                            ? 'bg-[#cbf738] text-[#051811]'
                            : 'bg-emerald-950 text-stone-300 hover:text-white'
                        }`}
                      >
                        {isActive ? 'Active Now' : 'Track Set'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Timer & Paired Booost Shake */}
        <div className="space-y-6">
          {/* Live Exercise & Rest Timer */}
          <div className="bg-[#061e15] border-2 border-emerald-700/80 rounded-3xl p-6 text-center space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-bold text-white">Live Workout Clock</span>
              <span className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                timerMode === 'work' ? 'bg-[#cbf738] text-[#051811]' : 'bg-blue-500 text-white'
              }`}>
                {timerMode === 'work' ? 'Active Exercise' : 'Rest Window'}
              </span>
            </div>

            <div className="py-2">
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white font-['Outfit']">
                {formatTime(timerSeconds)}
              </div>
              <div className="text-xs text-stone-300 mt-1 font-medium">
                {currentExercise.name}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition shadow-md ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                    : 'bg-[#cbf738] hover:bg-[#b8e028] text-[#051811]'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'Pause Timer' : 'Start Timer'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(timerMode === 'work' ? (currentExercise.durationSeconds || 45) : 20);
                }}
                className="p-2.5 bg-emerald-950 hover:bg-emerald-900 text-stone-300 rounded-xl border border-emerald-800 transition"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-center gap-2 pt-2 border-t border-emerald-900/60 text-[11px] text-stone-400">
              <button onClick={() => setTimerSeconds(30)} className="hover:text-[#cbf738]">30s</button>
              <span>•</span>
              <button onClick={() => setTimerSeconds(45)} className="hover:text-[#cbf738]">45s</button>
              <span>•</span>
              <button onClick={() => setTimerSeconds(60)} className="hover:text-[#cbf738]">60s</button>
              <span>•</span>
              <button onClick={() => setTimerSeconds(90)} className="hover:text-[#cbf738]">90s</button>
            </div>
          </div>

          {/* Paired Booost Shake Spotlight Card */}
          <div className="bg-gradient-to-b from-[#0a3322] to-[#051a11] border-2 border-emerald-600/70 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#cbf738] tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Recovery Pairing</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white font-['Outfit']">
                {selectedRoutine.pairedShakeName}
              </h3>
              <p className="text-stone-300 text-xs mt-2 leading-relaxed">
                {selectedRoutine.pairingReason}
              </p>
            </div>

            <div className="bg-[#03150d] p-3 rounded-2xl border border-emerald-800/80 space-y-1 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Optimal Window:</span>
                <span className="font-bold text-white">Within 30 Mins</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Muscle Protein Synthesis:</span>
                <span className="font-bold text-[#cbf738]">Peak +85%</span>
              </div>
            </div>

            <button
              onClick={() => onOrderShake(selectedRoutine.pairedShakeId)}
              className="w-full py-2.5 bg-[#cbf738] hover:bg-[#b5e028] text-[#051811] text-xs font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Order This Shake Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Performance Tips */}
          <div className="bg-[#061e15] border border-emerald-800/70 p-5 rounded-3xl space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#cbf738]" />
              <span>Trainer Quick Tips</span>
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Hydrate with 250ml of water between sets. If taking our <strong className="text-white">Profee Series</strong>, consume 20-30 minutes before your workout to allow caffeine to peak in bloodstream.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
