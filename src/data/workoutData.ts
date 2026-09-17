import { WorkoutRoutine } from '../types';

export const WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'muscle-hypertrophy',
    title: 'Muscle Forge & Hypertrophy',
    tagline: 'High-tension resistance circuit designed for lean muscle growth and strength.',
    category: 'Strength & Hypertrophy',
    durationMinutes: 35,
    intensity: 'Intermediate',
    caloriesBurnEstimate: 340,
    pairedShakeId: 'chocoloco',
    pairedShakeName: 'Chocoloco 22oz (35g Protein)',
    pairingReason: 'Rapid muscle fiber micro-tear repair via Dutch cocoa antioxidants + high whey isolate protein within 30 min post-workout window.',
    exercises: [
      {
        id: 'ex-1',
        name: 'Dumbbell or Goblet Squats',
        sets: '4 Sets',
        reps: '12 - 15 Reps',
        targetMuscle: 'Quadriceps, Glutes & Core',
        instructions: 'Keep your chest proud, feet shoulder-width apart, and sink down below parallel before driving through heels.'
      },
      {
        id: 'ex-2',
        name: 'Push-Ups to Tempo',
        sets: '3 Sets',
        reps: '12 - 15 Reps',
        targetMuscle: 'Pectorals, Anterior Deltoids & Triceps',
        instructions: 'Lower your body over 3 seconds, pause for 1 second at bottom, and explode upward.'
      },
      {
        id: 'ex-3',
        name: 'Dumbbell Romanian Deadlift (RDL)',
        sets: '4 Sets',
        reps: '10 - 12 Reps',
        targetMuscle: 'Hamstrings, Glutes & Lower Back',
        instructions: 'Hinge at the hips, keeping a soft knee bend and neutral spine until you feel a deep hamstring stretch.'
      },
      {
        id: 'ex-4',
        name: 'Overhead Dumbbell Shoulder Press',
        sets: '3 Sets',
        reps: '10 - 12 Reps',
        targetMuscle: 'Deltoids & Upper Traps',
        instructions: 'Press weights vertically without arching your lower back. Brace your abdominal wall.'
      },
      {
        id: 'ex-5',
        name: 'Plank Knee-to-Elbow',
        sets: '3 Sets',
        reps: '20 Total Reps',
        durationSeconds: 45,
        targetMuscle: 'Transverse Abdominis & Obliques',
        instructions: 'Maintain a rigid straight plank line and smoothly draw knee toward same-side elbow.'
      }
    ]
  },
  {
    id: 'hiit-shred',
    title: 'Metabolic Fat Burn & Agility',
    tagline: 'High-intensity interval training to elevate heart rate and maximize calorie burn.',
    category: 'HIIT & Fat Burn',
    durationMinutes: 22,
    intensity: 'Advanced',
    caloriesBurnEstimate: 290,
    pairedShakeId: 'lean-green-machine',
    pairedShakeName: 'Lean Green Machine (Detox + 26g Protein)',
    pairingReason: 'Replenishes electrolytes with cucumber & lemon zest while supplying branched-chain amino acids with near-zero fat.',
    exercises: [
      {
        id: 'hiit-1',
        name: 'Explosive Jump Squats',
        sets: '4 Rounds',
        reps: '40s On / 20s Rest',
        durationSeconds: 40,
        targetMuscle: 'Lower Body Explosiveness',
        instructions: 'Squat down smoothly and explode vertically with full hip extension. Land softly on balls of feet.'
      },
      {
        id: 'hiit-2',
        name: 'Mountain Climbers',
        sets: '4 Rounds',
        reps: '40s On / 20s Rest',
        durationSeconds: 40,
        targetMuscle: 'Core & Cardiovascular Conditioning',
        instructions: 'Drive knees rapidly toward chest while maintaining a flat back in high push-up position.'
      },
      {
        id: 'hiit-3',
        name: 'Burpees with Tuck Jump',
        sets: '3 Rounds',
        reps: '30s On / 30s Rest',
        durationSeconds: 30,
        targetMuscle: 'Full Body Endurance',
        instructions: 'Drop chest to floor, snap feet forward under hips, and jump upwards tucking knees.'
      },
      {
        id: 'hiit-4',
        name: 'Speed Skater Lateral Hops',
        sets: '4 Rounds',
        reps: '40s On / 20s Rest',
        durationSeconds: 40,
        targetMuscle: 'Lateral Glute Stability & Calves',
        instructions: 'Leap laterally from one foot to the other, sweeping the trailing leg behind in a balanced skater stance.'
      }
    ]
  },
  {
    id: 'profee-morning-circuit',
    title: '15-Min Morning Energy Ignition',
    tagline: 'A fast, dynamic bodyweight circuit to wake up metabolism and awaken neural drive.',
    category: 'Morning Profee Circuit',
    durationMinutes: 15,
    intensity: 'Beginner',
    caloriesBurnEstimate: 160,
    pairedShakeId: 'profee-supreme',
    pairedShakeName: 'Profee Supreme (120mg Caffeine + 28g Protein)',
    pairingReason: 'Sip this 20 minutes beforehand for an instantaneous morning dopamine and focus surge, followed by protein satiety.',
    exercises: [
      {
        id: 'pro-1',
        name: 'Bodyweight Prisoner Squats',
        sets: '3 Sets',
        reps: '15 Reps',
        targetMuscle: 'Quads & Thoracic Posture',
        instructions: 'Fingertips behind head, elbows flared wide to open chest, and perform controlled deep squats.'
      },
      {
        id: 'pro-2',
        name: 'Reverse Lunges with Torso Twist',
        sets: '3 Sets',
        reps: '12 Reps per leg',
        targetMuscle: 'Glutes, Hip Flexors & Obliques',
        instructions: 'Step backwards into a 90-degree lunge and rotate your torso toward the front lead knee.'
      },
      {
        id: 'pro-3',
        name: 'Incline Desk or Floor Push-ups',
        sets: '3 Sets',
        reps: '12 Reps',
        targetMuscle: 'Chest & Arms',
        instructions: 'Keep elbows tucked at 45 degrees relative to ribs for optimal shoulder longevity.'
      },
      {
        id: 'pro-4',
        name: 'Bird-Dog Core Stabilizers',
        sets: '3 Sets',
        reps: '10 Each Side',
        targetMuscle: 'Multifidus & Glute Medius',
        instructions: 'On hands and knees, extend opposite arm and leg straight out without twisting pelvis.'
      }
    ]
  },
  {
    id: 'active-recovery',
    title: 'Cellular Recovery & Mobility Flow',
    tagline: 'Gentle somatic flow designed to flush lactic acid, open tight hips, and soothe joints.',
    category: 'Mobility & Recovery',
    durationMinutes: 20,
    intensity: 'Beginner',
    caloriesBurnEstimate: 95,
    pairedShakeId: 'blueberry-glow',
    pairedShakeName: 'Blueberry Glow (Antioxidant Anthocyanins)',
    pairingReason: 'Wild blueberries and acai neutralize free radicals generated during strenuous physical training.',
    exercises: [
      {
        id: 'rec-1',
        name: 'World’s Greatest Stretch',
        sets: '3 Rounds',
        reps: '5 Per Side',
        durationSeconds: 60,
        targetMuscle: 'Thoracic Spine, Hip Flexors & Hamstrings',
        instructions: 'Lunge forward with elbow dropped inside front ankle, then rotate chest and extend hand to sky.'
      },
      {
        id: 'rec-2',
        name: '90/90 Hip Internal & External Rotations',
        sets: '2 Rounds',
        reps: '8 Transitions',
        durationSeconds: 60,
        targetMuscle: 'Hip Joint Capsule & Piriformis',
        instructions: 'Sit tall with legs folded into two 90-degree angles and pivot smoothly across to the opposite side.'
      },
      {
        id: 'rec-3',
        name: 'Cat-Cow Spinal Articulation',
        sets: '2 Sets',
        reps: '10 Breaths',
        targetMuscle: 'Entire Spinal Column',
        instructions: 'Inhale to arch spine and lift gaze; exhale to tuck tailbone and push floor away with shoulder blades.'
      },
      {
        id: 'rec-4',
        name: 'Deep Squat Pry & Hold',
        sets: '2 Holds',
        reps: '45 Seconds',
        durationSeconds: 45,
        targetMuscle: 'Ankle Dorsiflexion & Adductors',
        instructions: 'Drop into a deep resting squat, palms together pressing knees outwards gently.'
      }
    ]
  }
];
