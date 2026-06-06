export interface Room {
  id: string;
  code: string;
  created_at: string;
  current_turn: string;
  current_card_id: string | null;
  status: 'waiting' | 'playing' | 'finished';
}

export interface Player {
  id: string;
  room_id: string;
  name: string;
  city: string;
  joined_at: string;
}

export interface Card {
  id: string;
  category: string;
  question: string;
  type: string;
}

export interface Reaction {
  id: string;
  room_id: string;
  player_name: string;
  card_id: string;
  reaction: string;
  created_at: string;
}

export interface Answer {
  id: string;
  room_id: string;
  player_name: string;
  card_id: string;
  answer_text: string;
  created_at: string;
}

export type CategoryType = 
  | 'Truth Romantis' 
  | 'Challenge Manis' 
  | 'Memory LDR' 
  | 'This or That' 
  | 'Future Plan' 
  | 'Deep Talk' 
  | 'Fun Dare';

export interface GameState {
  room: Room | null;
  players: Player[];
  currentCard: Card | null;
  currentAnswer: Answer | null;
  reactions: Reaction[];
  isMyTurn: boolean;
  myName: string;
}
