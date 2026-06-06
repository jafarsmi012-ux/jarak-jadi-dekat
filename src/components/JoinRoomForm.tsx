"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Heart, MapPin, LogIn } from 'lucide-react';

export default function JoinRoomForm() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !roomCode.trim()) {
      setError('Semua field harus diisi ya sayang 💕');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const code = roomCode.toUpperCase().trim();

      // Check if room exists
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code)
        .single();

      if (roomError || !room) {
        setError('Room tidak ditemukan, cek kodenya lagi ya');
        setIsLoading(false);
        return;
      }

      // Check if room is full (max 2 players)
      const { data: existingPlayers } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', room.id);

      if (existingPlayers && existingPlayers.length >= 2) {
        setError('Room sudah penuh, coba room lain ya');
        setIsLoading(false);
        return;
      }

      // Check if name already exists in room
      const nameExists = existingPlayers?.some(p => p.name.toLowerCase() === name.trim().toLowerCase());
      if (nameExists) {
        setError('Nama sudah dipakai di room ini, coba nama lain ya');
        setIsLoading(false);
        return;
      }

      // Join room
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
      router.push(`/room/${code}`);
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
          placeholder="Contoh: Tedi"
          className="w-full px-4 py-3 rounded-2xl border-2 border-lavender-200 bg-white/80 focus:border-lavender-400 focus:outline-none transition-all text-lavender-800 placeholder-lavender-300"
          maxLength={20}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-rose-700 mb-2">
          Kota Kamu
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Contoh: Bandung"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-lavender-200 bg-white/80 focus:border-lavender-400 focus:outline-none transition-all text-lavender-800 placeholder-lavender-300"
            maxLength={30}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-rose-700 mb-2">
          Kode Room
        </label>
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          placeholder="Masukkan kode room"
          className="w-full px-4 py-3 rounded-2xl border-2 border-lavender-200 bg-white/80 focus:border-lavender-400 focus:outline-none transition-all text-lavender-800 placeholder-lavender-300 uppercase tracking-wider font-mono"
          maxLength={10}
        />
        <p className="text-xs text-lavender-400 mt-1">
          Minta kode room dari pasanganmu ya 💌
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
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-lavender-400 to-lavender-500 text-white font-semibold text-lg shadow-lg shadow-lavender-200 hover:shadow-xl hover:shadow-lavender-300 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            Masuk Room
          </>
        )}
      </button>
    </form>
  );
}
