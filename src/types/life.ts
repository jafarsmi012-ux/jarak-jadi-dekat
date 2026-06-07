// Tedi & Airin Life Simulator Types

export type PlayerName = 'Tedi' | 'Airin';
export type MoodType = 'happy' | 'love' | 'sad' | 'sick' | 'tired' | 'stressed' | 'excited';
export type ActivityType = 
  | 'waking_up' 
  | 'breakfast' 
  | 'lunch' 
  | 'dinner' 
  | 'snack'
  | 'coffee'
  | 'water'
  | 'medicine'
  | 'work'
  | 'rest'
  | 'watch_movie'
  | 'walk'
  | 'chat'
  | 'sleep'
  | 'cook_together'
  | 'date';

export type CareType =
  | 'medicine_reminder'
  | 'meal_reminder'
  | 'water_reminder'
  | 'hug'
  | 'kiss'
  | 'flower'
  | 'gift'
  | 'comfort'
  | 'encourage'
  | 'love_note';

export interface LifePlayer {
  id: string;
  name: PlayerName;
  city: string;
  avatar: string;
  
  // Status bars
  health: number;
  energy: number;
  hunger: number;
  hydration: number;
  mood: MoodType;
  
  // States
  is_online: boolean;
  is_sleeping: boolean;
  is_sick: boolean;
  current_activity: string | null;
  
  // Medicine
  needs_medicine: boolean;
  medicine_time: string | null;
  last_medicine_taken: string | null;
  
