import { Heart, Zap, UtensilsCrossed, Droplets } from 'lucide-react';
import type { LifePlayer, PlayerName, CareType } from '@/types/life';
import { getMoodEmoji } from '@/types/life';
import * as lifeApi from '@/lib/lifeApi';
import { CARE_ACTIONS } from '@/types/life';

interface PartnerStatusProps {
  player: LifePlayer;
  currentPlayerName: PlayerName;
}

export default function PartnerStatus({ player, currentPlayerName }: PartnerStatusProps) {
  const getBarColor = (value: number) => {
    if (value >= 70) return 'from-green-400 to-green-500';
    if (value >= 40) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  const statusBars = [
    {
      label: 'Kesehatan',
      value: player.health,
      emoji: '❤️',
      color: getBarColor(player.health),
    },
    {
      label: 'Energi',
      value: player.energy,
      emoji: '⚡',
      color: getBarColor(player.energy),
    },
    {
      label: 'Lapar',
      value: player.hunger,
      emoji: '🍽️',
      color: getBarColor(player.hunger),
    },
    {
      label: 'Hidrasi',
      value: player.hydration,
      emoji: '💧',
      color: getBarColor(player.hydration),
    },
  ];

  const quickCareActions: CareType[] = ['hug', 'kiss', 'flower', 'comfort'];

  const handleQuickCare = async (careType: CareType) => {
    const care = CARE_ACTIONS[careType];
    if (!care) return;

    await lifeApi.sendCareAction(
      currentPlayerName,
      player.name as PlayerName,
      careType,
      care.message_template
    );

    await lifeApi.addIntimacyPoints(care.intimacy_points);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
      {/* Partner Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-pink-100">
        <div className="text-6xl">{player.avatar}</div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-pink-600">{player.name}</h2>
          <p className="text-sm text-gray-500">{player.city}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${player.is_online ? 'bg-green-500' : 'bg-gray-300'} animate-pulse`} />
            <span className="text-xs text-gray-500">
              {player.is_online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Partner's Current State */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Mood</span>
          <span className="text-3xl">{getMoodEmoji(player.mood)}</span>
        </div>
        {player.current_activity && (
          <div className="text-sm text-pink-600 font-medium mt-2">
            Sedang: {player.current_activity}
          </div>
        )}
        {player.is_sleeping && (
          <div className="text-sm text-blue-600 font-medium mt-2 flex items-center gap-2">
            <span className="animate-pulse">💤</span>
            {player.name} sedang tidur
          </div>
        )}
        {player.is_sick && (
          <div className="text-sm text-red-600 font-medium mt-2 flex items-center gap-2">
            <span>🤒</span>
            {player.name} sedang sakit
          </div>
        )}
      </div>

      {/* Status Bars (Read-only) */}
      <div className="space-y-4 mb-6">
        {statusBars.map((status, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{status.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{status.label}</span>
              </div>
              <span className="text-sm font-bold text-gray-700">{status.value}%</span>
            </div>
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${status.color} transition-all duration-500 rounded-full`}
                style={{ width: `${status.value}%` }}
              >
                <div className="absolute inset-0 bg-white/20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Care Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-700 mb-3">💝 Kasih Perhatian</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickCareActions.map((careType) => {
            const care = CARE_ACTIONS[careType];
            if (!care) return null;
            
            return (
              <button
                key={careType}
                onClick={() => handleQuickCare(careType)}
                disabled={!player.is_online}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-200 hover:border-pink-300 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <span className="text-3xl">{care.emoji}</span>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {care.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Special Reminders when partner needs help */}
        {player.needs_medicine && (
          <button
            onClick={() => handleQuickCare('medicine_reminder')}
            className="w-full mt-3 p-4 rounded-xl bg-red-50 border-2 border-red-200 hover:border-red-300 hover:shadow-lg transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">💊</span>
              <div className="text-left">
                <div className="font-bold text-red-700">Ingetin Minum Obat</div>
                <div className="text-xs text-red-600">{player.name} butuh perhatianmu!</div>
              </div>
            </div>
          </button>
        )}

        {player.hunger < 30 && !player.is_sleeping && (
          <button
            onClick={() => handleQuickCare('meal_reminder')}
            className="w-full mt-2 p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200 hover:border-yellow-300 hover:shadow-lg transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍽️</span>
              <div className="text-left">
                <div className="font-bold text-yellow-700">Ingetin Makan</div>
                <div className="text-xs text-yellow-600">{player.name} belum makan!</div>
              </div>
            </div>
          </button>
        )}

        {player.is_sick && (
          <button
            onClick={() => handleQuickCare('comfort')}
            className="w-full mt-2 p-4 rounded-xl bg-purple-50 border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥰</span>
              <div className="text-left">
                <div className="font-bold text-purple-700">Hibur & Rawat</div>
                <div className="text-xs text-purple-600">{player.name} butuh kamu</div>
              </div>
            </div>
          </button>
        )}
      </div>

      {!player.is_online && (
        <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
          <p className="text-sm text-gray-500">{player.name} sedang offline</p>
        </div>
      )}
    </div>
  );
}
