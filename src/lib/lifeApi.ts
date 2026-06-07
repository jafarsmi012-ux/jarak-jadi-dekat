import { supabase } from './supabase';
import type { 
  LifePlayer, 
  PlayerName, 
  LifeActivity, 
  CareAction, 
  LifeMessage,
  RelationshipStats,
  ActivityType,
  CareType,
  MoodType
} from '@/types/life';

// ==================== PLAYER OPERATIONS ====================

export async function getPlayer(name: PlayerName): Promise<LifePlayer | null> {
  const { data, error } = await supabase
    .from('life_players')
    .select('*')
    .eq('name', name)
    .single();

  if (error) {
    console.error('Error getting player:', error);
    return null;
  }
  return data;
}

export async function getBothPlayers(): Promise<LifePlayer[]> {
  const { data, error } = await supabase
    .from('life_players')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error getting players:', error);
    return [];
  }
  return data || [];
}

export async function updatePlayerStatus(
  name: PlayerName,
  updates: Partial<LifePlayer>
): Promise<void> {
  const { error } = await supabase
    .from('life_players')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('name', name);

  if (error) console.error('Error updating player:', error);
}

export async function updatePlayerOnlineStatus(
  name: PlayerName,
  isOnline: boolean
): Promise<void> {
  await updatePlayerStatus(name, {
    is_online: isOnline,
    last_active: new Date().toISOString(),
  });
}

export async function updatePlayerMood(
  name: PlayerName,
  mood: MoodType
): Promise<void> {
  await updatePlayerStatus(name, { mood });
}

export async function updatePlayerHealth(
  name: PlayerName,
  health: number
): Promise<void> {
  const clampedHealth = Math.max(0, Math.min(100, health));
  await updatePlayerStatus(name, { 
    health: clampedHealth,
    is_sick: clampedHealth < 50,
  });
}

export async function updatePlayerNeeds(
  name: PlayerName,
  needs: {
    hunger?: number;
    hydration?: number;
    energy?: number;
  }
): Promise<void> {
  const updates: Partial<LifePlayer> = {};
  
  if (needs.hunger !== undefined) {
    updates.hunger = Math.max(0, Math.min(100, needs.hunger));
  }
  if (needs.hydration !== undefined) {
    updates.hydration = Math.max(0, Math.min(100, needs.hydration));
  }
  if (needs.energy !== undefined) {
    updates.energy = Math.max(0, Math.min(100, needs.energy));
  }
  
  await updatePlayerStatus(name, updates);
}

export async function setPlayerActivity(
  name: PlayerName,
  activity: string | null
): Promise<void> {
  await updatePlayerStatus(name, { current_activity: activity });
}

export async function setPlayerSleeping(
  name: PlayerName,
  isSleeping: boolean
): Promise<void> {
  const updates: Partial<LifePlayer> = {
    is_sleeping: isSleeping,
  };
  
  if (isSleeping) {
    updates.last_sleep_time = new Date().toISOString();
    updates.current_activity = 'sleep';
  } else {
    updates.wakeup_time = new Date().toISOString();
    updates.current_activity = null;
  }
  
  await updatePlayerStatus(name, updates);
}

// ==================== ACTIVITY OPERATIONS ====================

export async function logActivity(
  playerName: PlayerName,
  activityType: ActivityType,
  activityData: Record<string, any> = {},
  together: boolean = false
): Promise<LifeActivity | null> {
  const { data, error } = await supabase
    .from('life_activities')
    .insert({
      player_name: playerName,
      activity_type: activityType,
      activity_data: activityData,
      together,
      partner_joined: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error logging activity:', error);
    return null;
  }
  
  // Update relationship stats
  await incrementActivityCount();
  
  return data;
}

export async function joinActivity(activityId: string): Promise<void> {
  const { error } = await supabase
    .from('life_activities')
    .update({ partner_joined: true })
    .eq('id', activityId);

  if (error) console.error('Error joining activity:', error);
}

export async function getRecentActivities(limit: number = 20): Promise<LifeActivity[]> {
  const { data, error } = await supabase
    .from('life_activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting activities:', error);
    return [];
  }
  return data || [];
}

export async function getTodayActivities(): Promise<LifeActivity[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('life_activities')
    .select('*')
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting today activities:', error);
    return [];
  }
  return data || [];
}

// ==================== CARE OPERATIONS ====================