  // Timestamps
  last_active: string;
  last_meal_time: string | null;
  last_sleep_time: string | null;
  wakeup_time: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface LifeActivity {
  id: string;
  player_name: PlayerName;
  activity_type: ActivityType;
  activity_data: Record<string, any>;
  together: boolean;
  partner_joined: boolean;
  created_at: string;
}

export interface CareAction {
  id: string;
  from_player: PlayerName;
  to_player: PlayerName;
  care_type: CareType;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export interface LifeMessage {
  id: string;
  from_player: PlayerName;
  to_player: PlayerName;
  message_text: string;
  message_type: 'chat' | 'system' | 'care';
  is_read: boolean;
  created_at: string;
}

export interface LifeReminder {
  id: string;
  player_name: PlayerName;
  reminder_type: 'meal' | 'medicine' | 'water' | 'sleep' | 'wakeup';
  reminder_time: string;
  is_enabled: boolean;
  last_triggered: string | null;
  created_at: string;
}

export interface RelationshipStats {
  id: string;
  intimacy_level: number;
  intimacy_points: number;
  days_together: number;
  total_activities: number;
  care_actions_given: number;
  messages_sent: number;
  last_updated: string;
}

export interface MemoryLane {
  id: string;
  memory_type: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  date: string;
  created_at: string;
}

// Activity Definitions with visual info
export interface ActivityDefinition {
  type: ActivityType;
  name: string;
  description: string;
  emoji: string;
  duration_minutes: number;
  energy_cost: number;
  hunger_restore?: number;
  hydration_restore?: number;
  health_impact?: number;
  mood_impact?: MoodType;
  requires_partner?: boolean;
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
}

export const ACTIVITIES: Record<string, ActivityDefinition> = {
  waking_up: {
    type: 'waking_up',
    name: 'Bangun Tidur',
    description: 'Good morning! Mulai hari baru',
    emoji: '🌅',
    duration_minutes: 5,
    energy_cost: -20,
    mood_impact: 'happy',
    time_of_day: 'morning',
  },
  breakfast: {
    type: 'breakfast',
    name: 'Sarapan Bareng',
    description: 'Sarapan pagi yang hangat',
    emoji: '🍳',
    duration_minutes: 20,
    energy_cost: 5,
    hunger_restore: 40,
    hydration_restore: 20,
    time_of_day: 'morning',
  },
  coffee: {
    type: 'coffee',
    name: 'Ngopi Bareng',
    description: 'Coffee time with love',
    emoji: '☕',
    duration_minutes: 15,
    energy_cost: -10,
    hydration_restore: 15,
    time_of_day: 'anytime',
  },
  lunch: {
    type: 'lunch',
    name: 'Makan Siang',
    description: 'Lunch date virtual',
    emoji: '🍜',
    duration_minutes: 30,
    energy_cost: 5,
    hunger_restore: 50,
    hydration_restore: 25,
    time_of_day: 'afternoon',
  },
  dinner: {
    type: 'dinner',
    name: 'Makan Malam',
    description: 'Dinner romantis berdua',
    emoji: '🍽️',
    duration_minutes: 40,
    energy_cost: 5,
    hunger_restore: 50,
    hydration_restore: 25,
    time_of_day: 'evening',
  },
  snack: {
    type: 'snack',
    name: 'Ngemil',
    description: 'Snack time!',
    emoji: '🍪',
    duration_minutes: 10,
    energy_cost: 3,
    hunger_restore: 20,
    time_of_day: 'anytime',
  },
  water: {
    type: 'water',
    name: 'Minum Air',
    description: 'Jaga hidrasi',
    emoji: '💧',
    duration_minutes: 2,
    energy_cost: 0,
    hydration_restore: 30,
    time_of_day: 'anytime',
  },
  medicine: {
    type: 'medicine',
    name: 'Minum Obat',
    description: 'Waktunya minum obat',
    emoji: '💊',
    duration_minutes: 5,
    energy_cost: 0,
    health_impact: 20,
    time_of_day: 'anytime',
  },
  work: {
    type: 'work',
    name: 'Kerja/Belajar',
    description: 'Productive time',
    emoji: '💻',
    duration_minutes: 60,
    energy_cost: 15,
    hunger_restore: -10,
    time_of_day: 'afternoon',
  },
  rest: {
    type: 'rest',
    name: 'Istirahat',
    description: 'Recharge energy',
    emoji: '😌',
    duration_minutes: 30,
    energy_cost: -25,
    time_of_day: 'anytime',
  },
  watch_movie: {
    type: 'watch_movie',
    name: 'Nonton Bareng',
    description: 'Movie time berdua',
    emoji: '🎬',
    duration_minutes: 120,
    energy_cost: 8,
    mood_impact: 'happy',
    requires_partner: true,
    time_of_day: 'evening',
  },
  walk: {
    type: 'walk',
    name: 'Jalan-jalan',
    description: 'Virtual walk together',
    emoji: '🚶',
    duration_minutes: 30,
    energy_cost: 10,
    health_impact: 5,
    mood_impact: 'happy',
    time_of_day: 'anytime',
  },
  chat: {
    type: 'chat',
    name: 'Ngobrol Santai',
    description: 'Quality time',
    emoji: '💬',
    duration_minutes: 20,
    energy_cost: 3,
    mood_impact: 'love',
    requires_partner: true,
    time_of_day: 'anytime',
  },
  sleep: {
    type: 'sleep',
    name: 'Tidur',
    description: 'Good night, sleep tight',
    emoji: '😴',
    duration_minutes: 480,
    energy_cost: -100,
    time_of_day: 'night',
  },
  cook_together: {
    type: 'cook_together',
    name: 'Masak Bareng',
    description: 'Cooking with love',
    emoji: '👨‍🍳',
    duration_minutes: 45,
    energy_cost: 12,
    mood_impact: 'happy',
    requires_partner: true,
    time_of_day: 'anytime',
  },
  date: {
    type: 'date',
    name: 'Date Virtual',
    description: 'Special time together',
    emoji: '💑',
    duration_minutes: 90,
    energy_cost: 10,
    mood_impact: 'love',
    requires_partner: true,
    time_of_day: 'evening',
  },
};

// Care Action Definitions
export interface CareDefinition {
  type: CareType;
  name: string;
  emoji: string;
  message_template: string;
  intimacy_points: number;
}

export const CARE_ACTIONS: Record<string, CareDefinition> = {
  medicine_reminder: {
    type: 'medicine_reminder',
    name: 'Ngingetin Minum Obat',
    emoji: '💊',
    message_template: 'Jangan lupa minum obat ya sayang 💕',
    intimacy_points: 10,
  },
  meal_reminder: {
    type: 'meal_reminder',
    name: 'Ngingetin Makan',
    emoji: '🍽️',
    message_template: 'Udah makan belum? Jangan lupa makan ya!',
    intimacy_points: 5,
  },
  water_reminder: {
    type: 'water_reminder',
    name: 'Ngingetin Minum',
    emoji: '💧',
    message_template: 'Minum air putih dulu yuk!',
    intimacy_points: 3,
  },
  hug: {
    type: 'hug',
    name: 'Peluk Virtual',
    emoji: '🤗',
    message_template: 'Peluk erat-erat 🤗💕',
    intimacy_points: 15,
  },
  kiss: {
    type: 'kiss',
    name: 'Cium Virtual',
    emoji: '😘',
    message_template: 'Muach! 😘💋',
    intimacy_points: 20,
  },
  flower: {
    type: 'flower',
    name: 'Kasih Bunga',
    emoji: '💐',
    message_template: 'Bunga buat kamu 💐✨',
    intimacy_points: 25,
  },
  gift: {
    type: 'gift',
    name: 'Kasih Hadiah',
    emoji: '🎁',
    message_template: 'Ada hadiah nih buat kamu! 🎁',
    intimacy_points: 30,
  },
  comfort: {
    type: 'comfort',
    name: 'Hibur',
    emoji: '🥰',
    message_template: 'Kamu gapapa kok, aku di sini 🥰',
    intimacy_points: 20,
  },
  encourage: {
    type: 'encourage',
    name: 'Semangatin',
    emoji: '💪',
    message_template: 'Semangat ya sayang! Kamu pasti bisa! 💪✨',
    intimacy_points: 15,
  },
  love_note: {
    type: 'love_note',
    name: 'Love Note',
    emoji: '💌',
    message_template: 'Aku sayang kamu 💌💕',
    intimacy_points: 25,
  },
};

// Helper functions
export function getMoodEmoji(mood: MoodType): string {
  const moodEmojis: Record<MoodType, string> = {
    happy: '😊',
    love: '🥰',
    sad: '😢',
    sick: '🤒',
    tired: '😴',
    stressed: '😰',
    excited: '🤩',
  };
  return moodEmojis[mood] || '😊';
}

export function getStatusColor(value: number): string {
  if (value >= 70) return 'bg-green-500';
  if (value >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}
