# Team Info Loading Fix

## Problem
The error "Could not load team info. JSON object requested, multiple (or no) rows returned" occurs when:

1. A user has multiple team records in the database (duplicate entries)
2. The `getUserTeam` function uses `.single()` which expects exactly one row
3. No unique constraint exists on `user_id` in the teams table

## Root Cause
The database schema allows multiple team records per user because there's no unique constraint on the `user_id` field in the teams table.

## Solution Applied

### 1. Fixed getUserTeam Function
- Changed from `.single()` to regular query with ordering
- Returns the most recent team record if multiple exist
- Handles the case gracefully with warning logs

### 2. Database Fix Required
Run the SQL script `TEAM_DUPLICATE_FIX.sql` to:
- Remove duplicate team records (keeps most recent)
- Add unique constraint on `user_id`
- Prevent future duplicates

### 3. Code Changes Made
- Updated `src/services/teamsService.ts`
- Improved error handling in `getUserTeam`
- Added logging for duplicate detection

## How to Apply the Fix

### Step 1: Run Database Fix
```sql
-- Execute TEAM_DUPLICATE_FIX.sql in your Supabase SQL editor
```

### Step 2: Test the Application
1. Refresh the application
2. Try loading the profile menu
3. Check browser console for any remaining errors

### Step 3: Verify Fix
- Profile menu should load without errors
- Team information should display correctly
- No more "multiple rows returned" errors

## Prevention
The unique constraint on `user_id` will prevent this issue from happening again in the future.

## If Issues Persist
1. Check browser console for detailed error logs
2. Verify the SQL fix was applied successfully
3. Check if there are any remaining duplicate records
4. Ensure Supabase RLS policies are working correctly