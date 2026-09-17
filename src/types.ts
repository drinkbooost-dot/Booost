export type NavigationTab = 'loyalty' | 'menu-franchise' | 'workout' | 'habits' | 'social';

export type ShakeCategory = 
  | 'Best Seller Protein Shake'
  | 'Energy Protein Boost'
  | 'Kid Friendly'
  | 'Antioxidant Booster'
  | 'Coffee Series - Profee';

export type ShakeBenefit = 'Immunity' | 'Protein' | 'Energy';

export type CupSize = '16oz' | '22oz';

export interface MenuItem {
  id: string;
  name: string;
  category: ShakeCategory;
  description: string;
  ingredients: string[];
  benefits: ShakeBenefit[];
  price16ozProtein: number;
  price22ozProtein: number;
  price16ozNonProtein?: number;
  price22ozNonProtein?: number;
  calories16oz: number;
  proteinGrams16oz: number;
  carbsGrams16oz: number;
  fatGrams16oz: number;
  bestTime: 'Post-Workout' | 'Pre-Workout' | 'Morning Kickstart' | 'Afternoon Slump' | 'Anytime Snack';
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    tagBg: string;
  };
  isNew?: boolean;
  isBestSeller?: boolean;
  isCustomerFavorite?: boolean;
  favoriteRank?: number;
  favoriteBadge?: string;
  imageAlt: string;
}

export interface LoyaltyStamp {
  id: number;
  stampedAt?: string;
  drinkName?: string;
  branchName?: string;
  earnedFree?: boolean;
}

export interface CustomerProfile {
  name: string;
  memberId: string;
  email: string;
  phone: string;
  tier: 'Silver Booster' | 'Gold Booster' | 'Champion Booster';
  totalStampsCollected: number;
  stampsCount: number; // 0 to 10, 10th earns free 16oz drink
  freeDrinksAvailable: number;
  favoriteBranch: string;
  joinedDate: string;
  fitnessGoal: 'Muscle Gain' | 'Fat Loss' | 'Daily Energy & Vitality' | 'Athletic Endurance';
}

export interface BranchLocation {
  id: string;
  name: string;
  mall: string;
  city: string;
  province: string;
  hours: string;
  phone: string;
  status: 'Open Now' | 'Closes 9 PM';
  isFlagship?: boolean;
}

export interface ExerciseItem {
  id: string;
  name: string;
  sets: string;
  reps: string;
  durationSeconds?: number;
  targetMuscle: string;
  instructions: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  tagline: string;
  category: 'Strength & Hypertrophy' | 'HIIT & Fat Burn' | 'Morning Profee Circuit' | 'Mobility & Recovery';
  durationMinutes: number;
  intensity: 'Beginner' | 'Intermediate' | 'Advanced';
  caloriesBurnEstimate: number;
  pairedShakeId: string;
  pairedShakeName: string;
  pairingReason: string;
  exercises: ExerciseItem[];
}

export interface DailyHabitLog {
  date: string; // YYYY-MM-DD
  waterGlasses: number; // each glass = 250ml (target 8 glasses = 2000-2500ml)
  targetWaterGlasses: number;
  proteinCurrentGrams: number;
  targetProteinGrams: number;
  drankBooostShake: boolean;
  loggedShakeName?: string;
  completedWorkout: boolean;
  sleepHours: number;
  mindfulnessDone: boolean;
  sunlightMorning: boolean;
}

export interface FranchiseInquiryForm {
  fullName: string;
  email: string;
  contactNumber: string;
  preferredLocation: string;
  investmentBudget: string;
  experienceInFoodBev: string;
  notes: string;
}
