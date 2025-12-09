import { UserProfile, WorkoutLog } from '../types';

const DB_KEY_PREFIX = 'vengeance_db_';

export const storageService = {
  saveUser: (user: UserProfile) => {
    localStorage.setItem(`${DB_KEY_PREFIX}${user.email}`, JSON.stringify(user));
    // Also save as current session
    localStorage.setItem('vengeance_session', user.email);
  },

  getUser: (email: string): UserProfile | null => {
    const data = localStorage.getItem(`${DB_KEY_PREFIX}${email}`);
    return data ? JSON.parse(data) : null;
  },

  getCurrentUser: (): UserProfile | null => {
    const email = localStorage.getItem('vengeance_session');
    if (!email) return null;
    return storageService.getUser(email);
  },

  logout: () => {
    localStorage.removeItem('vengeance_session');
  },

  // Save progress
  logWorkout: (email: string, log: WorkoutLog) => {
    const key = `${DB_KEY_PREFIX}${email}_logs`;
    const logs = storageService.getWorkoutLogs(email);
    logs.push(log);
    localStorage.setItem(key, JSON.stringify(logs));
  },

  getWorkoutLogs: (email: string): WorkoutLog[] => {
    const key = `${DB_KEY_PREFIX}${email}_logs`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
};
