-- =============================================
-- FSQM Database Schema - Complete Setup
-- =============================================

-- 1. TEAMS TABLE
-- =============================================
create table public.teams (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  email text not null,
  phone text not null,
  full_name text not null,
  team_name text not null,
  college_code text not null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  is_team_leader boolean null,
  session_id text null,
  join_code character varying(6) null,
  constraint teams_pkey primary key (id),
  constraint teams_session_id_email_key unique (session_id, email),
  constraint teams_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Team size enforcement function
CREATE OR REPLACE FUNCTION enforce_team_size() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT COUNT(*) FROM teams
      WHERE team_name = NEW.team_name
        AND college_code = NEW.college_code) >= 4 THEN
    RAISE EXCEPTION 'Team is already full (maximum 4 members)';
  END IF;
  RETURN NEW;
END;
$$;

-- Team size trigger
CREATE TRIGGER before_insert_team
  BEFORE INSERT ON teams
  FOR EACH ROW EXECUTE FUNCTION enforce_team_size();

-- 2. SCENARIOS TABLE
-- =============================================
create table public.scenarios (
  id integer not null,
  title text not null,
  description text not null,
  symptoms text not null,
  clues jsonb null,
  questions jsonb null,
  difficulty text null,
  img text null,
  resolutionQuestion jsonb null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint scenarios_pkey primary key (id)
) TABLESPACE pg_default;

-- 3. LEADERBOARD TABLE
-- =============================================
create table public.leaderboard (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  username text not null,
  totalScore integer null default 0,
  accuracy numeric null default 0,
  completedLevels integer null default 0,
  updated_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint leaderboard_pkey primary key (id),
  constraint leaderboard_user_id_key unique (user_id),
  constraint leaderboard_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- 4. PLAYER PROGRESS TABLE
-- =============================================
create table public.player_progress (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  level_id text not null,
  score integer null default 0,
  accuracy numeric null default 0,
  completed boolean null default false,
  time_taken integer null,
  answers jsonb null,
  updated_at timestamp with time zone null default timezone ('utc'::text, now()),
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint player_progress_pkey primary key (id),
  constraint player_progress_user_level_key unique (user_id, level_id),
  constraint player_progress_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;

-- TEAMS TABLE POLICIES
-- =============================================

-- Allow authenticated users to insert their own team records
CREATE POLICY "Allow authenticated users to insert teams" ON public.teams
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to view teams by join code (for joining teams)
CREATE POLICY "Allow users to view teams by join code" ON public.teams
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to view their own team records
CREATE POLICY "Allow users to view own team records" ON public.teams
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Allow team leaders to update their team information
CREATE POLICY "Allow team leaders to update teams" ON public.teams
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND is_team_leader = true);

-- SCENARIOS TABLE POLICIES
-- =============================================

-- Allow all authenticated users to read scenarios (game content)
CREATE POLICY "Allow authenticated users to read scenarios" ON public.scenarios
  FOR SELECT TO authenticated
  USING (true);

-- Allow service role to insert/update scenarios (for data seeding)
CREATE POLICY "Allow service role to manage scenarios" ON public.scenarios
  FOR ALL TO service_role
  USING (true);

-- LEADERBOARD TABLE POLICIES
-- =============================================

-- Allow all authenticated users to read leaderboard
CREATE POLICY "Allow authenticated users to read leaderboard" ON public.leaderboard
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to insert/update their own leaderboard records
CREATE POLICY "Allow users to manage own leaderboard records" ON public.leaderboard
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- PLAYER PROGRESS TABLE POLICIES
-- =============================================

-- Allow authenticated users to manage their own progress
CREATE POLICY "Allow users to manage own progress" ON public.player_progress
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to check table privileges (for debugging)
CREATE OR REPLACE FUNCTION has_table_privilege(table_name text, privilege text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For authenticated users, return true for basic privileges
  IF auth.role() = 'authenticated' THEN
    CASE privilege
      WHEN 'SELECT' THEN RETURN true;
      WHEN 'INSERT' THEN RETURN true;
      WHEN 'UPDATE' THEN RETURN true;
      WHEN 'DELETE' THEN RETURN true;
      ELSE RETURN false;
    END CASE;
  END IF;

  -- For anonymous users, only allow SELECT on scenarios
  IF auth.role() = 'anon' AND table_name = 'scenarios' AND privilege = 'SELECT' THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- =============================================
-- SAMPLE DATA INSERTION (Optional)
-- =============================================

-- Insert sample scenarios (you can run this after creating the tables)
-- This is commented out - uncomment and run separately if needed
/*
INSERT INTO public.scenarios (id, title, description, symptoms, clues, questions, difficulty, img, resolutionQuestion) VALUES
(1, 'Rapid Discharge During Operation', 'The EV battery discharges quickly after a full charge.', 'Discharges quickly after full charge.',
 '["SOC drops faster than normal.", "Cell voltages are uneven."]'::jsonb,
 '[{"text": "Is the SOC (State of Charge) dropping quickly?", "answer": "Yes", "isRelevant": true, "hint": "Check the rate of battery discharge compared to normal operation"}]'::jsonb,
 'Easy', '/images/scenario1.jpg',
 '{"text": "What is the most likely cause?", "options": [{"id": "1", "text": "Cell imbalance", "isCorrect": true}]}'::jsonb);
*/

-- =============================================
-- GRANTS AND PERMISSIONS
-- =============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on tables
GRANT ALL ON public.teams TO authenticated;
GRANT ALL ON public.leaderboard TO authenticated;
GRANT ALL ON public.player_progress TO authenticated;
GRANT SELECT ON public.scenarios TO authenticated;
GRANT SELECT ON public.scenarios TO anon;

-- Grant permissions on sequences (for auto-incrementing IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================
-- SETUP COMPLETE
-- =============================================

-- To apply this schema:
-- 1. Copy this entire SQL script
-- 2. Go to your Supabase Dashboard > SQL Editor
-- 3. Paste and run this script
-- 4. Your database will be ready for the FSQM application

-- Note: Make sure to enable RLS on all tables in your Supabase dashboard
-- and verify that the policies are working as expected.



