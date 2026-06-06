"use client";

import { useState } from 'react';
import { Heart, Sparkles, Home as HomeIcon, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [coupleCode, setCoupleCode] = useState('');

  const handleCreateNew = () => {
    // Generate random couple code
    const code = Array.from({ length: 6 }, () => 
      'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]
    ).join('');
    window.location.href = `/game?code=${code}&create=true`;
  };

  const handleJoin = () => {
    if (coupleCode.trim()) {
      window.location.href = `/game?code=${coupleCode.toUpperCase()}`;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Floating decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-200 text-4xl animate-float" style={{ animationDelay: '0s' }}>🏠</div>
        <div className="absolute top-20 right-20 text-purple-200 text-3xl animate-float" style={{ animationDelay: '1s' }}>💑</div>
        <div className="absolute bottom-32 left-20 text-blue-200 text-5xl animate-float" style={{ animationDelay: '2s' }}>💕</div>
        <div className="absolute top-1/2 right-10 text-pink-200 text-2xl animate-float" style={{ animationDelay: '1.5s' }}>🌸</div>
        <div className="absolute bottom-20 right-1/3 text-purple-200 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>✨</div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 shadow-xl mb-4 animate-pulse-slow">
            <HomeIcon className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Virtual Together
          </h1>

          <p className="text-purple-600 text-lg mb-2 font-medium">
            Harvest Moon Style untuk Pasangan LDR
          </p>

          <p className="text-gray-600 text-sm max-w-lg mx-auto">
            Jalanin hari-hari virtual bareng pasangan. Masak, nonton, ngobrol, dan bangun relationship level kalian! 🏡💕
          </p>
        </div>

        {/* Content */}
        <div className="flex-1">
          {!showJoinForm ? (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-purple-100 mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-8 h-8 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800 text-xl mb-2">Cara Main</h2>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">1.</span>
                        <span>Salah satu buat couple baru dan share kode ke pasangan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">2.</span>
                        <span>Pasangan join pakai kode yang sama</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">3.</span>
                        <span>Lakuin aktivitas harian: masak, nonton, ngobrol, rawat taman</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">4.</span>
                        <span>Naikin relationship level dan unlock achievements!</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center text-sm mb-4">
                  <div className="bg-pink-50 rounded-xl p-3">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="font-semibold text-gray-700">Energy System</div>
                    <div className="text-xs text-gray-500">Refill tiap hari</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <div className="text-2xl mb-1">🪙</div>
                    <div className="font-semibold text-gray-700">Coins & Shop</div>
                    <div className="text-xs text-gray-500">Beli item & upgrade</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="text-2xl mb-1">🌱</div>
                    <div className="font-semibold text-gray-700">Garden</div>
                    <div className="text-xs text-gray-500">Tanam & panen</div>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-3">
                    <div className="text-2xl mb-1">💝</div>
                    <div className="font-semibold text-gray-700">Level Up</div>
                    <div className="text-xs text-gray-500">Relationship points</div>
                  </div>
                </div>

                <div className="border-t border-purple-100 pt-4">
                  <p className="text-sm text-purple-500 italic text-center">
                    "Walau jauh, rasanya kayak tinggal bareng" 💕
                  </p>
                </div>
              </div>

              <button
                onClick={handleCreateNew}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xl shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6" />
                Buat Couple Baru
              </button>

              <button
                onClick={() => setShowJoinForm(true)}
                className="w-full py-5 rounded-2xl bg-white text-purple-600 font-bold text-xl shadow-lg border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <Users className="w-6 h-6" />
                Join Pakai Kode
              </button>
            </div>
          ) : (
            <div className="animate-slide-up">
              <button
                onClick={() => setShowJoinForm(false)}
                className="text-sm text-purple-500 hover:text-purple-700 mb-4 flex items-center gap-1"
              >
                ← Kembali
              </button>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-purple-100">
                <h2 className="text-2xl font-bold text-purple-700 mb-2">Join Couple</h2>
                <p className="text-sm text-purple-400 mb-6">Masukkan kode dari pasangan kamu</p>
                
                <input
                  type="text"
                  placeholder="Masukkan kode (contoh: ABC123)"
                  value={coupleCode}
                  onChange={(e) => setCoupleCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none mb-4 text-center text-lg font-mono uppercase"
                  maxLength={6}
                />

                <button
                  onClick={handleJoin}
                  disabled={coupleCode.length < 6}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                >
                  Join Sekarang
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-xs text-purple-300">
            Dibuat dengan 💕 untuk pasangan LDR
          </p>
          <p className="text-xs text-purple-200 mt-1">
            Virtual Together v1.0
          </p>
        </div>
      </div>
    </main>
  );
}
