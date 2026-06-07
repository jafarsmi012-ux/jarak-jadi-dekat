import { useState, useEffect } from 'react';
import type { LifePlayer, PlayerName, ActivityType, LifeActivity } from '@/types/life';
import { ACTIVITIES, getTimeOfDay } from '@/types/life';
import * as lifeApi from '@/lib/lifeApi';
import { supabase } from '@/lib/supabase';

interface ActivityPanelProps {
  currentPlayer: LifePlayer;
  partner: LifePlayer;
}

export default function ActivityPanel({ currentPlayer, partner }: ActivityPanelProps) {
  const [recentActivities, setRecentActivities] = useState<LifeActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    loadRecentActivities();
    subscribeToActivities();
  }, []);

  async function loadRecentActivities() {
    const activities = await lifeApi.getTodayActivities();
    setRecentActivities(activities.slice(0, 10));
  }

  function subscribeToActivities() {
    const channel = supabase
      .channel('activities_feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'life_activities',
        },
        (payload) => {
          setRecentActivities((prev) => [payload.new as LifeActivity, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  const currentTime = getTimeOfDay();

  const availableActivities = Object.values(ACTIVITIES).filter((activity) => {
    // Filter by time of day
    if (activity.time_of_day && activity.time_of_day !== 'anytime') {
      if (activity.time_of_day !== currentTime) {
        return false;
      }
    }

    // Don't show sleep if player is sleeping
    if (activity.type === 'sleep' && currentPlayer.is_sleeping) {
      return false;
    }

    // Don't show waking_up if player is not sleeping
    if (activity.type === 'waking_up' && !currentPlayer.is_sleeping) {
      return false;
    }

    // Don't show medicine if not needed
    if (activity.type === 'medicine' && !currentPlayer.needs_medicine) {
      return false;
    }

    return true;
  });

  async function executeActivity(activityType: ActivityType) {
    if (isExecuting || currentPlayer.is_sleeping) return;

    setIsExecuting(true);
    setSelectedActivity(activityType);

    const activity = ACTIVITIES[activityType];
    if (!activity) {
      setIsExecuting(false);
      return;
    }

    try {
      // Check if partner is also doing this activity (for together activities)
      const together = activity.requires_partner && partner.is_online;

      // Update player stats based on activity
      const updates: Partial<LifePlayer> = {
        current_activity: activity.name,
      };

      // Energy
      let newEnergy = currentPlayer.energy - activity.energy_cost;
      if (newEnergy < 0) newEnergy = 0;
      if (newEnergy > 100) newEnergy = 100;
      updates.energy = newEnergy;

      // Hunger
      if (activity.hunger_restore !== undefined) {
        let newHunger = currentPlayer.hunger + activity.hunger_restore;
        if (newHunger < 0) newHunger = 0;
        if (newHunger > 100) newHunger = 100;
        updates.hunger = newHunger;
        updates.last_meal_time = new Date().toISOString();
      }

      // Hydration
      if (activity.hydration_restore !== undefined) {
        let newHydration = currentPlayer.hydration + activity.hydration_restore;
        if (newHydration < 0) newHydration = 0;
        if (newHydration > 100) newHydration = 100;
        updates.hydration = newHydration;
      }

      // Health
      if (activity.health_impact !== undefined) {
        let newHealth = currentPlayer.health + activity.health_impact;
        if (newHealth < 0) newHealth = 0;
        if (newHealth > 100) newHealth = 100;
        updates.health = newHealth;
      }

      // Mood
      if (activity.mood_impact) {
        updates.mood = activity.mood_impact;
      }

      // Special handling for specific activities
      if (activityType === 'sleep') {
        updates.is_sleeping = true;
        updates.last_sleep_time = new Date().toISOString();
      } else if (activityType === 'waking_up') {
        updates.is_sleeping = false;
        updates.wakeup_time = new Date().toISOString();
        updates.current_activity = null;
      } else if (activityType === 'medicine') {
        updates.needs_medicine = false;
        updates.last_medicine_taken = new Date().toISOString();
      }

      // Update player status
      await lifeApi.updatePlayerStatus(currentPlayer.name as PlayerName, updates);

      // Log activity
      await lifeApi.logActivity(
        currentPlayer.name as PlayerName,
        activityType,
        { duration: activity.duration_minutes },
        together
      );

      // Add intimacy if doing together
      if (together) {
        await lifeApi.addIntimacyPoints(10);
      }

      // Send system message
      const activityMessage = together
        ? `${currentPlayer.name} dan ${partner.name} ${activity.name.toLowerCase()} bareng! ${activity.emoji}`
        : `${currentPlayer.name} ${activity.name.toLowerCase()} ${activity.emoji}`;

      await lifeApi.sendMessage(
        currentPlayer.name as PlayerName,
        partner.name as PlayerName,
        activityMessage,
        'system'
      );

      // Clear after some time
      if (activityType !== 'sleep') {
        setTimeout(async () => {
          await lifeApi.setPlayerActivity(currentPlayer.name as PlayerName, null);
        }, activity.duration_minutes * 1000); // Simulated duration
      }
    } catch (error) {
      console.error('Error executing activity:', error);
    } finally {
      setIsExecuting(false);
      setSelectedActivity(null);
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-blue-200 max-h-[calc(100vh-12rem)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
        <span>🏠</span>
        Aktivitas Hari Ini
      </h2>

      {/* Time of Day Indicator */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Waktu</span>
          <span className="text-lg font-bold text-blue-600">
            {getTimeLabel(currentTime)} {getTimeEmoji(currentTime)}
          </span>
        </div>
      </div>

      {/* Current Activity Status */}
      {currentPlayer.is_sleeping && (
        <div className="mb-4 p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
          <div className="text-center">
            <div className="text-4xl mb-2 animate-pulse">💤</div>
            <div className="font-bold text-blue-700">Kamu sedang tidur</div>
            <div className="text-sm text-blue-600 mt-1">Bangun dulu untuk beraktivitas</div>
          </div>
        </div>
      )}

      {/* Activity Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {availableActivities.map((activity) => {
          const canAfford = currentPlayer.energy >= activity.energy_cost;
          const isSelected = selectedActivity === activity.type;
          const isPartnerOnline = partner.is_online;
          const requiresPartner = activity.requires_partner;

          return (
            <button
              key={activity.type}
              onClick={() => executeActivity(activity.type)}
              disabled={!canAfford || isExecuting || currentPlayer.is_sleeping}
              className={`relative p-4 rounded-xl transition-all active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-200 to-pink-200 border-2 border-purple-400 shadow-lg'
                  : canAfford
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg'
                  : 'bg-gray-100 border-2 border-gray-200 opacity-50 cursor-not-allowed'
              }`}
            >
              {requiresPartner && (
                <div className="absolute top-1 right-1">
                  <span className={`text-xs ${isPartnerOnline ? '✅' : '⏸️'}`}>
                    {isPartnerOnline ? '👥' : '👤'}
                  </span>
                </div>
              )}
              
              <div className="text-4xl mb-2">{activity.emoji}</div>
              <div className="text-sm font-bold text-gray-800 mb-1 leading-tight">
                {activity.name}
              </div>
              <div className="text-xs text-gray-600 mb-2 leading-tight">
                {activity.description}
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                  ⚡ {activity.energy_cost}
                </span>
                <span className="text-gray-500">
                  {activity.duration_minutes}m
                </span>
              </div>

              {activity.hunger_restore && activity.hunger_restore > 0 && (
                <div className="text-xs text-green-600 mt-1">
                  +{activity.hunger_restore} 🍽️
                </div>
              )}
              {activity.hydration_restore && activity.hydration_restore > 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  +{activity.hydration_restore} 💧
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Recent Activities Feed */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3">📋 Aktivitas Terbaru</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentActivities.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Belum ada aktivitas hari ini
            </p>
          ) : (
            recentActivities.map((activity) => {
              const activityDef = ACTIVITIES[activity.activity_type];
              const time = new Date(activity.created_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <span className="text-2xl">{activityDef?.emoji || '✨'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {activity.player_name} - {activityDef?.name || activity.activity_type}
                    </div>
                    <div className="text-xs text-gray-500">{time}</div>
                  </div>
                  {activity.together && (
                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
                      Bareng 💕
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeLabel(time: string): string {
  const labels: Record<string, string> = {
    morning: 'Pagi',
    afternoon: 'Siang',
    evening: 'Sore',
    night: 'Malam',
  };
  return labels[time] || 'Siang';
}

function getTimeEmoji(time: string): string {
  const emojis: Record<string, string> = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌆',
    night: '🌙',
  };
  return emojis[time] || '☀️';
}
