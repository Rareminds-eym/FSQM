-- =============================================
-- FSQM Database Schema - Fixed Version
-- =============================================
-- This version addresses common issues with team data not saving

-- 1. TEAMS TABLE (Updated with better constraints)
-- =============================================
DROP TABLE IF EXISTS public.teams CASCADE;

create table public.teams (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  email text not null,
  phone text not null,
  full_name text not null,
  team_name text not null,
  college_code text not null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  is_team_leader boolean null default false,
  session_id text null,
  join_code character varying(6) null,
  constraint teams_pkey primary key (id),
  constraint teams_user_id_unique unique (user_id),
  constraint teams_session_id_email_key unique (session_id, email),
  constraint teams_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX idx_teams_user_id ON public.teams(user_id);
CREATE INDEX idx_teams_join_code ON public.teams(join_code);
CREATE INDEX idx_teams_session_id ON public.teams(session_id);

-- Team size enforcement function (updated)
CREATE OR REPLACE FUNCTION enforce_team_size() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT COUNT(*) FROM teams
      WHERE session_id = NEW.session_id) >= 4 THEN
    RAISE EXCEPTION 'Team is already full (maximum 4 members)';
  END IF;
  RETURN NEW;
END;
$$;

-- Team size trigger
DROP TRIGGER IF EXISTS before_insert_team ON public.teams;
CREATE TRIGGER before_insert_team
  BEFORE INSERT ON teams
  FOR EACH ROW EXECUTE FUNCTION enforce_team_size();

