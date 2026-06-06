"use client";

import { calculateLoveMeter } from '@/lib/utils';
import { Reaction } from '@/types';
import { Heart } from 'lucide-react';

interface LoveMeterProps {
  reactions: Reaction[];
}

export default function LoveMeter({ reactions }: LoveMeterProps) {
  const percentage = calculateLoveMeter(reactions);

  const getMessage = (pct: number): string => {
    if (pct === 0) return 'Mulai bermain untuk isi Love Meter 💕';
    if (pct < 25) return 'Aww, masih awal-awal nih 🌱';
    if (pct < 50) return 'Semakin hangat! 🔥';
    if (pct < 75) return 'Bikin baper nih 💘';
    if (pct < 90) return 'Romantis banget! 💖';
    return 'Love Meter penuh! Cinta sejati 💕✨';
  };

  const getHearts = (pct: number): number => {
    if (pct === 0) return 0;
    if (pct < 25) return 1;
    if (pct < 50) return 2;
    if (pct < 75) return 3;
    if (pct < 90) return 4;
    return 5;
  };

  const hearts = getHearts(percentage);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-rose-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-rose-700 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 animate-heart-beat" />
          Love Meter
        </h3>
        <span className="text-2xl font-bold text-rose-500">{percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-4 bg-rose-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-rose-400 via-lavender-400 to-gold-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Hearts */}
      <div className="flex justify-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Heart
            key={i}
            className={`w-6 h-6 transition-all duration-500 ${
              i <= hearts
                ? 'text-rose-500 fill-rose-500 animate-heart-beat'
                : 'text-rose-200'
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>

      <p className="text-center text-sm text-rose-500 font-medium">
        {getMessage(percentage)}
      </p>

      <p className="text-center text-xs text-gray-400 mt-2">
        Total reaksi: {reactions.length}
      </p>
    </div>
  );
}
