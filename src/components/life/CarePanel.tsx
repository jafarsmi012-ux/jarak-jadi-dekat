import { useState, useEffect } from 'react';
import type { LifePlayer, PlayerName, CareType, CareAction } from '@/types/life';
import { CARE_ACTIONS } from '@/types/life';
import * as lifeApi from '@/lib/lifeApi';
import { supabase } from '@/lib/supabase';

interface CarePanelProps {
  currentPlayer: LifePlayer;
  partner: LifePlayer;
}

export default function CarePanel({ currentPlayer, partner }: CarePanelProps) {
  const [unreadCare, setUnreadCare] = useState<CareAction[]>([]);
  const [recentCare, setRecentCare] = useState<CareAction[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [selectedCare, setSelectedCare] = useState<CareType | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    loadCareActions();
    const cleanup = subscribeToCareActions();
    return cleanup;
  }, [currentPlayer.name]);

  async function loadCareActions() {
    const unread = await lifeApi.getUnreadCareActions(currentPlayer.name as PlayerName);
    setUnreadCare(unread);

    const recent = await lifeApi.getRecentCareActions(20);
    setRecentCare(recent);
  }

  function subscribeToCareActions() {
    const channel = supabase.channel('care_feed');
    
    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'care_actions',
        },
        (payload) => {
          const newCare = payload.new as CareAction;
          
          // Add to recent
          setRecentCare((prev) => [newCare, ...prev].slice(0, 20));
          
          // If it's for current player, add to unread
          if (newCare.to_player === currentPlayer.name) {
            setUnreadCare((prev) => [newCare, ...prev]);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  async function sendCare(careType: CareType) {
    if (isSending) return;

    const care = CARE_ACTIONS[careType];
    if (!care) return;

    setIsSending(true);
    setSelectedCare(careType);

    try {
      await lifeApi.sendCareAction(
        currentPlayer.name as PlayerName,
        partner.name as PlayerName,
        careType,
        care.message_template
      );

      await lifeApi.addIntimacyPoints(care.intimacy_points);

      // Show success animation
      setTimeout(() => {
        setSelectedCare(null);
      }, 1000);
    } catch (error) {
      console.error('Error sending care:', error);
    } finally {
      setIsSending(false);
    }
  }

  async function markAsRead(careId: string) {
    await lifeApi.markCareActionAsRead(careId);
    setUnreadCare((prev) => prev.filter((c) => c.id !== careId));
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200 max-h-[calc(100vh-12rem)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-4 flex items-center gap-2">
        <span>💝</span>
        Kasih Perhatian
      </h2>

      {/* Notification */}
      {showNotification && unreadCare.length > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-pink-100 border-2 border-pink-300 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💕</span>
            <div>
              <div className="font-bold text-pink-700">Perhatian Baru!</div>
              <div className="text-sm text-pink-600">
                {partner.name} mengirim perhatian untukmu
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unread Care Actions */}
      {unreadCare.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCare.length}
            </span>
            Belum Dibaca
          </h3>
          <div className="space-y-2">
            {unreadCare.map((care) => {
              const careDef = CARE_ACTIONS[care.care_type];
              const time = new Date(care.created_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={care.id}
                  onClick={() => markAsRead(care.id)}
                  className="p-4 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-300 cursor-pointer hover:border-pink-400 transition-all active:scale-95"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{careDef?.emoji || '💝'}</span>
                    <div className="flex-1">
                      <div className="font-bold text-pink-700">
                        {care.from_player} → {careDef?.name || care.care_type}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        {care.message || careDef?.message_template}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{time}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Send Care Actions */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">
          Kirim ke {partner.name}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(CARE_ACTIONS).map((care) => {
            const isSelected = selectedCare === care.type;

            return (
              <button
                key={care.type}
                onClick={() => sendCare(care.type)}
                disabled={isSending || !partner.is_online}
                className={`relative p-4 rounded-xl transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-br from-pink-300 to-purple-300 border-2 border-pink-400 shadow-lg scale-105'
                    : partner.is_online
                    ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 hover:border-pink-300 hover:shadow-lg'
                    : 'bg-gray-100 border-2 border-gray-200 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-4xl mb-2">{care.emoji}</div>
                <div className="text-sm font-bold text-gray-800 mb-1 leading-tight">
                  {care.name}
                </div>
                <div className="text-xs text-purple-600 font-medium">
                  +{care.intimacy_points} ❤️
                </div>
                
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-pink-400/20 rounded-xl">
                    <div className="text-4xl animate-ping">💕</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {!partner.is_online && (
        <div className="mb-4 p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            {partner.name} sedang offline. Perhatian akan dikirim saat online.
          </p>
        </div>
      )}

      {/* Recent Care History */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3">💌 Riwayat Perhatian</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {recentCare.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Belum ada perhatian yang diberikan
            </p>
          ) : (
            recentCare.map((care) => {
              const careDef = CARE_ACTIONS[care.care_type];
              const time = new Date(care.created_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const isFromCurrent = care.from_player === currentPlayer.name;

              return (
                <div
                  key={care.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isFromCurrent
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-pink-50 border-pink-200'
                  }`}
                >
                  <span className="text-2xl">{careDef?.emoji || '💝'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">
                      {care.from_player} → {care.to_player}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {careDef?.name || care.care_type}
                    </div>
                    <div className="text-xs text-gray-500">{time}</div>
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    +{careDef?.intimacy_points || 0} ❤️
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
