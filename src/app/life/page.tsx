"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import type { LifePlayer, PlayerName, RelationshipStats } from '@/types/life';
import * as lifeApi from '@/lib/lifeApi';
import { supabase } from '@/lib/supabase';
import StatusBars from '@/components/life/StatusBars';
import PartnerStatus from '@/components/life/PartnerStatus';
import ActivityPanel from '@/components/life/ActivityPanel';
import CarePanel from '@/components/life/CarePanel';
import ChatPanel from '@/components/life/ChatPanel';
import RelationshipHeader from '@/components/life/RelationshipHeader';

function LifeGameContent() {
  const router = useRouter();
  const [currentPlayer, setCurrentPlayer] = useState<LifePlayer | null>(null);
  const [partner, setPartner] = useState<LifePlayer | null>(null);
  const [relationshipStats, setRelationshipStats] = useState<RelationshipStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'care' | 'chat'>('home');

  useEffect(() => {
    initializeGame();
  }, []);

  async function initializeGame() {
    // Check who is logged in
    const playerName = localStorage.getItem('current_player') as PlayerName;
    
    if (!playerName || (playerName !== 'Tedi' && playerName !== 'Airin')) {
      router.push('/');
      return;
    }

    // Load player data
    const player = await lifeApi.getPlayer(playerName);
    if (!player) {
      console.error('Player not found');
      return;
    }

    // Set player online
    await lifeApi.updatePlayerOnlineStatus(playerName, true);
    setCurrentPlayer(player);

    // Load partner
    const partnerName: PlayerName = playerName === 'Tedi' ? 'Airin' : 'Tedi';
    const partnerData = await lifeApi.getPlayer(partnerName);
    setPartner(partnerData);

    // Load relationship stats
    const stats = await lifeApi.getRelationshipStats();
    setRelationshipStats(stats);

    // Subscribe to real-time updates
    subscribeToUpdates(playerName, partnerName);

    setLoading(false);
  }

  function subscribeToUpdates(playerName: PlayerName, partnerName: PlayerName) {
    // Subscribe to player updates
    const playerChannel = supabase
      .channel(`player_${playerName}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'life_players',
          filter: `name=eq.${playerName}`,
        },
        (payload) => {
          setCurrentPlayer(payload.new as LifePlayer);
        }
      )
      .subscribe();

    // Subscribe to partner updates
    const partnerChannel = supabase
      .channel(`player_${partnerName}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'life_players',
          filter: `name=eq.${partnerName}`,
        },
        (payload) => {
          setPartner(payload.new as LifePlayer);
        }
      )
      .subscribe();

    // Subscribe to relationship stats
    const statsChannel = supabase
      .channel('relationship_stats')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'relationship_stats',
        },
        (payload) => {
          setRelationshipStats(payload.new as RelationshipStats);
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(playerChannel);
      supabase.removeChannel(partnerChannel);
      supabase.removeChannel(statsChannel);
    };
  }

  // Set player offline when leaving
  useEffect(() => {
    return () => {
      if (currentPlayer) {
        lifeApi.updatePlayerOnlineStatus(currentPlayer.name as PlayerName, false);
      }
    };
  }, [currentPlayer]);

  if (loading || !currentPlayer || !partner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">💕</div>
          <p className="text-purple-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header - Relationship Stats */}
      <RelationshipHeader stats={relationshipStats} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left - Current Player Status */}
          <div className="lg:col-span-1">
            <StatusBars 
              player={currentPlayer} 
              isCurrentPlayer={true}
            />
          </div>

          {/* Middle - Activity/Care/Chat Panel */}
          <div className="lg:col-span-1">
            {currentView === 'home' && (
              <ActivityPanel 
                currentPlayer={currentPlayer}
                partner={partner}
              />
            )}
            {currentView === 'care' && (
              <CarePanel 
                currentPlayer={currentPlayer}
                partner={partner}
              />
            )}
            {currentView === 'chat' && (
              <ChatPanel 
                currentPlayer={currentPlayer}
                partner={partner}
              />
            )}
          </div>

          {/* Right - Partner Status */}
          <div className="lg:col-span-1">
            <PartnerStatus 
              player={partner}
              currentPlayerName={currentPlayer.name as PlayerName}
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-200 shadow-lg safe-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                currentView === 'home' 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'text-gray-400 hover:text-purple-600'
              }`}
            >
              <span className="text-2xl">🏠</span>
              <span className="text-xs font-medium">Aktivitas</span>
            </button>

            <button
              onClick={() => setCurrentView('care')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                currentView === 'care' 
                  ? 'bg-pink-100 text-pink-600' 
                  : 'text-gray-400 hover:text-pink-600'
              }`}
            >
              <span className="text-2xl">💝</span>
              <span className="text-xs font-medium">Perhatian</span>
            </button>

            <button
              onClick={() => setCurrentView('chat')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                currentView === 'chat' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-blue-600'
              }`}
            >
              <span className="text-2xl">💬</span>
              <span className="text-xs font-medium">Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LifeGame() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">💕</div>
          <p className="text-purple-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <LifeGameContent />
    </Suspense>
  );
}
