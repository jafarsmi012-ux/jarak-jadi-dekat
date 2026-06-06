import { createClient } from '@supabase/supabase-js';
import { Room, Player, Card, Reaction, Answer } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Room operations
export async function createRoom(code: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from('rooms')
    .insert({ code, status: 'waiting', current_turn: '' })
    .select()
    .single();

  if (error) {
    console.error('Error creating room:', error);
    return null;
  }
  return data;
}

export async function getRoom(code: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code)
    .single();

  if (error) {
    console.error('Error getting room:', error);
    return null;
  }
  return data;
}

export async function updateRoomStatus(
  roomId: string, 
  status: string, 
  currentTurn?: string
): Promise<void> {
  const update: Record<string, string> = { status };
  if (currentTurn) update.current_turn = currentTurn;

  const { error } = await supabase
    .from('rooms')
    .update(update)
    .eq('id', roomId);

  if (error) console.error('Error updating room:', error);
}

export async function updateRoomCard(
  roomId: string, 
  cardId: string, 
  currentTurn: string
): Promise<void> {
  const { error } = await supabase
    .from('rooms')
    .update({ current_card_id: cardId, current_turn: currentTurn })
    .eq('id', roomId);

  if (error) console.error('Error updating room card:', error);
}

// Player operations
export async function joinRoom(
  roomId: string, 
  name: string, 
  city: string
): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .insert({ room_id: roomId, name, city })
    .select()
    .single();

  if (error) {
    console.error('Error joining room:', error);
    return null;
  }
  return data;
}

export async function getPlayers(roomId: string): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('room_id', roomId)
    .order('joined_at', { ascending: true });

  if (error) {
    console.error('Error getting players:', error);
    return [];
  }
  return data || [];
}

// Card operations
export async function getRandomCard(): Promise<Card | null> {
  const { data, error } = await supabase
    .from('cards')
    .select('*');

  if (error || !data || data.length === 0) {
    console.error('Error getting cards:', error);
    return null;
  }

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

export async function getCardById(cardId: string): Promise<Card | null> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single();

  if (error) {
    console.error('Error getting card:', error);
    return null;
  }
  return data;
}

// Answer operations
export async function submitAnswer(
  roomId: string, 
  playerName: string, 
  cardId: string, 
  answerText: string
): Promise<Answer | null> {
  const { data, error } = await supabase
    .from('answers')
    .insert({ room_id: roomId, player_name: playerName, card_id: cardId, answer_text: answerText })
    .select()
    .single();

  if (error) {
    console.error('Error submitting answer:', error);
    return null;
  }
  return data;
}

export async function getAnswers(roomId: string): Promise<Answer[]> {
  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error getting answers:', error);
    return [];
  }
  return data || [];
}

// Reaction operations
export async function addReaction(
  roomId: string, 
  playerName: string, 
  cardId: string, 
  reaction: string
): Promise<Reaction | null> {
  const { data, error } = await supabase
    .from('reactions')
    .insert({ room_id: roomId, player_name: playerName, card_id: cardId, reaction })
    .select()
    .single();

  if (error) {
    console.error('Error adding reaction:', error);
    return null;
  }
  return data;
}

export async function getReactions(roomId: string): Promise<Reaction[]> {
  const { data, error } = await supabase
    .from('reactions')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error getting reactions:', error);
    return [];
  }
  return data || [];
}
