export interface UserProfile {
  name: string;
  email: string;
  password?: string; // Stored securely in a real app, here locally
  height: number; // cm
  weight: number; // kg
  age: number;
  gender: 'male' | 'female';
  targetWeight: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  reps: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  target: 'Abdomen' | 'Peito' | 'Pernas' | 'Costas' | 'Full Body' | 'Cardio' | 'Braços';
  videoId?: string; // YouTube Video ID (e.g., 'dQw4w9WgXcQ')
}

export interface WorkoutLog {
  date: string;
  exercisesCompleted: number;
  caloriesBurned: number; // Estimated
  type?: 'strength' | 'cardio';
  distance?: number; // km
  duration?: number; // seconds
}

export interface DietPlan {
  suggestion: string;
  dateGenerated: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
  timestamp: number;
}

export type WeekPlan = {
  [key in 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo']: string[]; // Array of Exercise IDs
};

export interface TrainingPlan {
  [weekName: string]: WeekPlan;
}