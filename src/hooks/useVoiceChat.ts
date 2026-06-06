"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;

export function useVoiceChat(roomCode: string, myName: string) {
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const agoraClientRef = useRef<any>(null);
  const localAudioTrackRef = useRef<any>(null);

  const isAgoraAvailable = !!AGORA_APP_ID && AGORA_APP_ID !== 'your-agora-app-id';

  const joinChannel = useCallback(async () => {
    if (!isAgoraAvailable) {
      setError('Voice chat belum aktif, isi AGORA APP ID dulu.');
      return;
    }

    if (!roomCode) return;

    setIsLoading(true);
    setError(null);

    try {
      // Dynamic import Agora SDK
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      agoraClientRef.current = client;

      // Listen for remote users
      client.on('user-published', async (user: any, mediaType: string) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
        setRemoteUsers((prev) => [...prev.filter(u => u !== user.uid), user.uid]);
      });

      client.on('user-unpublished', (user: any) => {
        setRemoteUsers((prev) => prev.filter(u => u !== user.uid));
      });

      // Join channel
      await client.join(AGORA_APP_ID!, roomCode, null, myName);

      // Create and publish local audio
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localAudioTrackRef.current = localAudioTrack;
      await client.publish([localAudioTrack]);

      setIsJoined(true);
    } catch (err: any) {
      console.error('Agora error:', err);
      setError(err.message || 'Gagal bergabung ke voice chat');
    } finally {
      setIsLoading(false);
    }
  }, [roomCode, myName, isAgoraAvailable]);

  const leaveChannel = useCallback(async () => {
    try {
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
      if (agoraClientRef.current) {
        await agoraClientRef.current.leave();
        agoraClientRef.current = null;
      }
      setIsJoined(false);
      setRemoteUsers([]);
      setIsMuted(false);
    } catch (err) {
      console.error('Error leaving channel:', err);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (localAudioTrackRef.current) {
      if (isMuted) {
        localAudioTrackRef.current.setEnabled(true);
      } else {
        localAudioTrackRef.current.setEnabled(false);
      }
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveChannel();
    };
  }, [leaveChannel]);

  return {
    isJoined,
    isMuted,
    isLoading,
    remoteUsers,
    error,
    isAgoraAvailable,
    joinChannel,
    leaveChannel,
    toggleMute,
  };
}
