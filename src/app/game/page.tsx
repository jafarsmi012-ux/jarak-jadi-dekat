"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heart, Zap, Coins, Home, MessageCircle, Sprout, Trophy } from 'lucide-react';
import * as gameApi from '@/lib/gameApi';
import type { Couple, CouplePlayer } from '@/types/game';
import { ACTIVITIES } from '@/types/game';
import ActivityCard from '@/components/game/ActivityCard';
import GardenView from '@/components/game/GardenView';
import ChatBox from '@/components/game/ChatBox';

type GameView = 'home' | 'garden' | 'chat' | 'achievements';

export default function GamePage() {
  const searchParams = useSearchParams();
  const coupleCode = searchParams?.get('code');
  const shouldCreate = searchParams?.get('create') === 'true';

  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerCity, setPlayerCity] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('😊');

  const [couple, setCouple] = useState<Couple | null>(null);
  const [players, setPlayers] = useState<CouplePlayer[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<CouplePlayer | null>(null);
  const [currentView, setCurrentView] = useState<GameView>('home');

  const avatars = ['😊', '😎', '🥰', '😍', '🤗', '😘', '🙂', '😌'];

  useEffect(() => {
    if (!coupleCode) {
      window.location.href = '/';
      return;
    }
    initializeGame();
  }, [coupleCode]);

  async function initializeGame() {
    if (!coupleCode) return;

    try {
      let coupleData = await gameApi.getCouple(coupleCode);

      if (!coupleData && shouldCreate) {
        coupleData = await gameApi.createCouple(coupleCode);
      }

      if (!coupleData) {
        alert('Kode couple tidak ditemukan!');
        window.location.href = '/';
        return;
      }

      setCouple(coupleData);

      const playersData = await gameApi.getPlayers(coupleData.id);
      setPlayers(playersData);

      // Check if current user already exists
      const existingPlayer = playersData.find(p => {
        const savedName = localStorage.getItem(`player_${coupleCode}`);
        return savedName && p.player_name === savedName;
      });

      if (existingPlayer) {
        setCurrentPlayer(existingPlayer);
        await gameApi.updatePlayerStatus(existingPlayer.id, true);
        setLoading(false);
      } else {
        setNeedsSetup(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error initializing game:', error);
      setLoading(false);
    }
  }

  async function handleJoinCouple() {
    if (!couple || !playerName.trim() || !playerCity.trim()) {
      alert('Mohon isi nama dan kota!');
      return;
    }

    if (players.length >= 2) {
      alert('Couple sudah penuh! (maksimal 2 pemain)');
      return;
    }

    const player = await gameApi.joinCouple(
      couple.id,
      playerName.trim(),
      playerCity.trim(),
      selectedAvatar
    );

    if (player) {
      localStorage.setItem(`player_${coupleCode}`, player.player_name);
      setCurrentPlayer(player);
      setNeedsSetup(false);
      const updatedPlayers = await gameApi.getPlayers(couple.id);
      setPlayers(updatedPlayers);
    }
  }

  async function handleDoActivity(activityType: string) {
    if (!couple || !currentPlayer) return;

    const activity = ACTIVITIES[activityType];
    if (!activity) return;

    if (currentPlayer.energy < activity.energy_cost) {
      alert('Energy tidak cukup! Tunggu besok untuk refill.');
      return;
    }

    // Log activity
    await gameApi.logActivity(
      couple.id,
      currentPlayer.player_name,
      activityType,
      activity.energy_cost,
      activity.coins_reward,
      activity.points_reward
    );

    // Update player resources
    await gameApi.updatePlayerResources(
      currentPlayer.id,
      -activity.energy_cost,
      activity.coins_reward
    );

    // Update couple progress
    await gameApi.updateCoupleProgress(couple.id, activity.points_reward);

    // Refresh data
    const updatedPlayer = await gameApi.getPlayers(couple.id);
    const myPlayer = updatedPlayer.find(p => p.id === currentPlayer.id);
    if (myPlayer) setCurrentPlayer(myPlayer);

    const updatedCouple = await gameApi.getCouple(coupleCode!);
    if (updatedCouple) setCouple(updatedCouple);

    // Send activity message
    await gameApi.sendMessage(
      couple.id,
      currentPlayer.player_name,
      `melakukan aktivitas: ${activity.name} ${activity.icon}`,
      'activity'
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🏠</div>
          <p className="text-purple-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-purple-700 mb-2">Selamat Datang!</h2>
          <p className="text-gray-600 mb-6">Isi data kamu untuk mulai</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Panggilan</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="contoh: Airin"
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kota Asal</label>
              <input
                type="text"
                value={playerCity}
                onChange={(e) => setPlayerCity(e.target.value)}
                placeholder="contoh: Padang"
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
                maxLength={30}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Avatar</label>
              <div className="grid grid-cols-8 gap-2">
                {avatars.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedAvatar(emoji)}
                    className={`text-3xl p-2 rounded-xl transition-all ${
                      selectedAvatar === emoji
                        ? 'bg-purple-100 ring-2 ring-purple-400 scale-110'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleJoinCouple}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Mulai Petualangan! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!couple || !currentPlayer) return null;

  const partner = players.find(p => p.id !== currentPlayer.id);
  const levelProgress = (couple.relationship_points % 100) / 100 * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-purple-700">Virtual Together</h1>
              <p className="text-xs text-gray-500">Kode: {couple.couple_code}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 mb-1">
                <Heart className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-bold text-purple-700">Level {couple.relationship_level}</span>
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Player 1 */}
            <div className="flex items-center gap-2 flex-1">
              <div className="text-3xl">{currentPlayer.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm truncate">{currentPlayer.player_name}</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    {currentPlayer.energy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-500" />
                    {currentPlayer.coins}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-pink-400">💕</div>

            {/* Player 2 */}
            <div className="flex items-center gap-2 flex-1 flex-row-reverse">
              <div className="text-3xl">{partner?.avatar || '...'}</div>
              <div className="flex-1 min-w-0 text-right">
                <div className="font-semibold text-gray-800 text-sm truncate">{partner?.player_name || 'Menunggu...'}</div>
                {partner && (
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      {partner.energy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-500" />
                      {partner.coins}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 pb-24">
        {currentView === 'home' && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <h2 className="font-bold text-purple-700 mb-3 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Aktivitas Harian
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(ACTIVITIES).map(activity => (
                  <ActivityCard
                    key={activity.type}
                    activity={activity}
                    onStart={() => handleDoActivity(activity.type)}
                    canAfford={currentPlayer.energy >= activity.energy_cost}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'garden' && couple && (
          <GardenView coupleId={couple.id} playerName={currentPlayer.player_name} playerCoins={currentPlayer.coins} />
        )}

        {currentView === 'chat' && couple && (
          <ChatBox coupleId={couple.id} currentPlayerName={currentPlayer.player_name} />
        )}

        {currentView === 'achievements' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h2 className="font-bold text-purple-700 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Achievements
            </h2>
            <p className="text-gray-500 text-center py-8">Coming soon! 🏆</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 safe-bottom">
        <div className="max-w-4xl mx-auto flex items-center justify-around py-3">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentView === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setCurrentView('garden')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentView === 'garden' ? 'text-green-600 bg-green-50' : 'text-gray-400'
            }`}
          >
            <Sprout className="w-6 h-6" />
            <span className="text-xs font-medium">Taman</span>
          </button>

          <button
            onClick={() => setCurrentView('chat')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentView === 'chat' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium">Chat</span>
          </button>

          <button
            onClick={() => setCurrentView('achievements')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentView === 'achievements' ? 'text-amber-600 bg-amber-50' : 'text-gray-400'
            }`}
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs font-medium">Trophy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
