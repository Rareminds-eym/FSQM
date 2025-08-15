-- Schema improvements for the teams table
-- Run these commands in your Supabase SQL editor

-- 1. Add missing index on email column (frequently queried)
CREATE INDEX IF NOT EXISTS idx_teams_email ON public.teams USING btree (email);

-- 2. Add index on team_name and college_code combination (for team queries)
CREATE INDEX IF NOT EXISTS idx_teams_team_college ON public.teams USING btree (team_name, college_code);

-- 3. Ensure the team size enforcement function exists
CREATE OR REPLACE FUNCTION enforce_team_size() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Check if adding this member would exceed team size limit
  IF (SELECT COUNT(*) FROM teams
      WHERE session_id = NEW.session_id) >= 4 THEN
    RAISE EXCEPTION 'Team is already full (maximum 4 members)';
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Add a function to check team completion status
CREATE OR REPLACE FUNCTION is_team_complete(p_session_id text, p_module_number integer)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  team_size integer;
  completed_count integer;
BEGIN
  -- Get the total number of team members
  SELECT COUNT(*) INTO team_size
  FROM teams
  WHERE session_id = p_session_id;
  
  -- Get the number of members who completed this module
  SELECT COUNT(*) INTO completed_count
  FROM individual_attempts
  WHERE session_id = p_session_id
    AND module_number = p_module_number;
  
  -- Team is complete if all members have completed the module
  RETURN completed_count >= team_size;
END;
$$;

-- 5. Add RLS (Row Level Security) policies if not already present
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own team data
CREATE POLICY "Users can view own team data" ON teams
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own team data
CREATE POLICY "Users can insert own team data" ON teams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own team data
CREATE POLICY "Users can update own team data" ON teams
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. Add a view for team statistics
CREATE OR REPLACE VIEW team_stats AS
SELECT 
  session_id,
  team_name,
  college_code,
  COUNT(*) as member_count,
  COUNT(CASE WHEN is_team_leader = true THEN 1 END) as leader_count,
  MIN(created_at) as team_created_at,
  MAX(created_at) as last_member_joined
FROM teams
WHERE session_id IS NOT NULL
GROUP BY session_id, team_name, college_code;

-- 7. Add constraints to ensure data integrity
ALTER TABLE teams 
ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE teams 
ADD CONSTRAINT check_phone_format 
CHECK (phone ~ '^[0-9+\-\s()]+$');

ALTER TABLE teams 
ADD CONSTRAINT check_join_code_format 
CHECK (join_code ~ '^[A-Z0-9]{6}$' OR join_code IS NULL);

-- 8. Add a function to generate unique join codes
CREATE OR REPLACE FUNCTION generate_join_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    -- Generate a 6-character alphanumeric code
    new_code := upper(substring(md5(random()::text) from 1 for 6));
    
    -- Check if this code already exists
    SELECT EXISTS(SELECT 1 FROM teams WHERE join_code = new_code) INTO code_exists;
    
    -- If code doesn't exist, we can use it
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;
  END LOOP;
END;
$$;

-- 9. Add trigger to auto-generate join codes
CREATE OR REPLACE FUNCTION auto_generate_join_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only generate join code for team leaders
  IF NEW.is_team_leader = true AND NEW.join_code IS NULL THEN
    NEW.join_code := generate_join_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_auto_generate_join_code
  BEFORE INSERT ON teams
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_join_code();

-- 10. Add helpful comments
COMMENT ON TABLE teams IS 'Stores team information for the FSQM simulation game';
COMMENT ON COLUMN teams.session_id IS 'Shared identifier for team members';
COMMENT ON COLUMN teams.join_code IS 'Unique 6-character code for joining teams';
COMMENT ON COLUMN teams.is_team_leader IS 'Indicates if this user is the team leader';
COMMENT ON FUNCTION enforce_team_size() IS 'Ensures teams do not exceed 4 members';
COMMENT ON FUNCTION is_team_complete(text, integer) IS 'Checks if all team members completed a module';
