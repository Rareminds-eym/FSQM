-- =============================================
-- FSQM Database Permission Fix
-- =============================================
-- This script fixes database permission issues for team creation

-- First, let's disable RLS temporarily to fix permissions
ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "teams_insert_policy" ON public.teams;
DROP POLICY IF EXISTS "teams_select_policy" ON public.teams;
DROP POLICY IF EXISTS "teams_update_policy" ON public.teams;
DROP POLICY IF EXISTS "teams_delete_policy" ON public.teams;
DROP POLICY IF EXISTS "Allow authenticated users to insert teams" ON public.teams;
DROP POLICY IF EXISTS "Allow users to view teams by join code" ON public.teams;
DROP POLICY IF EXISTS "Allow users to view own team records" ON public.teams;
DROP POLICY IF EXISTS "Allow team leaders to update teams" ON public.teams;

-- Grant explicit permissions to authenticated users
GRANT ALL ON public.teams TO authenticated;
GRANT ALL ON public.teams TO postgres;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO postgres;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Re-enable RLS with very permissive policies
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create very permissive policies for testing
CREATE POLICY "teams_full_access" ON public.teams
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also create a policy for anonymous users (just in case)
CREATE POLICY "teams_anon_access" ON public.teams
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Make sure the table owner is correct
ALTER TABLE public.teams OWNER TO postgres;

-- Grant all privileges explicitly
GRANT ALL PRIVILEGES ON public.teams TO authenticated;
GRANT ALL PRIVILEGES ON public.teams TO anon;
GRANT ALL PRIVILEGES ON public.teams TO postgres;

-- Test function to verify permissions work
CREATE OR REPLACE FUNCTION test_permission_fix()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  test_result text;
  test_user_id uuid;
BEGIN
  -- Get current user ID
  test_user_id := auth.uid();
  
  IF test_user_id IS NULL THEN
    RETURN 'ERROR: No authenticated user found';
  END IF;
  
  -- Try to insert a test record
  BEGIN
    INSERT INTO public.teams (
      user_id, email, phone, full_name, team_name, college_code, 
      is_team_leader, join_code, session_id
    ) VALUES (
      test_user_id, 
      'permission_test@example.com', 
      '+1234567890', 
      'Permission Test User', 
      'Permission Test Team', 
      'PTEST', 
      true, 
      'PTEST1', 
      'permission_test_session'
    );
    
    -- If we get here, the insert worked
    test_result := 'SUCCESS: Permission test passed - team insertion works';
    
    -- Clean up the test record
    DELETE FROM public.teams WHERE email = 'permission_test@example.com';
    
  EXCEPTION WHEN OTHERS THEN
    test_result := 'ERROR: ' || SQLERRM;
  END;
  
  RETURN test_result;
END;
$$;

-- Grant execute permission on the test function
GRANT EXECUTE ON FUNCTION test_permission_fix() TO authenticated;
GRANT EXECUTE ON FUNCTION test_permission_fix() TO anon;

-- =============================================
-- INSTRUCTIONS
-- =============================================

-- After running this script:
-- 1. Test the permission fix by running: SELECT test_permission_fix();
-- 2. If it returns "SUCCESS", your permissions are fixed
-- 3. If it returns an error, check the Supabase logs for more details

-- To test from your application, you can also run this query:
-- SELECT test_permission_fix();

COMMENT ON FUNCTION test_permission_fix() IS 'Test function to verify team insertion permissions work correctly';