"use client";

import { Reaction } from '@/types';
import { getReactionEmoji, getReactionLabel } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface ReactionBarProps {
  reactions: Reaction[];
  onReact: (reaction: string) => void;
  hasAnswered: boolean;
  isMyCard: boolean;
}

const REACTIONS = ['Romantis', 'Lucu', 'Kangen', 'Berani'];

export default function ReactionBar({ reactions, onReact, hasAnswered, isMyCard }: ReactionBarProps) {
  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r.reaction] = (acc[r.reaction] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!hasAnswered) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-400 italic">
          Tunggu jawaban dulu ya sebelum kasih reaksi 💕
        </p>
      </div>
    );
  }

  if (isMyCard) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-rose-600 font-medium text-center">
          Pasanganmu kasih reaksi:
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          {REACTIONS.map((reaction) => {
            const count = reactionCounts[reaction] || 0;
            if (count === 0) return null;
            return (
              <div
                key={reaction}
                className="flex items-center gap-1 px-3 py-2 rounded-full bg-rose-50 border border-rose-200 animate-bounce-slow"
              >
                <span className="text-lg">{getReactionEmoji(reaction)}</span>
                <span className="text-sm font-medium text-rose-700">
                  {getReactionLabel(reaction)}
                </span>
                <span className="text-xs bg-rose-200 text-rose-700 px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              </div>
            );
          })}
          {reactions.length === 0 && (
            <p className="text-sm text-gray-400">Belum ada reaksi nih...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-rose-600 font-medium text-center">
        Kasih reaksi ke jawaban pasanganmu:
      </p>
      <div className="flex justify-center gap-2 flex-wrap">
        {REACTIONS.map((reaction) => (
          <button
            key={reaction}
            onClick={() => onReact(reaction)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border-2 border-rose-100 hover:border-rose-300 hover:bg-rose-50 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <span className="text-lg">{getReactionEmoji(reaction)}</span>
            <span className="text-sm font-medium text-gray-700">
              {getReactionLabel(reaction)}
            </span>
          </button>
        ))}
      </div>

      {reactions.length > 0 && (
        <div className="flex justify-center gap-2 mt-2">
          {REACTIONS.map((reaction) => {
            const count = reactionCounts[reaction] || 0;
            if (count === 0) return null;
            return (
              <span
                key={reaction}
                className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full"
              >
                {getReactionEmoji(reaction)} {count}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
