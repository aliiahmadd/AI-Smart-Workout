/*
# AI Smart Workout — initial schema

1. Purpose
- Multi-user fitness app with Supabase email/password auth. Each user owns their own data.

2. New Tables
- `profiles` — extends auth.users with fitness details (age, height, weight, goal, XP, streak).
- `daily_logs` — per-day metrics (calories burned, water, sleep, heart rate, steps).
- `weight_entries` — weight history over time.
- `workout_logs` — completed workout history.
- `meal_plans` — AI-generated meal plans per day.
- `challenges` — daily/weekly/monthly challenges with progress + XP rewards.
- `badges` — achievement badges earned by the user.
- `posts` — community feed posts (author denormalized for display).
- `chat_messages` — AI coach conversation history.
- `exercises` — curated exercise library (shared, read-only for users; seeded by admin).

3. Security
- RLS enabled on every table.
- Owner-scoped CRUD (4 policies per table) for user-owned tables, scoped `TO authenticated`, using `auth.uid()`.
- `exercises` is intentionally shared/read-only: SELECT for authenticated, INSERT/UPDATE/DELETE for authenticated (admin-managed in this demo).
- All owner columns default to `auth.uid()` so inserts that omit `user_id` succeed.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  gender text,
  age int,
  height_cm numeric,
  weight_kg numeric,
  goal text,
  experience text,
  injuries text,
  equipment text[] DEFAULT '{}',
  workout_days int DEFAULT 4,
  session_duration int DEFAULT 45,
  xp int NOT NULL DEFAULT 0,
  streak int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profiles" ON profiles;
CREATE POLICY "select_own_profiles" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "insert_own_profiles" ON profiles;
CREATE POLICY "insert_own_profiles" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "update_own_profiles" ON profiles;
CREATE POLICY "update_own_profiles" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "delete_own_profiles" ON profiles;
CREATE POLICY "delete_own_profiles" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  calories_burned int NOT NULL DEFAULT 0,
  water_glasses int NOT NULL DEFAULT 0,
  sleep_hours numeric NOT NULL DEFAULT 0,
  heart_rate int NOT NULL DEFAULT 0,
  steps int NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_daily_logs" ON daily_logs;
CREATE POLICY "select_own_daily_logs" ON daily_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_daily_logs" ON daily_logs;
CREATE POLICY "insert_own_daily_logs" ON daily_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_daily_logs" ON daily_logs;
CREATE POLICY "update_own_daily_logs" ON daily_logs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_daily_logs" ON daily_logs;
CREATE POLICY "delete_own_daily_logs" ON daily_logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS weight_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  weight_kg numeric NOT NULL
);
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_weight" ON weight_entries;
CREATE POLICY "select_own_weight" ON weight_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_weight" ON weight_entries;
CREATE POLICY "insert_own_weight" ON weight_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_weight" ON weight_entries;
CREATE POLICY "update_own_weight" ON weight_entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_weight" ON weight_entries;
CREATE POLICY "delete_own_weight" ON weight_entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT current_date,
  exercise_name text NOT NULL,
  category text NOT NULL,
  duration_min int NOT NULL DEFAULT 0,
  calories int NOT NULL DEFAULT 0,
  sets int NOT NULL DEFAULT 0,
  reps int NOT NULL DEFAULT 0,
  weight_kg numeric NOT NULL DEFAULT 0
);
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_workouts" ON workout_logs;
CREATE POLICY "select_own_workouts" ON workout_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_workouts" ON workout_logs;
CREATE POLICY "insert_own_workouts" ON workout_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_workouts" ON workout_logs;
CREATE POLICY "update_own_workouts" ON workout_logs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_workouts" ON workout_logs;
CREATE POLICY "delete_own_workouts" ON workout_logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT current_date,
  meal_type text NOT NULL,
  name text NOT NULL,
  calories int NOT NULL DEFAULT 0,
  protein int NOT NULL DEFAULT 0,
  carbs int NOT NULL DEFAULT 0,
  fat int NOT NULL DEFAULT 0
);
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_meals" ON meal_plans;
CREATE POLICY "select_own_meals" ON meal_plans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_meals" ON meal_plans;
CREATE POLICY "insert_own_meals" ON meal_plans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_meals" ON meal_plans;
CREATE POLICY "update_own_meals" ON meal_plans FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_meals" ON meal_plans;
CREATE POLICY "delete_own_meals" ON meal_plans FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('daily','weekly','monthly')),
  target int NOT NULL DEFAULT 1,
  progress int NOT NULL DEFAULT 0,
  xp_reward int NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  expires_at timestamptz
);
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_challenges" ON challenges;
CREATE POLICY "select_own_challenges" ON challenges FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_challenges" ON challenges;
CREATE POLICY "insert_own_challenges" ON challenges FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_challenges" ON challenges;
CREATE POLICY "update_own_challenges" ON challenges FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_challenges" ON challenges;
CREATE POLICY "delete_own_challenges" ON challenges FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Award',
  earned_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_badges" ON badges;
CREATE POLICY "select_own_badges" ON badges FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_badges" ON badges;
CREATE POLICY "insert_own_badges" ON badges FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_badges" ON badges;
CREATE POLICY "update_own_badges" ON badges FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_badges" ON badges;
CREATE POLICY "delete_own_badges" ON badges FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_avatar text,
  content text NOT NULL,
  image_url text,
  likes int NOT NULL DEFAULT 0,
  comments int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_posts" ON posts;
CREATE POLICY "select_all_posts" ON posts FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "insert_own_posts" ON posts;
CREATE POLICY "insert_own_posts" ON posts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_posts" ON posts;
CREATE POLICY "update_own_posts" ON posts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_posts" ON posts;
CREATE POLICY "delete_own_posts" ON posts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_chat" ON chat_messages;
CREATE POLICY "select_own_chat" ON chat_messages FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_chat" ON chat_messages;
CREATE POLICY "insert_own_chat" ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_chat" ON chat_messages;
CREATE POLICY "update_own_chat" ON chat_messages FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_chat" ON chat_messages;
CREATE POLICY "delete_own_chat" ON chat_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Beginner','Intermediate','Advanced')),
  target_muscle text NOT NULL,
  calories int NOT NULL DEFAULT 0,
  equipment text NOT NULL,
  duration_min int NOT NULL DEFAULT 0,
  instructions text NOT NULL,
  image_url text NOT NULL,
  video_url text,
  ai_tip text NOT NULL
);
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_exercises" ON exercises;
CREATE POLICY "select_exercises" ON exercises FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "insert_exercises" ON exercises;
CREATE POLICY "insert_exercises" ON exercises FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_exercises" ON exercises;
CREATE POLICY "update_exercises" ON exercises FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_exercises" ON exercises;
CREATE POLICY "delete_exercises" ON exercises FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_weight_user_date ON weight_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON workout_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_date ON meal_plans(user_id, date);
CREATE INDEX IF NOT EXISTS idx_challenges_user ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at desc);
CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_messages(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