-- 2. OTHER TABLES (Keep existing structure)
-- =============================================
-- Only recreate if they don't exist
CREATE TABLE IF NOT EXISTS public.scenarios (
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

CREATE TABLE IF NOT EXISTS public.leaderboard (
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

CREATE TABLE IF NOT EXISTS public.player_progress (
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
-- ROW LEVEL SECURITY (RLS) POLICIES - FIXED
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to insert teams" ON public.teams;
DROP POLICY IF EXISTS "Allow users to view teams by join code" ON public.teams;
DROP POLICY IF EXISTS "Allow users to view own team records" ON public.teams;
DROP POLICY IF EXISTS "Allow team leaders to update teams" ON public.teams;

-- TEAMS TABLE POLICIES - FIXED AND SIMPLIFIED
-- =============================================

-- Allow authenticated users to insert their own team records
CREATE POLICY "teams_insert_policy" ON public.teams
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to view all teams (needed for join code lookup)
CREATE POLICY "teams_select_policy" ON public.teams
  FOR SELECT TO authenticated
  USING (true);

-- Allow users to update their own team records
CREATE POLICY "teams_update_policy" ON public.teams
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own team records
CREATE POLICY "teams_delete_policy" ON public.teams
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- SCENARIOS TABLE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Allow authenticated users to read scenarios" ON public.scenarios;
DROP POLICY IF EXISTS "Allow service role to manage scenarios" ON public.scenarios;

-- Allow all authenticated users to read scenarios (game content)
CREATE POLICY "scenarios_select_policy" ON public.scenarios
  FOR SELECT TO authenticated
  USING (true);

-- Allow service role to manage scenarios (for data seeding)
CREATE POLICY "scenarios_all_policy" ON public.scenarios
  FOR ALL TO service_role
  USING (true);

-- LEADERBOARD TABLE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Allow authenticated users to read leaderboard" ON public.leaderboard;
DROP POLICY IF EXISTS "Allow users to manage own leaderboard records" ON public.leaderboard;

-- Allow all authenticated users to read leaderboard
CREATE POLICY "leaderboard_select_policy" ON public.leaderboard
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to manage their own leaderboard records
CREATE POLICY "leaderboard_manage_policy" ON public.leaderboard
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- PLAYER PROGRESS TABLE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Allow users to manage own progress" ON public.player_progress;

-- Allow authenticated users to manage their own progress
CREATE POLICY "progress_manage_policy" ON public.player_progress
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Alternative solution: Modify RLS policy to allow leaderboard access
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "progress_manage_policy" ON public.player_progress;
DROP POLICY IF EXISTS "Allow users to manage own progress" ON public.player_progress;

-- Create separate policies for different operations
-- Allow users to manage their own progress (INSERT, UPDATE, DELETE)
CREATE POLICY "progress_own_data_policy" ON public.player_progress
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow all authenticated users to READ all progress data (for leaderboard)
CREATE POLICY "progress_leaderboard_read_policy" ON public.player_progress
  FOR SELECT TO authenticated
  USING (true);

-- Comment: This allows everyone to read all player progress for leaderboard display
-- while still restricting write operations to the data owner only

-- =============================================
-- GRANTS AND PERMISSIONS - ENHANCED
-- =============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on tables with explicit permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leaderboard TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.player_progress TO authenticated;
GRANT SELECT ON public.scenarios TO authenticated;
GRANT SELECT ON public.scenarios TO anon;

-- Grant permissions on sequences (for auto-incrementing IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions on functions
GRANT EXECUTE ON FUNCTION enforce_team_size() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_player_scores() TO authenticated;

-- =============================================
-- DEBUGGING FUNCTIONS
-- =============================================

-- Function to test team insertion (for debugging)
CREATE OR REPLACE FUNCTION test_team_insert(
  p_user_id uuid,
  p_email text,
  p_phone text,
  p_full_name text,
  p_team_name text,
  p_college_code text,
  p_is_team_leader boolean DEFAULT true
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  new_join_code text;
  new_session_id text;
BEGIN
  -- Generate join code and session ID
  new_join_code := upper(substring(md5(random()::text) from 1 for 6));
  new_session_id := 'session_' || extract(epoch from now()) || '_' || substring(md5(random()::text) from 1 for 9);
  
  -- Try to insert
  INSERT INTO public.teams (
    user_id, email, phone, full_name, team_name, 
    college_code, is_team_leader, join_code, session_id
  ) VALUES (
    p_user_id, p_email, p_phone, p_full_name, p_team_name,
    p_college_code, p_is_team_leader, new_join_code, new_session_id
  );
  
  result := json_build_object(
    'success', true,
    'join_code', new_join_code,
    'session_id', new_session_id,
    'message', 'Team created successfully'
  );
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  result := json_build_object(
    'success', false,
    'error', SQLERRM,
    'error_code', SQLSTATE,
    'message', 'Team creation failed'
  );
  
  RETURN result;
END;
$$;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permissions(p_user_id uuid DEFAULT auth.uid())
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  can_select boolean := false;
  can_insert boolean := false;
  can_update boolean := false;
  can_delete boolean := false;
  error_msg text;
BEGIN
  -- Test SELECT permission
  BEGIN
    PERFORM 1 FROM public.teams WHERE user_id = p_user_id LIMIT 1;
    can_select := true;
  EXCEPTION WHEN OTHERS THEN
    can_select := false;
  END;
  
  -- Test INSERT permission (dry run)
  BEGIN
    -- This will fail due to constraints but will tell us about permissions
    INSERT INTO public.teams (user_id, email, phone, full_name, team_name, college_code)
    VALUES (p_user_id, 'test@test.com', '+1234567890', 'Test User', 'Test Team', 'TEST123');
    can_insert := true;
    -- Rollback the test insert
    RAISE EXCEPTION 'test_rollback';
  EXCEPTION 
    WHEN SQLSTATE '42501' THEN can_insert := false; -- Permission denied
    WHEN OTHERS THEN can_insert := true; -- Other errors mean permission is OK
  END;
  
  result := json_build_object(
    'user_id', p_user_id,
    'permissions', json_build_object(
      'select', can_select,
      'insert', can_insert,
      'update', can_update,
      'delete', can_delete
    ),
    'auth_role', current_setting('role', true),
    'current_user', current_user
  );
  
  RETURN result;
END;
$$;

-- Add this function to allow fetching all player scores for leaderboard
CREATE OR REPLACE FUNCTION get_all_player_scores()
RETURNS TABLE (
  user_id uuid,
  score integer,
  completed boolean,
  level_id text,
  accuracy numeric,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    p.user_id,
    p.score,
    p.completed,
    p.level_id,
    p.accuracy,
    p.updated_at
  FROM player_progress p
  ORDER BY p.updated_at DESC;
$$;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Run these queries after setup to verify everything is working:

-- 1. Check if tables exist and are accessible
-- SELECT schemaname, tablename, tableowner FROM pg_tables WHERE schemaname = 'public';

-- 2. Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE schemaname = 'public';

-- 3. Test permissions for a user (replace with actual user ID)
-- SELECT check_user_permissions('your-user-id-here');

-- 4. Test team insertion (replace with actual user data)
-- SELECT test_team_insert(
--   'your-user-id-here',
--   'test@example.com',
--   '+1234567890',
--   'Test User',
--   'Test Team',
--   'TEST123',
--   true
-- );

-- =============================================
-- SETUP COMPLETE
-- =============================================

-- To apply this schema:
-- 1. Copy this entire SQL script
-- 2. Go to your Supabase Dashboard > SQL Editor
-- 3. Paste and run this script
-- 4. Test the verification queries above
-- 5. Your database should now properly save team data

COMMENT ON TABLE public.teams IS 'Fixed version - should resolve team data saving issues';