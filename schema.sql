-- database/schema.sql
-- Balkanomerač Database Schema
-- Run this in Supabase SQL Editor

-- ==========================================
-- EXTENSIONS
-- ==========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search (optional, for future features)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==========================================
-- TABLES
-- ==========================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passport_id TEXT UNIQUE NOT NULL,
  subscription_status TEXT DEFAULT 'none' CHECK (
    subscription_status IN ('active', 'canceled', 'past_due', 'none')
  ),
  test_completed BOOLEAN DEFAULT false,
  test_result JSONB,
  telegram_joined BOOLEAN DEFAULT false,
  telegram_id BIGINT,
  telegram_username TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 45),
  percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  title TEXT NOT NULL,
  title_emoji TEXT NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lottery draws table
CREATE TABLE IF NOT EXISTS lottery_draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month TEXT NOT NULL,
  draw_date TIMESTAMP WITH TIME ZONE NOT NULL,
  winner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  charity_family_id UUID,
  winner_amount DECIMAL(10,2),
  charity_amount DECIMAL(10,2),
  total_pool DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (
    status IN ('upcoming', 'drawn', 'paid')
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charity families table
CREATE TABLE IF NOT EXISTS charity_families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_name TEXT NOT NULL,
  story TEXT NOT NULL,
  nominated_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'nominated' CHECK (
    status IN ('nominated', 'shortlisted', 'winner', 'paid')
  ),
  amount_received DECIMAL(10,2),
  thank_you_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for lottery_draws -> charity_families
ALTER TABLE lottery_draws
  ADD CONSTRAINT lottery_draws_charity_family_id_fkey
  FOREIGN KEY (charity_family_id)
  REFERENCES charity_families(id)
  ON DELETE SET NULL;

-- ==========================================
-- INDEXES
-- ==========================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_passport_id ON users(passport_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);

-- Test results indexes
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_percentage ON test_results(percentage DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at ON test_results(completed_at DESC);

-- Lottery draws indexes
CREATE INDEX IF NOT EXISTS idx_lottery_draws_status ON lottery_draws(status);
CREATE INDEX IF NOT EXISTS idx_lottery_draws_draw_date ON lottery_draws(draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_lottery_draws_winner_user_id ON lottery_draws(winner_user_id);

-- Charity families indexes
CREATE INDEX IF NOT EXISTS idx_charity_families_status ON charity_families(status);
CREATE INDEX IF NOT EXISTS idx_charity_families_nominated_by ON charity_families(nominated_by_user_id);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for charity_families table
CREATE TRIGGER update_charity_families_updated_at
  BEFORE UPDATE ON charity_families
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE lottery_draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_families ENABLE ROW LEVEL SECURITY;

-- Users policies
-- Allow users to read their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Allow service role to do anything (for backend API)
CREATE POLICY "Service role has full access to users"
  ON users FOR ALL
  USING (auth.role() = 'service_role');

-- Test results policies
CREATE POLICY "Users can view own test results"
  ON test_results FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Service role has full access to test_results"
  ON test_results FOR ALL
  USING (auth.role() = 'service_role');

-- Lottery draws policies (public read, admin write)
CREATE POLICY "Anyone can view lottery draws"
  ON lottery_draws FOR SELECT
  USING (true);

CREATE POLICY "Service role has full access to lottery_draws"
  ON lottery_draws FOR ALL
  USING (auth.role() = 'service_role');

-- Charity families policies
CREATE POLICY "Anyone can view shortlisted charity families"
  ON charity_families FOR SELECT
  USING (status = 'shortlisted');

CREATE POLICY "Users can view families they nominated"
  ON charity_families FOR SELECT
  USING (nominated_by_user_id = auth.uid());

CREATE POLICY "Service role has full access to charity_families"
  ON charity_families FOR ALL
  USING (auth.role() = 'service_role');

-- ==========================================
-- VIEWS (Optional - for easier querying)
-- ==========================================

-- Leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY (test_result->>'percentage')::int DESC) as rank,
  u.name,
  u.passport_id,
  (u.test_result->>'score')::int as score,
  (u.test_result->>'percentage')::int as percentage,
  u.test_result->>'title' as title,
  u.test_result->>'titleEmoji' as emoji
FROM users u
WHERE u.test_completed = true
  AND u.test_result IS NOT NULL
ORDER BY (u.test_result->>'percentage')::int DESC
LIMIT 100;

-- Active subscribers view
CREATE OR REPLACE VIEW active_subscribers AS
SELECT 
  id,
  name,
  email,
  passport_id,
  joined_at,
  test_completed
FROM users
WHERE subscription_status = 'active';

-- Monthly stats view
CREATE OR REPLACE VIEW monthly_stats AS
SELECT 
  COUNT(*) FILTER (WHERE subscription_status = 'active') as active_subscribers,
  COUNT(*) FILTER (WHERE test_completed = true) as test_completions,
  COUNT(*) FILTER (WHERE telegram_joined = true) as telegram_members,
  COUNT(*) as total_users,
  (COUNT(*) FILTER (WHERE subscription_status = 'active') * 2) as monthly_revenue
FROM users;

-- ==========================================
-- SEED DATA (Optional - for testing)
-- ==========================================

-- Uncomment to insert test data

/*
-- Insert test user
INSERT INTO users (name, email, passport_id, subscription_status, test_completed, test_result)
VALUES (
  'Test User',
  'test@example.com',
  'BLK-2026-TEST01',
  'active',
  true,
  '{
    "score": 35,
    "percentage": 78,
    "title": "Pravi Balkanac",
    "titleEmoji": "🥇"
  }'::jsonb
);

-- Insert test charity family
INSERT INTO charity_families (family_name, story, status)
VALUES (
  'Porodica Test',
  'Test story za demonstraciju',
  'shortlisted'
);
*/

-- ==========================================
-- GRANTS (Optional - for security)
-- ==========================================

-- Grant necessary permissions to authenticated role
GRANT SELECT ON leaderboard TO authenticated;
GRANT SELECT ON active_subscribers TO authenticated;
GRANT SELECT ON monthly_stats TO authenticated;

-- ==========================================
-- COMMENTS (Documentation)
-- ==========================================

COMMENT ON TABLE users IS 'Main users table storing subscriber information';
COMMENT ON COLUMN users.passport_id IS 'Unique Balkan Pasoš identifier (e.g., BLK-2026-ABC123)';
COMMENT ON COLUMN users.test_result IS 'JSON object containing test score, percentage, and title';

COMMENT ON TABLE test_results IS 'Detailed test results with all answers';
COMMENT ON COLUMN test_results.answers IS 'JSON array of all question answers with points';

COMMENT ON TABLE lottery_draws IS 'Monthly lottery draws with winners and amounts';
COMMENT ON TABLE charity_families IS 'Families nominated for charity donations';

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Run these to verify setup:

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY indexname;

-- Check RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ==========================================
-- DONE!
-- ==========================================

-- Setup complete. Next steps:
-- 1. Update .env with SUPABASE_URL and keys
-- 2. Test API endpoints
-- 3. Deploy to Vercel
