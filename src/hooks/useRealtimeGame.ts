"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Room, Player, Card, Reaction, Answer } from '@/types';

export function useRealtimeGame(roomCode: string, myName: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      if (!roomCode) return;

      setIsLoading(true);

      // Get room
      const { data: roomData } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', roomCode)
        .single();

      if (roomData) {
        setRoom(roomData);

        // Get players
        const { data: playersData } = await supabase
          .from('players')
          .select('*')
          .eq('room_id', roomData.id)
          .order('joined_at', { ascending: true });

        setPlayers(playersData || []);

        // Get current card
        if (roomData.current_card_id) {
          const { data: cardData } = await supabase
            .from('cards')
            .select('*')
            .eq('id', roomData.current_card_id)
            .single();
          setCurrentCard(cardData);
        }

        // Get answers
        const { data: answersData } = await supabase
          .from('answers')
          .select('*')
          .eq('room_id', roomData.id)
          .eq('card_id', roomData.current_card_id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (answersData && answersData.length > 0) {
          setCurrentAnswer(answersData[0]);
        }

        // Get reactions
        const { data: reactionsData } = await supabase
          .from('reactions')
          .select('*')
          .eq('room_id', roomData.id)
          .eq('card_id', roomData.current_card_id);

        setReactions(reactionsData || []);
      }

      setIsLoading(false);
    }

    loadInitialData();
  }, [roomCode]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!room?.id) return;

    const roomId = room.id;

    // Subscribe to room changes
    const roomChannel = supabase
      .channel(`room-${roomCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const updatedRoom = payload.new as Room;
          setRoom(updatedRoom);

          // Fetch new card if changed
          if (updatedRoom.current_card_id && updatedRoom.current_card_id !== currentCard?.id) {
            supabase
              .from('cards')
              .select('*')
              .eq('id', updatedRoom.current_card_id)
              .single()
              .then(({ data }) => {
                if (data) setCurrentCard(data);
              });

            // Reset answer and reactions for new card
            setCurrentAnswer(null);
            setReactions([]);
          }
        }
      )
      .subscribe();

    // Subscribe to players
    const playersChannel = supabase
      .channel(`players-${roomCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          supabase
            .from('players')
            .select('*')
            .eq('room_id', roomId)
            .order('joined_at', { ascending: true })
            .then(({ data }) => {
              if (data) setPlayers(data);
            });
        }
      )
      .subscribe();

    // Subscribe to answers
    const answersChannel = supabase
      .channel(`answers-${roomCode}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'answers',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newAnswer = payload.new as Answer;
          if (newAnswer.card_id === room.current_card_id) {
            setCurrentAnswer(newAnswer);
          }
        }
      )
      .subscribe();

    // Subscribe to reactions
    const reactionsChannel = supabase
      .channel(`reactions-${roomCode}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reactions',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newReaction = payload.new as Reaction;
          if (newReaction.card_id === room.current_card_id) {
            setReactions((prev) => [...prev, newReaction]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(answersChannel);
      supabase.removeChannel(reactionsChannel);
    };
  }, [room?.id, roomCode, currentCard?.id]);

  const isMyTurn = room?.current_turn === myName;
  const canStartGame = players.length === 2 && room?.status === 'waiting';

  const drawCard = useCallback(async () => {
    if (!room || !isMyTurn) return;

    const { data: cards } = await supabase.from('cards').select('*');
    if (!cards || cards.length === 0) return;

    const randomCard = cards[Math.floor(Math.random() * cards.length)];

    const nextPlayer = players.find(p => p.name !== myName)?.name || myName;

    await supabase
      .from('rooms')
      .update({
        current_card_id: randomCard.id,
        current_turn: nextPlayer,
        status: 'playing',
      })
      .eq('id', room.id);
  }, [room, isMyTurn, players, myName]);

  const submitAnswer = useCallback(async (answerText: string) => {
    if (!room || !currentCard) return;

    await supabase.from('answers').insert({
      room_id: room.id,
      player_name: myName,
      card_id: currentCard.id,
      answer_text: answerText,
    });
  }, [room, currentCard, myName]);

  const addReaction = useCallback(async (reaction: string) => {
    if (!room || !currentCard) return;

    await supabase.from('reactions').insert({
      room_id: room.id,
      player_name: myName,
      card_id: currentCard.id,
      reaction,
    });
  }, [room, currentCard, myName]);

  const skipTurn = useCallback(async () => {
    if (!room || !isMyTurn) return;

    const nextPlayer = players.find(p => p.name !== myName)?.name || myName;

    await supabase
      .from('rooms')
      .update({ current_turn: nextPlayer })
      .eq('id', room.id);
  }, [room, isMyTurn, players, myName]);

  const startGame = useCallback(async () => {
    if (!room || !canStartGame) return;

    const firstPlayer = players[0]?.name || myName;

    await supabase
      .from('rooms')
      .update({ status: 'playing', current_turn: firstPlayer })
      .eq('id', room.id);
  }, [room, canStartGame, players, myName]);

  return {
    room,
    players,
    currentCard,
    currentAnswer,
    reactions,
    isMyTurn,
    isLoading,
    canStartGame,
    drawCard,
    submitAnswer,
    addReaction,
    skipTurn,
    startGame,
  };
}
