"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, createRoom } from '@/lib/supabase';
import { Heart, Sparkles, MapPin } from 'lucide-react';

export default function CreateRoomForm() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 3; i++) code += chars[Math.floor(Math.random() * chars.length)];
    code += '-';
    for (let i = 0; i < 3; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setRoomCode(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !roomCode.trim()) {
      setError('Semua field harus diisi ya sayang 💕');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const room = await createRoom(roomCode.toUpperCase());
      if (!room) {
        setError('Gagal membuat room, coba lagi ya');
        setIsLoading(false);
        return;
      }

      const { error: joinError } = await supabase
        .from('players')
        .insert({ room_id: room.id, name: name.trim(), city: city.trim() });

      if (joinError) {
        setError('Gagal bergabung ke room');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('playerName', name.trim());
      localStorage.setItem('playerCity', city.trim());
      router.push(`/room/${roomCode.toUpperCase()}`);
    } catch (err) {
      setError('Terjadi kesalahan, coba lagi ya');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-rose-700 mb-2">
          Nama Kamu
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Airin"
          className="w-full px-4 py-3 rounded-2xl border-2 border-rose-200 bg-white/80 focus:border-rose-400 focus:outline-none transition-all text-rose-800 placeholder-rose-300"
          maxLength={20}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-rose-700 mb-2">
          Kota Kamu
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Contoh: Padang"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-rose-200 bg-white/80 focus:border-rose-400 focus:outline-none transition-all text-rose-800 placeholder-rose-300"
            maxLength={30}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-rose-700 mb-2">
          Kode Room
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="AIRIN-TEDI"
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-rose-200 bg-white/80 focus:border-rose-400 focus:outline-none transition-all text-rose-800 placeholder-rose-300 uppercase tracking-wider font-mono"
            maxLength={10}
          />
          <button
            type="button"
            onClick={generateCode}
            className="px-4 py-3 rounded-2xl bg-lavender-100 text-lavender-700 hover:bg-lavender-200 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 inline mr-1" />
            Acak
          </button>
        </div>
        <p className="text-xs text-rose-400 mt-1">
          Kasih tahu kode ini ke pasanganmu ya 💌
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 to-rose-500 text-white font-semibold text-lg shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            Buat Room
          </>
        )}
      </button>
    </form>
  );
}
