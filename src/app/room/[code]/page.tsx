"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRealtimeGame } from '@/hooks/useRealtimeGame';
import PlayerStatus from '@/components/PlayerStatus';
import GameCard from '@/components/GameCard';
import ReactionBar from '@/components/ReactionBar';
import LoveMeter from '@/components/LoveMeter';
import VoiceChatButton from '@/components/VoiceChatButton';
import { Heart, ArrowLeft, Shuffle, MessageCircle, SkipForward, Play, Send } from 'lucide-react';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.code as string;

  const [myName, setMyName] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (!storedName) {
      router.push('/');
      return;
    }
    setMyName(storedName);
  }, [router]);

  const {
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
  } = useRealtimeGame(roomCode, myName);

  // Show notification when turn changes
  useEffect(() => {
    if (room?.current_turn && room.current_turn !== myName) {
      setNotification(`Giliran ${room.current_turn}!`);
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [room?.current_turn, myName]);

  const handleDrawCard = async () => {
    await drawCard();
    setShowAnswerForm(false);
    setAnswerText('');
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    await submitAnswer(answerText.trim());
    setAnswerText('');
    setShowAnswerForm(false);
  };

  const handleSkip = async () => {
    await skipTurn();
    setShowAnswerForm(false);
    setAnswerText('');
  };

  const handleNextTurn = async () => {
    await skipTurn();
    setShowAnswerForm(false);
    setAnswerText('');
  };

  if (isLoading || !myName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-4">💕</div>
          <p className="text-rose-500 font-medium">Memuat game...</p>
        </div>
      </div>
    );
  }

  const hasAnswered = !!currentAnswer;
  const isMyCard = currentAnswer?.player_name === myName;
  const gameStarted = room?.status === 'playing';
  const isWaitingForPlayers = room?.status === 'waiting';

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-cream-100">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-rose-200 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 animate-heart-beat" />
            <span className="text-sm font-medium text-rose-700">{notification}</span>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-rose-500 hover:text-rose-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Keluar</span>
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold text-rose-700">Jarak Jadi Dekat</h1>
            <p className="text-xs text-rose-400">Room: {roomCode}</p>
          </div>

          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* Player Status */}
        <div className="mb-4">
          <PlayerStatus
            players={players}
            currentTurn={room?.current_turn || ''}
            myName={myName}
          />
        </div>

        {/* Love Meter */}
        <div className="mb-4">
          <LoveMeter reactions={reactions} />
        </div>

        {/* Voice Chat */}
        <div className="mb-4">
          <VoiceChatButton roomCode={roomCode} myName={myName} />
        </div>

        {/* Game Area */}
        <div className="mb-6">
          {/* Waiting to start */}
          {isWaitingForPlayers && !canStartGame && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-rose-100 text-center">
              <div className="text-5xl mb-4 animate-bounce">⏳</div>
              <h3 className="text-xl font-bold text-rose-700 mb-2">
                Menunggu Pasangan
              </h3>
              <p className="text-sm text-rose-400 mb-4">
                Kasih tahu kode room <strong className="text-rose-600">{roomCode}</strong> ke pasanganmu ya!
              </p>
              <p className="text-xs text-gray-400">
                Game akan mulai otomatis saat kedua pemain sudah masuk.
              </p>
            </div>
          )}

          {/* Can start game */}
          {isWaitingForPlayers && canStartGame && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-rose-100 text-center">
              <div className="text-5xl mb-4 animate-pulse">🎉</div>
              <h3 className="text-xl font-bold text-rose-700 mb-2">
                Semua Pemain Sudah Masuk!
              </h3>
              <p className="text-sm text-rose-400 mb-6">
                Siap untuk mulai bermain, {myName}?
              </p>
              <button
                onClick={startGame}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 to-lavender-400 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Mulai Game!
              </button>
            </div>
          )}

          {/* Game Board */}
          {gameStarted && (
            <>
              {/* Turn indicator */}
              <div className="text-center mb-4">
                {isMyTurn ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-medium animate-pulse">
                    <Heart className="w-4 h-4" />
                    Giliran kamu, {myName}!
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender-100 text-lavender-700 text-sm font-medium">
                    <span>💤</span>
                    Giliran {room?.current_turn}...
                  </div>
                )}
              </div>

              {/* Card */}
              <div className="mb-6">
                <GameCard card={currentCard} isRevealed={!!currentCard} />
              </div>

              {/* Actions */}
              {isMyTurn && !currentCard && (
                <div className="text-center mb-6">
                  <button
                    onClick={handleDrawCard}
                    className="py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-400 to-lavender-400 text-white font-semibold text-lg shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-lavender-300 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <Shuffle className="w-5 h-5" />
                    Ambil Kartu
                  </button>
                </div>
              )}

              {/* Answer Form */}
              {isMyTurn && currentCard && !hasAnswered && (
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-rose-100 mb-4 animate-slide-up">
                  <h4 className="text-sm font-medium text-rose-600 mb-3">
                    Jawab pertanyaan ini:
                  </h4>

                  {!showAnswerForm ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAnswerForm(true)}
                        className="flex-1 py-3 rounded-xl bg-rose-100 text-rose-700 font-medium hover:bg-rose-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Jawab
                      </button>
                      <button
                        onClick={handleSkip}
                        className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <SkipForward className="w-4 h-4" />
                        Lewati
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Tulis jawabanmu di sini..."
                        className="w-full px-4 py-3 rounded-2xl border-2 border-rose-200 bg-white focus:border-rose-400 focus:outline-none transition-all text-gray-800 placeholder-gray-400 resize-none"
                        rows={3}
                        maxLength={500}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowAnswerForm(false)}
                          className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors text-sm"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={!answerText.trim()}
                          className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                        >
                          <Send className="w-4 h-4" />
                          Kirim
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Show Answer */}
              {hasAnswered && (
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-rose-100 mb-4 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-sm font-bold text-rose-600">
                      {currentAnswer.player_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {currentAnswer.player_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(currentAnswer.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed bg-rose-50 rounded-2xl p-4">
                    {currentAnswer.answer_text}
                  </p>
                </div>
              )}

              {/* Reactions */}
              {currentCard && (
                <div className="mb-4">
                  <ReactionBar
                    reactions={reactions}
                    onReact={addReaction}
                    hasAnswered={hasAnswered}
                    isMyCard={isMyCard}
                  />
                </div>
              )}

              {/* Next Turn Button */}
              {hasAnswered && reactions.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={handleNextTurn}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-lavender-400 to-rose-400 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <SkipForward className="w-4 h-4" />
                    Next Turn
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer quote */}
        <div className="text-center py-4">
          <p className="text-xs text-rose-300 italic">
            "Walau jauh, malam ini kita main di ruang yang sama."
          </p>
          <p className="text-xs text-rose-200 mt-1">
            — Untuk Airin & Tedi 💕
          </p>
        </div>
      </div>
    </div>
  );
}
