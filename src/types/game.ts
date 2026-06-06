// Virtual Together Game Types

export interface Couple {
  id: string;
  couple_code: string;
  created_at: string;
  relationship_level: number;
  relationship_points: number;
  current_day: number;
  last_active_date: string;
  home_style: string;
}

export interface CouplePlayer {
  id: string;
  couple_id: string;
  player_name: string;
  avatar: string;
  city: string;
  energy: number;
  coins: number;
  is_online: boolean;
  last_seen: string;
  joined_at: string;
}

export interface DailyActivity {
  id: string;
  couple_id: string;
  activity_type: string;
  player_name: string;
  energy_used: number;
  coins_earned: number;
  points_earned: number;
  activity_data: Record<string, any>;
  completed_at: string;
  activity_date: string;
}

export interface GardenPlant {
  id: string;
  couple_id: string;
  plant_type: string;
  planted_by: string;
  planted_at: string;
  watered_at: string | null;
  growth_stage: number;
  is_harvested: boolean;
}

export interface CoupleMessage {
  id: string;
  couple_id: string;
  sender_name: string;
  message_type: string;
  message_text: string;
  is_read: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  couple_id: string;
  achievement_code: string;
  unlocked_at: string;
}

export interface InventoryItem {
  id: string;
  couple_id: string;
  item_type: string;
  item_name: string;
  quantity: number;
  purchased_at: string;
}

// Activity Definitions
export interface ActivityDefinition {
  type: string;
  name: string;
  description: string;
  energy_cost: number;
  coins_reward: number;
  points_reward: number;
  icon: string;
  duration_minutes: number;
  requires_both?: boolean;
}

export const ACTIVITIES: Record<string, ActivityDefinition> = {
  morning_coffee: {
    type: 'morning_coffee',
    name: 'Sarapan Bareng',
    description: 'Ngopi/sarapan bareng sambil cerita',
    energy_cost: 10,
    coins_reward: 5,
    points_reward: 10,
    icon: '☕',
    duration_minutes: 15,
  },
  cook_together: {
    type: 'cook_together',
    name: 'Masak Bareng',
    description: 'Masak menu favorit berdua',
    energy_cost: 15,
    coins_reward: 10,
    points_reward: 15,
    icon: '🍳',
    duration_minutes: 30,
  },
  watch_movie: {
    type: 'watch_movie',
    name: 'Nonton Film',
    description: 'Nonton film bareng via video call',
    energy_cost: 10,
    coins_reward: 5,
    points_reward: 12,
    icon: '🎬',
    duration_minutes: 120,
  },
  study_work: {
    type: 'study_work',
    name: 'Kerja/Belajar Bareng',
    description: 'Productive coworking session',
    energy_cost: 20,
    coins_reward: 15,
    points_reward: 20,
    icon: '📚',
    duration_minutes: 60,
  },
  chat_date: {
    type: 'chat_date',
    name: 'Ngobrol Santai',
    description: 'Quality time ngobrol apa aja',
    energy_cost: 5,
    coins_reward: 3,
    points_reward: 8,
    icon: '💬',
    duration_minutes: 20,
  },
  water_garden: {
    type: 'water_garden',
    name: 'Siram Tanaman',
    description: 'Rawat taman virtual kalian',
    energy_cost: 5,
    coins_reward: 2,
    points_reward: 5,
    icon: '💧',
    duration_minutes: 5,
  },
  play_game: {
    type: 'play_game',
    name: 'Main Game',
    description: 'Main mini game bareng',
    energy_cost: 15,
    coins_reward: 8,
    points_reward: 15,
    icon: '🎮',
    duration_minutes: 30,
  },
  good_night: {
    type: 'good_night',
    name: 'Good Night',
    description: 'Rutinitas sebelum tidur',
    energy_cost: 5,
    coins_reward: 3,
    points_reward: 10,
    icon: '🌙',
    duration_minutes: 10,
  },
};

// Plant Definitions
export interface PlantDefinition {
  type: string;
  name: string;
  icon: string;
  growth_days: number;
  harvest_coins: number;
  plant_cost: number;
}

export const PLANTS: Record<string, PlantDefinition> = {
  rose: {
    type: 'rose',
    name: 'Mawar',
    icon: '🌹',
    growth_days: 3,
    harvest_coins: 20,
    plant_cost: 10,
  },
  sunflower: {
    type: 'sunflower',
    name: 'Bunga Matahari',
    icon: '🌻',
    growth_days: 2,
    harvest_coins: 15,
    plant_cost: 8,
  },
  tulip: {
    type: 'tulip',
    name: 'Tulip',
    icon: '🌷',
    growth_days: 2,
    harvest_coins: 12,
    plant_cost: 7,
  },
  lavender: {
    type: 'lavender',
    name: 'Lavender',
    icon: '🪻',
    growth_days: 4,
    harvest_coins: 25,
    plant_cost: 12,
  },
};

// Level progression
export function getRequiredPointsForLevel(level: number): number {
  return level * 100;
}

export function getLevelFromPoints(points: number): number {
  let level = 1;
  let totalPoints = 0;
  while (totalPoints + getRequiredPointsForLevel(level) <= points) {
    totalPoints += getRequiredPointsForLevel(level);
    level++;
  }
  return level;
}
