"use client";

import { useState } from 'react';
import { Heart, MapPin, Sparkles } from 'lucide-react';

type Player = 'Tedi' | 'Airin' | null;

export default function Home() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(null);

  const handleSelectPlayer = (player: Player) => {
    if (player) {
      localStorage.setItem('current_player', player);
      window.location.href = '/life';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-300 text-6xl animate-float" style={{ animationDelay: '0s' }}>💕</div>
        <div className="absolute top-1/4 right-20 text-purple-300 text-5xl animate-float" style={{ animationDelay: '1.5s' }}>✨</div>
        <div className="absolute bottom-1/4 left-1/4 text-blue-300 text-7xl animate-float" style={{ animationDelay: '2s' }}>🏠</div>
        <div className="absolute top-1/2 right-1/3 text-pink-300 text-4xl animate-float" style={{ animationDelay: '0.8s' }}>🌸</div>
        <div className="absolute bottom-20 right-10 text-purple-300 text-6xl animate-float" style={{ animationDelay: '1.2s' }}>💑</div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 shadow-2xl mb-6 animate-pulse-slow">
            <Heart className="w-16 h-16 text-white fill-white" />
          </div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Tedi & Airin
          </h1>

          <p className="text-2xl text-purple-600 font-semibold mb-2">
            Living Together
          </p>

          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Simulasi kehidupan bersama walau jauh. Jalani hari-hari seperti tinggal bareng, saling merawat, dan merasa dekat.
          </p>

          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              <span className="font-bold text-pink-600">Bandung</span>
            </div>
            <div className="text-purple-400 text-2xl">💕</div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-600">Padang</span>
              <MapPin className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Player Selection */}
        {!selectedPlayer ? (
          <div className="w-full max-w-2xl animate-slide-up">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-200">
              <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
                Siapa kamu hari ini?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tedi Card */}
                <button
                  onClick={() => setSelectedPlayer('Tedi')}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-3 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-100"
                >
                  <div className="absolute top-4 right-4">
                    <Sparkles className="w-6 h-6 text-blue-400 group-hover:animate-spin" />
                  </div>
                  
                  <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">
                    👨
                  </div>
                  
                  <div className="text-2xl font-bold text-blue-700 mb-2">
                    Tedi
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-blue-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Bandung</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    "Aku siap merawat Airin hari ini 💙"
                  </div>
                </button>

                {/* Airin Card */}
                <button
                  onClick={() => setSelectedPlayer('Airin')}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border-3 border-pink-200 hover:border-pink-400 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-100"
                >
                  <div className="absolute top-4 right-4">
                    <Sparkles className="w-6 h-6 text-pink-400 group-hover:animate-spin" />
                  </div>
                  
                  <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">
                    👩
                  </div>
                  
                  <div className="text-2xl font-bold text-pink-700 mb-2">
                    Airin
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-pink-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Padang</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    "Aku siap merawat Tedi hari ini 💗"
                  </div>
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
              <h3 className="font-bold text-purple-700 mb-3 text-center">✨ Fitur Utama</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span>🌅</span>
                  <span>Rutinitas harian lengkap</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💊</span>
                  <span>Reminder minum obat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🍽️</span>
                  <span>Makan bareng virtual</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🤗</span>
                  <span>Saling merawat & perhatian</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💬</span>
                  <span>Real-time chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>😴</span>
                  <span>Tidur bareng</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-200">
              <div className="text-6xl mb-4">
                {selectedPlayer === 'Tedi' ? '👨' : '👩'}
              </div>
              <h2 className="text-2xl font-bold text-purple-700 mb-2">
                Selamat Datang, {selectedPlayer}!
              </h2>
              <p className="text-gray-600 mb-6">
                Siap memulai hari bersama? 💕
              </p>
              <button
                onClick={() => handleSelectPlayer(selectedPlayer)}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
              >
                Mulai Sekarang 🚀
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-purple-400">
          <p>💕 Dibuat dengan cinta untuk Tedi & Airin 💕</p>
          <p className="mt-1 text-xs">Bandung ↔ Padang | Always Connected</p>
        </div>
      </div>
    </main>
  );
}
