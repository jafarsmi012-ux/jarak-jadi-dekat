import { Heart, Zap, UtensilsCrossed, Droplets, Activity } from 'lucide-react';
import type { LifePlayer } from '@/types/life';
import { getMoodEmoji, getStatusColor } from '@/types/life';

interface StatusBarsProps {
  player: LifePlayer;
  isCurrentPlayer: boolean;
}

export default function StatusBars({ player, isCurrentPlayer }: StatusBarsProps) {
  const getBarColor = (value: number) => {
    if (value >= 70) return 'from-green-400 to-green-500';
    if (value >= 40) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  const statusBars = [
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Kesehatan',
      value: player.health,
      emoji: '❤️',
      color: getBarColor(player.health),
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Energi',
      value: player.energy,
      emoji: '⚡',
      color: getBarColor(player.energy),
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5" />,
      label: 'Lapar',
      value: player.hunger,
      emoji: '🍽️',
      color: getBarColor(player.hunger),
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: 'Hidrasi',
      value: player.hydration,
      emoji: '💧',
      color: getBarColor(player.hydration),
    },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-purple-200">
      {/* Player Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-purple-100">
        <div className="text-6xl">{player.avatar}</div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-purple-700">{player.name}</h2>
          <p className="text-sm text-gray-500">{player.city}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${player.is_online ? 'bg-green-500' : 'bg-gray-300'} animate-pulse`} />
            <span className="text-xs text-gray-500">
              {player.is_online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Mood & Activity */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Mood</span>
          <span className="text-3xl">{getMoodEmoji(player.mood)}</span>
        </div>
        {player.current_activity && (
          <div className="text-sm text-purple-600 font-medium mt-2">
            Sedang: {player.current_activity}
          </div>
        )}
        {player.is_sleeping && (
          <div className="text-sm text-blue-600 font-medium mt-2 flex items-center gap-2">
            <span className="animate-pulse">💤</span>
            Sedang tidur
          </div>
        )}
        {player.is_sick && (
          <div className="text-sm text-red-600 font-medium mt-2 flex items-center gap-2">
            <span>🤒</span>
            Sedang sakit
          </div>
        )}
      </div>

      {/* Status Bars */}
      <div className="space-y-4">
        {statusBars.map((status, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{status.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{status.label}</span>
              </div>
              <span className="text-sm font-bold text-gray-700">{status.value}%</span>
            </div>
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${status.color} transition-all duration-500 rounded-full`}
                style={{ width: `${status.value}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            
            {/* Warning messages */}
            {status.value < 30 && (
              <div className="mt-1 text-xs text-red-500 font-medium">
                {status.label} sangat rendah! ⚠️
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Medicine Reminder */}
      {player.needs_medicine && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💊</span>
            <div>
              <div className="font-bold text-red-700">Waktunya Minum Obat!</div>
              <div className="text-sm text-red-600">
                Jangan lupa ya {isCurrentPlayer ? '' : player.name}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Low Stats Warning */}
      {(player.hunger < 30 || player.hydration < 30 || player.energy < 20) && !player.is_sleeping && (
        <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
          <div className="text-sm font-medium text-yellow-800">
            💡 Tips: {player.hunger < 30 && 'Makan dulu yuk! '}
            {player.hydration < 30 && 'Minum air putih! '}
            {player.energy < 20 && 'Istirahat dulu! '}
          </div>
        </div>
      )}
    </div>
  );
}
