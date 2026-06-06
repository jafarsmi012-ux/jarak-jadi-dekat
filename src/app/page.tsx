"use client";

import { useState } from 'react';
import CreateRoomForm from '@/components/CreateRoomForm';
import JoinRoomForm from '@/components/JoinRoomForm';
import { Heart, Sparkles, MapPin, Gamepad2 } from 'lucide-react';

export default function Home() {
  const [mode, setMode] = useState<'landing' | 'create' | 'join'>('landing');

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-cream-100">
      {/* Floating hearts background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-rose-200 text-4xl animate-float" style={{ animationDelay: '0s' }}>💕</div>
        <div className="absolute top-20 right-20 text-lavender-200 text-3xl animate-float" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-32 left-20 text-gold-200 text-5xl animate-float" style={{ animationDelay: '2s' }}>💝</div>
        <div className="absolute top-1/2 right-10 text-rose-200 text-2xl animate-float" style={{ animationDelay: '1.5s' }}>🌙</div>
        <div className="absolute bottom-20 right-1/3 text-lavender-200 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>💫</div>
      </div>

      <div className="relative max-w-md mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-300 to-lavender-300 shadow-xl mb-4 animate-pulse-slow">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-lavender-600 to-rose-600 bg-clip-text text-transparent mb-2">
            Jarak Jadi Dekat
          </h1>

          <p className="text-rose-500 text-sm mb-3">
            Game kecil untuk Airin & Tedi supaya LDR terasa lebih dekat.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-rose-100 shadow-sm">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-medium text-rose-600">Padang</span>
            <span className="text-rose-300">↔</span>
            <span className="text-sm font-medium text-lavender-600">Bandung</span>
            <MapPin className="w-4 h-4 text-lavender-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {mode === 'landing' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-rose-100 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <Gamepad2 className="w-6 h-6 text-rose-400 mt-0.5" />
                  <div>
                    <h2 className="font-bold text-gray-800 mb-1">Cara Main</h2>
                    <ol className="text-sm text-gray-600 space-y-1.5 list-decimal list-inside">
                      <li>Salah satu buat room dan kasih kode ke pasangan</li>
                      <li>Pasangan masuk pakai kode room</li>
                      <li>Ambil kartu pertanyaan dan jawab dengan tulus</li>
                      <li>Kasih reaksi ❤️😂🥺🔥 ke jawaban pasangan</li>
                      <li>Isi Love Meter sampai penuh!</li>
                    </ol>
                  </div>
                </div>

                <div className="border-t border-rose-100 pt-4">
                  <p className="text-sm text-rose-500 italic text-center">
                    "Walau jauh, malam ini kita main di ruang yang sama."
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMode('create')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 to-rose-500 text-white font-semibold text-lg shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Buat Room
              </button>

              <button
                onClick={() => setMode('join')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-lavender-400 to-lavender-500 text-white font-semibold text-lg shadow-lg shadow-lavender-200 hover:shadow-xl hover:shadow-lavender-300 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Masuk Room
              </button>
            </div>
          )}

          {mode === 'create' && (
            <div className="animate-slide-up">
              <button
                onClick={() => setMode('landing')}
                className="text-sm text-rose-500 hover:text-rose-700 mb-4 flex items-center gap-1"
              >
                ← Kembali
              </button>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-rose-100">
                <h2 className="text-xl font-bold text-rose-700 mb-1">Buat Room Baru</h2>
                <p className="text-sm text-rose-400 mb-5">Jadilah yang pertama masuk!</p>
                <CreateRoomForm />
              </div>
            </div>
          )}

          {mode === 'join' && (
            <div className="animate-slide-up">
              <button
                onClick={() => setMode('landing')}
                className="text-sm text-lavender-500 hover:text-lavender-700 mb-4 flex items-center gap-1"
              >
                ← Kembali
              </button>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-lavender-100">
                <h2 className="text-xl font-bold text-lavender-700 mb-1">Masuk Room</h2>
                <p className="text-sm text-lavender-400 mb-5">Gabung ke room yang sudah dibuat!</p>
                <JoinRoomForm />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-xs text-rose-300">
            Dibuat dengan 💕 untuk Airin & Tedi
          </p>
          <p className="text-xs text-rose-200 mt-1">
            Padang ↔ Bandung
          </p>
        </div>
      </div>
    </main>
  );
}
