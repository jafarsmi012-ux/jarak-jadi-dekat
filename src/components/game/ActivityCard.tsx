import { Zap, Coins } from 'lucide-react';
import type { ActivityDefinition } from '@/types/game';

interface ActivityCardProps {
  activity: ActivityDefinition;
  onStart: () => void;
  canAfford: boolean;
}

export default function ActivityCard({ activity, onStart, canAfford }: ActivityCardProps) {
  return (
    <button
      onClick={onStart}
      disabled={!canAfford}
      className={`p-4 rounded-xl border-2 text-left transition-all ${
        canAfford
          ? 'bg-white border-purple-200 hover:border-purple-400 hover:shadow-lg hover:scale-105 active:scale-100'
          : 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
      }`}
    >
      <div className="text-3xl mb-2">{activity.icon}</div>
      <div className="font-bold text-gray-800 text-sm mb-1">{activity.name}</div>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{activity.description}</p>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-yellow-600">
            <Zap className="w-3 h-3" />
            -{activity.energy_cost}
          </span>
          <span className="flex items-center gap-1 text-amber-600">
            <Coins className="w-3 h-3" />
            +{activity.coins_reward}
          </span>
        </div>
        <span className="text-purple-600 font-medium">+{activity.points_reward} XP</span>
      </div>

      {!canAfford && (
        <div className="mt-2 text-xs text-red-500 font-medium">
          Energy tidak cukup
        </div>
      )}
    </button>
  );
}
