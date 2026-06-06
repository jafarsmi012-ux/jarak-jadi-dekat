import { supabase } from './supabase';
import type { Couple, CouplePlayer, DailyActivity, GardenPlant, CoupleMessage } from '@/types/game';

// ==================== COUPLE OPERATIONS ====================

export async function createCouple(coupleCode: string): Promise<Couple | null> {
  const { data, error } = await supabase
    .from('couples')
    .insert({ couple_code: coupleCode })
    .select()
    .single();

  if (error) {
    console.error('Error creating couple:', error);
    return null;
  }
  return data;
}

export async function getCouple(coupleCode: string): Promise<Couple | null> {
  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .eq('couple_code', coupleCode)
    .single();

  if (error) {
    console.error('Error getting couple:', error);
    return null;
  }
  return data;
}

export async function updateCoupleProgress(
  coupleId: string,
  points: number
): Promise<void> {
  const { data: couple } = await supabase
    .from('couples')
    .select('relationship_points, relationship_level')
    .eq('id', coupleId)
    .single();

  if (!couple) return;

  const newPoints = couple.relationship_points + points;
  const newLevel = Math.floor(newPoints / 100) + 1;

  await supabase
    .from('couples')
    .update({
      relationship_points: newPoints,
      relationship_level: newLevel,
      last_active_date: new Date().toISOString().split('T')[0],
    })
    .eq('id', coupleId);
}

// ==================== PLAYER OPERATIONS ====================

export async function joinCouple(
  coupleId: string,
  playerName: string,
  city: string,
  avatar: string = '😊'
): Promise<CouplePlayer | null> {
  const { data, error } = await supabase
    .from('couple_players')
    .insert({
      couple_id: coupleId,
      player_name: playerName,
      city,
      avatar,
    })
    .select()
    .single();

  if (error) {
    console.error('Error joining couple:', error);
    return null;
  }
  return data;
}

export async function getPlayers(coupleId: string): Promise<CouplePlayer[]> {
  const { data, error } = await supabase
    .from('couple_players')
    .select('*')
    .eq('couple_id', coupleId)
    .order('joined_at', { ascending: true });

  if (error) {
    console.error('Error getting players:', error);
    return [];
  }
  return data || [];
}

export async function updatePlayerStatus(
  playerId: string,
  isOnline: boolean
): Promise<void> {
  await supabase
    .from('couple_players')
    .update({
      is_online: isOnline,
      last_seen: new Date().toISOString(),
    })
    .eq('id', playerId);
}

export async function updatePlayerResources(
  playerId: string,
  energyChange: number,
  coinsChange: number
): Promise<void> {
  const { data: player } = await supabase
    .from('couple_players')
    .select('energy, coins')
    .eq('id', playerId)
    .single();

  if (!player) return;

  await supabase
    .from('couple_players')
    .update({
      energy: Math.max(0, Math.min(100, player.energy + energyChange)),
      coins: Math.max(0, player.coins + coinsChange),
    })
    .eq('id', playerId);
}

// ==================== ACTIVITY OPERATIONS ====================

export async function logActivity(
  coupleId: string,
  playerName: string,
  activityType: string,
  energyUsed: number,
  coinsEarned: number,
  pointsEarned: number,
  activityData: Record<string, any> = {}
): Promise<DailyActivity | null> {
  const { data, error } = await supabase
    .from('daily_activities')
    .insert({
      couple_id: coupleId,
      player_name: playerName,
      activity_type: activityType,
      energy_used: energyUsed,
      coins_earned: coinsEarned,
      points_earned: pointsEarned,
      activity_data: activityData,
    })
    .select()
    .single();

  if (error) {
    console.error('Error logging activity:', error);
    return null;
  }
  return data;
}

export async function getTodayActivities(coupleId: string): Promise<DailyActivity[]> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_activities')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('activity_date', today)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error getting activities:', error);
    return [];
  }
  return data || [];
}

// ==================== GARDEN OPERATIONS ====================

export async function plantSeed(
  coupleId: string,
  plantType: string,
  plantedBy: string
): Promise<GardenPlant | null> {
  const { data, error } = await supabase
    .from('garden_plants')
    .insert({
      couple_id: coupleId,
      plant_type: plantType,
      planted_by: plantedBy,
    })
    .select()
    .single();

  if (error) {
    console.error('Error planting seed:', error);
    return null;
  }
  return data;
}

export async function getGarden(coupleId: string): Promise<GardenPlant[]> {
  const { data, error } = await supabase
    .from('garden_plants')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('is_harvested', false)
    .order('planted_at', { ascending: true });

  if (error) {
    console.error('Error getting garden:', error);
    return [];
  }
  return data || [];
}

export async function waterPlant(plantId: string): Promise<void> {
  await supabase
    .from('garden_plants')
    .update({
      watered_at: new Date().toISOString(),
    })
    .eq('id', plantId);
}

export async function harvestPlant(plantId: string): Promise<void> {
  await supabase
    .from('garden_plants')
    .update({
      is_harvested: true,
    })
    .eq('id', plantId);
}

// ==================== MESSAGE OPERATIONS ====================

export async function sendMessage(
  coupleId: string,
  senderName: string,
  messageText: string,
  messageType: string = 'chat'
): Promise<CoupleMessage | null> {
  const { data, error } = await supabase
    .from('couple_messages')
    .insert({
      couple_id: coupleId,
      sender_name: senderName,
      message_type: messageType,
      message_text: messageText,
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    return null;
  }
  return data;
}

export async function getRecentMessages(coupleId: string, limit: number = 50): Promise<CoupleMessage[]> {
  const { data, error } = await supabase
    .from('couple_messages')
    .select('*')
    .eq('couple_id', coupleId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting messages:', error);
    return [];
  }
  return (data || []).reverse();
}

// ==================== ACHIEVEMENT OPERATIONS ====================

export async function unlockAchievement(
  coupleId: string,
  achievementCode: string
): Promise<void> {
  await supabase
    .from('couple_achievements')
    .insert({
      couple_id: coupleId,
      achievement_code: achievementCode,
    });
}

export async function getAchievements(coupleId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('couple_achievements')
    .select('achievement_code')
    .eq('couple_id', coupleId);

  if (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
  return (data || []).map(a => a.achievement_code);
}
