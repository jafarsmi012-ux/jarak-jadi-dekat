-- =====================================================
-- Virtual Together - Harvest Moon Style LDR Game
-- Database Schema for Supabase
-- =====================================================

-- 1. Couples Table (Main Game State)
CREATE TABLE IF NOT EXISTS couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  relationship_level INT DEFAULT 1,
  relationship_points INT DEFAULT 0,
  current_day INT DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  home_style VARCHAR(50) DEFAULT 'cozy_apartment'
);

CREATE INDEX IF NOT EXISTS idx_couples_code ON couples(couple_code);

-- 2. Players Table
CREATE TABLE IF NOT EXISTS couple_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  player_name VARCHAR(50) NOT NULL,
  avatar VARCHAR(50) DEFAULT '😊',
  city VARCHAR(50),
  energy INT DEFAULT 100,
  coins INT DEFAULT 0,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(couple_id, player_name)
);

CREATE INDEX IF NOT EXISTS idx_couple_players_couple ON couple_players(couple_id);

-- 3. Daily Activities Log
CREATE TABLE IF NOT EXISTS daily_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  player_name VARCHAR(50) NOT NULL,
  energy_used INT DEFAULT 10,
  coins_earned INT DEFAULT 5,
  points_earned INT DEFAULT 10,
  activity_data JSONB DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activity_date DATE DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_activities_couple_date ON daily_activities(couple_id, activity_date);

-- 4. Garden/Plants
CREATE TABLE IF NOT EXISTS garden_plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  plant_type VARCHAR(50) NOT NULL,
  planted_by VARCHAR(50) NOT NULL,
  planted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  watered_at TIMESTAMP WITH TIME ZONE,
  growth_stage INT DEFAULT 0,
  is_harvested BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_garden_couple ON garden_plants(couple_id);

-- 5. Messages/Notes
CREATE TABLE IF NOT EXISTS couple_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  sender_name VARCHAR(50) NOT NULL,
  message_type VARCHAR(50) DEFAULT 'chat',
  message_text TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_couple ON couple_messages(couple_id, created_at DESC);

-- 6. Achievements
CREATE TABLE IF NOT EXISTS couple_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  achievement_code VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(couple_id, achievement_code)
);

-- 7. Inventory (Simple items system)
CREATE TABLE IF NOT EXISTS couple_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  quantity INT DEFAULT 1,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_couple ON couple_inventory(couple_id);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE garden_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_inventory ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anonymous users (simple auth)
CREATE POLICY "Allow all" ON couples FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON daily_activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON garden_plants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_achievements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_inventory FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- Realtime Setup
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE couples;
ALTER PUBLICATION supabase_realtime ADD TABLE couple_players;
ALTER PUBLICATION supabase_realtime ADD TABLE daily_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE garden_plants;
ALTER PUBLICATION supabase_realtime ADD TABLE couple_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE couple_achievements;
ALTER PUBLICATION supabase_realtime ADD TABLE couple_inventory;

-- =====================================================
-- Initial Data: Activity Types Reference
-- =====================================================

-- Activities available in game:
-- 1. morning_coffee - Sarapan/ngopi bareng (10 energy, 5 coins, 10 points)
-- 2. cook_together - Masak bareng (15 energy, 10 coins, 15 points)
-- 3. watch_movie - Nonton film bareng (10 energy, 5 coins, 12 points)
-- 4. study_work - Coworking session (20 energy, 15 coins, 20 points)
-- 5. chat_date - Ngobrol santai (5 energy, 3 coins, 8 points)
-- 6. water_garden - Siram tanaman (5 energy, 2 coins, 5 points)
-- 7. play_game - Mini game bareng (15 energy, 8 coins, 15 points)
-- 8. good_night - Good night routine (5 energy, 3 coins, 10 points)

-- Plant types:
-- 1. rose - Mawar (3 days to grow, 20 coins reward)
-- 2. sunflower - Bunga matahari (2 days, 15 coins)
-- 3. tulip - Tulip (2 days, 12 coins)
-- 4. lavender - Lavender (4 days, 25 coins)

-- Achievement codes:
-- 1. first_day - Hari pertama bareng
-- 2. week_streak - 7 hari berturut-turut
-- 3. level_5 - Relationship level 5
-- 4. level_10 - Relationship level 10
-- 5. garden_master - 10 tanaman dipanen
-- 6. chef_couple - 20x masak bareng
-- 7. movie_lovers - 15x nonton bareng
-- 8. hard_workers - 30x coworking session

