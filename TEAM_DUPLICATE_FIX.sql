-- Fix for duplicate team entries and "JSON object requested, multiple rows returned" error
-- This script will clean up duplicate team records and add a unique constraint

-- Step 1: Identify and remove duplicate team records (keep the most recent one)
WITH ranked_teams AS (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM teams
  WHERE user_id IS NOT NULL
)
DELETE FROM teams 
WHERE id IN (
  SELECT id FROM ranked_teams WHERE rn > 1
);

-- Step 2: Add unique constraint on user_id to prevent future duplicates
ALTER TABLE teams ADD CONSTRAINT teams_user_id_unique UNIQUE (user_id);

-- Step 3: Verify the fix
SELECT 
  user_id, 
  COUNT(*) as team_count,
  array_agg(team_name) as team_names
FROM teams 
WHERE user_id IS NOT NULL
GROUP BY user_id 
HAVING COUNT(*) > 1;

-- If the above query returns no rows, the fix was successful