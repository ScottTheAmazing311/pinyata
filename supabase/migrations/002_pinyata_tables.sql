CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  min_players INT NOT NULL DEFAULT 2,
  max_players INT NOT NULL DEFAULT 8,
  duration_minutes INT NOT NULL DEFAULT 30,
  tags TEXT[] DEFAULT '{}',
  price INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  timer_default_seconds INT DEFAULT 0,
  randomizer_type TEXT,
  randomizer_config JSONB DEFAULT '{}',
  rules TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  primary_content TEXT NOT NULL,
  secondary_content TEXT,
  category TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  stripe_payment_id TEXT,
  UNIQUE(user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);
CREATE INDEX IF NOT EXISTS idx_games_featured ON games(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_games_published ON games(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_game_entries_game ON game_entries(game_id);
CREATE INDEX IF NOT EXISTS idx_user_games_user ON user_games(user_id);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read published games" ON games FOR SELECT USING (is_published = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE game_entries ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read game entries" ON game_entries FOR SELECT USING (
    EXISTS (SELECT 1 FROM games WHERE games.id = game_entries.game_id AND games.is_published = true)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users see own games" ON user_games FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Users insert own games" ON user_games FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
