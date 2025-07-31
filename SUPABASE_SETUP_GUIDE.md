# FSQM Supabase Database Setup Guide

## 🚨 IMPORTANT: Follow these steps to fix your database issues

### Issues Fixed:
- ✅ 429 Too Many Requests error (rate limiting)
- ✅ Data not saving to Supabase tables
- ✅ Missing database tables (scenarios, leaderboard, player_progress)
- ✅ Incorrect RLS policies
- ✅ Missing helper functions

## Step 1: Apply Database Schema

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project: `heatlbebbupsaqqwwkrq`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Run the Schema**
   - Open the file: `FSQM/src/components/auth/Auth.sql`
   - Copy the ENTIRE contents of that file
   - Paste it into the SQL Editor
   - Click "Run" to execute

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - ✅ `teams`
     - ✅ `scenarios`
     - ✅ `leaderboard`
     - ✅ `player_progress`

## Step 2: Verify RLS Policies

1. **Check RLS is Enabled**
   - In Table Editor, click on each table
   - Look for "RLS enabled" status
   - All tables should have RLS enabled

2. **Verify Policies**
   - Click on any table → "Policies" tab
   - You should see policies like:
     - "Allow authenticated users to insert teams"
     - "Allow users to view teams by join code"
     - etc.

## Step 3: Test the Application

1. **Start your development server**
   ```bash
   cd FSQM
   npm run dev
   ```

2. **Test Signup Process**
   - Try creating a new team
   - The rate limiting should prevent 429 errors
   - Data should now save successfully

3. **Use Debug Button**
   - Click "Debug Supabase Connection" button
   - Check browser console for test results
   - Should show successful connection and permissions

## Step 4: Seed Sample Data (Optional)

If you want to add sample scenarios:

1. **Uncomment the sample data section** in `Auth.sql`
2. **Run the INSERT statements** in SQL Editor
3. **Or use the upload function** in your app

## Troubleshooting

### If you still get errors:

1. **Check Authentication**
   - Make sure users are properly authenticated
   - Verify JWT tokens are valid

2. **Check RLS Policies**
   - Policies might be too restrictive
   - Temporarily disable RLS to test: `ALTER TABLE tablename DISABLE ROW LEVEL SECURITY;`

3. **Check API Keys**
   - Verify your `.env` file has correct Supabase URL and anon key
   - Make sure the anon key has proper permissions

4. **Check Browser Console**
   - Look for detailed error messages
   - Use the debug button to test connectivity

### Common Error Solutions:

- **"relation does not exist"** → Run the SQL schema
- **"permission denied"** → Check RLS policies
- **"429 Too Many Requests"** → Wait 5 minutes, rate limiter will reset
- **"User not authenticated"** → Make sure signup/login works first

## Security Notes

- ✅ RLS is enabled on all tables
- ✅ Users can only access their own data
- ✅ Team join codes are publicly readable (by design)
- ✅ Scenarios are publicly readable (game content)
- ✅ Rate limiting prevents API abuse

## Next Steps

1. **Remove debug button** from production code
2. **Test all features** (signup, team creation, game progress)
3. **Monitor error logs** for any remaining issues
4. **Consider adding indexes** for better performance

---

**Need Help?** Check the browser console for detailed error messages and use the debug utilities provided.
