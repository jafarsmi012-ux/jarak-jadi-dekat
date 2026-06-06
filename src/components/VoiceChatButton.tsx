"use client";

import { useVoiceChat } from '@/hooks/useVoiceChat';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, AlertCircle } from 'lucide-react';

interface VoiceChatButtonProps {
  roomCode: string;
  myName: string;
}

export default function VoiceChatButton({ roomCode, myName }: VoiceChatButtonProps) {
  const {
    isJoined,
    isMuted,
    isLoading,
    remoteUsers,
    error,
    isAgoraAvailable,
    joinChannel,
    leaveChannel,
    toggleMute,
  } = useVoiceChat(roomCode, myName);

  if (!isAgoraAvailable) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
        <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
        <p className="text-sm text-amber-700 font-medium">
          Voice chat belum aktif
        </p>
        <p className="text-xs text-amber-500 mt-1">
          Isi AGORA APP ID di .env.local dulu ya
        </p>
      </div>
    );
  }

  if (!isJoined) {
    return (
      <button
        onClick={joinChannel}
        disabled={isLoading}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <>
            <Phone className="w-5 h-5" />
            Join Voice Chat
          </>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-emerald-700">
            Voice Chat Aktif
          </span>
        </div>
        <span className="text-xs text-emerald-500">
          {remoteUsers.length > 0 ? `${remoteUsers.length} orang` : 'Menunggu...'}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggleMute}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
            isMuted
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
          }`}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {isMuted ? 'Bisukan' : 'Aktif'}
        </button>

        <button
          onClick={leaveChannel}
          className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center gap-2 text-sm font-medium transition-all"
        >
          <PhoneOff className="w-4 h-4" />
          Keluar
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
