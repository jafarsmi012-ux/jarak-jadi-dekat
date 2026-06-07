-- =====================================================
-- Tedi & Airin: Living Together
-- Life Simulator Database Schema
-- =====================================================

-- 1. Players Table (Fixed: Tedi & Airin)
CREATE TABLE IF NOT EXISTS life_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(10) CHECK (name IN ('Tedi', 'Airin')) UNIQUE NOT NULL,
  city VARCHAR(20) NOT NULL,
  avatar VARCHAR(10) DEFAULT '😊',
  
  -- Status Bars
  health INT DEFAULT 100 CHECK (health >= 0 AND health <= 100),
  energy INT DEFAULT 100 CHECK (energy >= 0 AND energy <= 100),
  hunger INT DEFAULT 100 CHECK (hunger >= 0 AND hunger <= 100),
  hydration INT DEFAULT 100 CHECK (hydration >= 0 AND hydration <= 100),
  mood VARCHAR(20) DEFAULT 'happy',
  
  -- States
  is_online BOOLEAN DEFAULT false,
  is_sleeping BOOLEAN DEFAULT false,
  is_sick BOOLEAN DEFAULT false,
  current_activity VARCHAR(50),
  
  -- Medicine tracking
  needs_medicine BOOLEAN DEFAULT false,
  medicine_time TIME,
  last_medicine_taken TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_meal_time TIMESTAMP WITH TIME ZONE,
  last_sleep_time TIMESTAMP WITH TIME ZONE,
  wakeup_time TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Tedi & Airin
INSERT INTO life_players (name, city, avatar) VALUES 
  ('Tedi', 'Bandung', '👨'),
  ('Airin', 'Padang', '👩')
ON CONFLICT (name) DO NOTHING;

-- 2. Activities Log
CREATE TABLE IF NOT EXISTS life_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name VARCHAR(10) NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  activity_data JSONB DEFAULT '{}',
  together BOOLEAN DEFAULT false,
  partner_joined BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_player ON life_activities(player_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_together ON life_activities(together, created_at DESC);

-- 3. Care Actions (Perhatian antar pasangan)
CREATE TABLE IF NOT EXISTS care_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_player VARCHAR(10) NOT NULL,
  to_player VARCHAR(10) NOT NULL,
  care_type VARCHAR(50) NOT NULL, -- 'medicine_reminder', 'meal_reminder', 'hug', 'flower', 'comfort', etc.
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_care_to_player ON care_actions(to_player, is_read, created_at DESC);

-- 4. Messages & Chat
CREATE TABLE IF NOT EXISTS life_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_player VARCHAR(10) NOT NULL,
  to_player VARCHAR(10) NOT NULL,
  message_text TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'chat', -- 'chat', 'system', 'care'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_players ON life_messages(from_player, to_player, created_at DESC);

-- 5. Daily Schedule & Reminders
CREATE TABLE IF NOT EXISTS life_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name VARCHAR(10) NOT NULL,
  reminder_type VARCHAR(50) NOT NULL, -- 'meal', 'medicine', 'water', 'sleep', 'wakeup'
  reminder_time TIME NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_player ON life_reminders(player_name, is_enabled);

-- 6. Relationship Stats
CREATE TABLE IF NOT EXISTS relationship_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intimacy_level INT DEFAULT 1,
  intimacy_points INT DEFAULT 0,
  days_together INT DEFAULT 0,
  total_activities INT DEFAULT 0,
  care_actions_given INT DEFAULT 0,
  messages_sent INT DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial relationship stats
INSERT INTO relationship_stats (intimacy_level, intimacy_points) VALUES (1, 0)
ON CONFLICT DO NOTHING;

-- 7. Memory Lane (Special moments)
CREATE TABLE IF NOT EXISTS memory_lane (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_type VARCHAR(50) NOT NULL, -- 'first_date', 'special_moment', 'milestone'
  title VARCHAR(100) NOT NULL,
  description TEXT,
  photo_url TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Functions & Triggers
-- =====================================================

-- Function to decrease hunger/hydration over time
CREATE OR REPLACE FUNCTION decrease_needs()
RETURNS void AS $$
BEGIN
  UPDATE life_players
  SET 
    hunger = GREATEST(0, hunger - 5),
    hydration = GREATEST(0, hydration - 5),
    energy = CASE 
      WHEN is_sleeping THEN LEAST(100, energy + 10)
      ELSE GREATEST(0, energy - 3)
    END,
    updated_at = NOW()
  WHERE NOT is_sleeping OR (is_sleeping AND energy < 100);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Row Level Security
-- =====================================================

ALTER TABLE life_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_lane ENABLE ROW LEVEL SECURITY;

-- Allow all (simplified for Tedi & Airin only game)
CREATE POLICY "Allow all" ON life_players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON life_activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON care_actions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON life_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON life_reminders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON relationship_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON memory_lane FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- Realtime Setup
-- =====================================================

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE life_players;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE life_activities;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE care_actions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE life_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE relationship_stats;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