export async function sendCareAction(
  fromPlayer: PlayerName,
  toPlayer: PlayerName,
  careType: CareType,
  message?: string
): Promise<CareAction | null> {
  const { data, error } = await supabase
    .from('care_actions')
    .insert({
      from_player: fromPlayer,
      to_player: toPlayer,
      care_type: careType,
      message: message || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending care action:', error);
    return null;
  }
  
  // Update relationship stats
  await incrementCareCount();
  
  return data;
}

export async function getUnreadCareActions(playerName: PlayerName): Promise<CareAction[]> {
  const { data, error } = await supabase
    .from('care_actions')
    .select('*')
    .eq('to_player', playerName)
    .eq('is_read', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting care actions:', error);
    return [];
  }
  return data || [];
}

export async function markCareActionAsRead(careId: string): Promise<void> {
  const { error } = await supabase
    .from('care_actions')
    .update({ is_read: true })
    .eq('id', careId);

  if (error) console.error('Error marking care as read:', error);
}

export async function getRecentCareActions(limit: number = 10): Promise<CareAction[]> {
  const { data, error } = await supabase
    .from('care_actions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting care actions:', error);
    return [];
  }
  return data || [];
}

// ==================== MESSAGE OPERATIONS ====================

export async function sendMessage(
  fromPlayer: PlayerName,
  toPlayer: PlayerName,
  messageText: string,
  messageType: 'chat' | 'system' | 'care' = 'chat'
): Promise<LifeMessage | null> {
  const { data, error } = await supabase
    .from('life_messages')
    .insert({
      from_player: fromPlayer,
      to_player: toPlayer,
      message_text: messageText,
      message_type: messageType,
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    return null;
  }
  
  // Update relationship stats
  await incrementMessageCount();
  
  return data;
}

export async function getMessages(limit: number = 50): Promise<LifeMessage[]> {
  const { data, error } = await supabase
    .from('life_messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error getting messages:', error);
    return [];
  }
  return data || [];
}

export async function markMessagesAsRead(
  toPlayer: PlayerName,
  fromPlayer: PlayerName
): Promise<void> {
  const { error } = await supabase
    .from('life_messages')
    .update({ is_read: true })
    .eq('to_player', toPlayer)
    .eq('from_player', fromPlayer)
    .eq('is_read', false);

  if (error) console.error('Error marking messages as read:', error);
}

// ==================== RELATIONSHIP STATS ====================

export async function getRelationshipStats(): Promise<RelationshipStats | null> {
  const { data, error } = await supabase
    .from('relationship_stats')
    .select('*')
    .single();

  if (error) {
    console.error('Error getting relationship stats:', error);
    return null;
  }
  return data;
}

export async function addIntimacyPoints(points: number): Promise<void> {
  const stats = await getRelationshipStats();
  if (!stats) return;

  const newPoints = stats.intimacy_points + points;
  const newLevel = Math.floor(newPoints / 100) + 1;

  const { error } = await supabase
    .from('relationship_stats')
    .update({
      intimacy_points: newPoints,
      intimacy_level: newLevel,
      last_updated: new Date().toISOString(),
    })
    .eq('id', stats.id);

  if (error) console.error('Error updating intimacy:', error);
}

async function incrementActivityCount(): Promise<void> {
  const stats = await getRelationshipStats();
  if (!stats) return;

  const { error } = await supabase
    .from('relationship_stats')
    .update({
      total_activities: stats.total_activities + 1,
      last_updated: new Date().toISOString(),
    })
    .eq('id', stats.id);

  if (error) console.error('Error incrementing activity count:', error);
}

async function incrementCareCount(): Promise<void> {
  const stats = await getRelationshipStats();
  if (!stats) return;

  const { error } = await supabase
    .from('relationship_stats')
    .update({
      care_actions_given: stats.care_actions_given + 1,
      last_updated: new Date().toISOString(),
    })
    .eq('id', stats.id);

  if (error) console.error('Error incrementing care count:', error);
}

async function incrementMessageCount(): Promise<void> {
  const stats = await getRelationshipStats();
  if (!stats) return;

  const { error } = await supabase
    .from('relationship_stats')
    .update({
      messages_sent: stats.messages_sent + 1,
      last_updated: new Date().toISOString(),
    })
    .eq('id', stats.id);

  if (error) console.error('Error incrementing message count:', error);
}

export async function incrementDaysTogether(): Promise<void> {
  const stats = await getRelationshipStats();
  if (!stats) return;

  const { error } = await supabase
    .from('relationship_stats')
    .update({
      days_together: stats.days_together + 1,
      last_updated: new Date().toISOString(),
    })
    .eq('id', stats.id);

  if (error) console.error('Error incrementing days:', error);
}
