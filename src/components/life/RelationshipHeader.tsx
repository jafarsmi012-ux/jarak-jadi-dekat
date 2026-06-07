import type { RelationshipStats } from '@/types/life';

interface RelationshipHeaderProps {
  stats: RelationshipStats | null;
}

export default function RelationshipHeader({ stats }: RelationshipHeaderProps) {
  if (!stats) return null;

  const progressToNextLevel = stats.intimacy_points % 100;
  const currentLevelName = getLevelName(stats.intimacy_level);

  return (
    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Couple Display */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="text-4xl">👨</div>
              <div className="text-3xl -mx-2">❤️</div>
              <div className="text-4xl">👩</div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Tedi & Airin</h1>
              <p className="text-xs text-white/80">Living Together 💕</p>
            </div>
          </div>

          {/* Intimacy Level */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">Level {stats.intimacy_level}</div>
              <div className="text-xs text-white/80">{currentLevelName}</div>
            </div>
            <div className="w-32 md:w-48">
              <div className="text-xs text-white/80 mb-1">
                {progressToNextLevel}/100 XP
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${progressToNextLevel}%` }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-yellow-200 to-white animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.days_together}</div>
              <div className="text-xs text-white/80">Hari</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total_activities}</div>
              <div className="text-xs text-white/80">Aktivitas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.care_actions_given}</div>
              <div className="text-xs text-white/80">Perhatian</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.messages_sent}</div>
              <div className="text-xs text-white/80">Pesan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getLevelName(level: number): string {
  if (level >= 50) return '💍 Soulmates';
  if (level >= 30) return '💖 Best Couple';
  if (level >= 20) return '💕 Super Close';
  if (level >= 10) return '💗 Very Sweet';
  if (level >= 5) return '💓 Getting Closer';
  return '💝 New Love';
}
