-- Fix for Supabase UUID session_id error
-- The issue: individual_attempts and team_attempts tables have session_id as UUID
-- but the application generates session_id as text strings like "session_1754366232962_066nkvdy1"

-- Solution: Change session_id columns from UUID to TEXT to match the teams table

-- 1. Fix individual_attempts table
ALTER TABLE public.individual_attempts 
ALTER COLUMN session_id TYPE text;

-- 2. Fix team_attempts table  
ALTER TABLE public.team_attempts 
ALTER COLUMN session_id TYPE text;

-- Verify the changes
\d individual_attempts;
\d team_attempts;
\d teams;