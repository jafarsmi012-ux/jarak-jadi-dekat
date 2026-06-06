"use client";

import { Player } from '@/types';
import { Heart, MapPin, User, Wifi } from 'lucide-react';

interface PlayerStatusProps {
  players: Player[];
  currentTurn: string;
  myName: string;
}

export default function PlayerStatus({ players, currentTurn, myName }: PlayerStatusProps) {
  const isWaiting = players.length < 2;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-rose-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-rose-700 flex items-center gap-2">
          <User className="w-5 h-5" />
          Pemain
        </h3>
        <div className="flex items-center gap-1 text-xs text-rose-400">
          <Wifi className="w-3 h-3" />
          <span>Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {players.map((player, index) => {
          const isCurrentTurn = currentTurn === player.name;
          const isMe = player.name === myName;

          return (
            <div
              key={player.id}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                isCurrentTurn
                  ? 'bg-gradient-to-r from-rose-50 to-lavender-50 border-2 border-rose-300 shadow-md'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                index === 0 
                  ? 'bg-rose-100 text-rose-600' 
                  : 'bg-lavender-100 text-lavender-600'
              }`}>
                {player.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 truncate">
                    {player.name}
                    {isMe && (
                      <span className="text-xs text-rose-400 ml-1">(Kamu)</span>
                    )}
                  </span>
                  {isCurrentTurn && (
                    <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-medium animate-pulse">
                      Giliran
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {player.city}
                </div>
              </div>

              {isCurrentTurn && (
                <Heart className="w-5 h-5 text-rose-400 animate-heart-beat" />
              )}
            </div>
          );
        })}

        {isWaiting && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <div className="animate-bounce text-2xl mb-2">⏳</div>
            <p className="text-sm text-amber-700 font-medium">
              Menunggu pasanganmu join...
            </p>
            <p className="text-xs text-amber-500 mt-1">
              Kirim kode room ke pasanganmu ya 💕
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
