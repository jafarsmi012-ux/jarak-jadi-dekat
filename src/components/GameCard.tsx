"use client";

import { Card } from '@/types';
import { getCategoryColor, getCategoryIcon } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface GameCardProps {
  card: Card | null;
  isRevealed: boolean;
}

export default function GameCard({ card, isRevealed }: GameCardProps) {
  if (!isRevealed || !card) {
    return (
      <div className="relative w-full aspect-[3/4] max-w-sm mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-300 via-lavender-300 to-rose-200 rounded-3xl shadow-xl transform rotate-1" />
        <div className="absolute inset-0 bg-gradient-to-br from-lavender-300 via-rose-300 to-lavender-200 rounded-3xl shadow-xl transform -rotate-1" />
        <div className="relative h-full bg-gradient-to-br from-rose-50 to-lavender-50 rounded-3xl shadow-2xl border-2 border-white/50 flex flex-col items-center justify-center p-8">
          <div className="text-6xl mb-4 animate-pulse-slow">💕</div>
          <h3 className="text-xl font-bold text-rose-700 text-center mb-2">
            Kartu Pertanyaan
          </h3>
          <p className="text-sm text-rose-400 text-center">
            Ambil kartu untuk mulai bermain
          </p>
          <div className="mt-6 flex gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-300 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-lavender-300 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-rose-300 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto animate-fade-in">
      <div className="absolute -inset-1 bg-gradient-to-r from-rose-300 via-lavender-300 to-gold-300 rounded-3xl blur opacity-50" />
      <div className="relative bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
        {/* Header */}
        <div className={`px-5 py-3 border-b ${getCategoryColor(card.category)}`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{getCategoryIcon(card.category)}</span>
            <span className="font-semibold text-sm">{card.category}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[200px] flex items-center justify-center">
          <p className="text-lg text-gray-800 text-center leading-relaxed font-medium">
            {card.question}
          </p>
        </div>

        {/* Footer decoration */}
        <div className="px-5 py-3 bg-gradient-to-r from-rose-50 to-lavender-50 flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="text-xs text-rose-400">Jarak Jadi Dekat</span>
          <Sparkles className="w-4 h-4 text-gold-400" />
        </div>
      </div>
    </div>
  );
}
