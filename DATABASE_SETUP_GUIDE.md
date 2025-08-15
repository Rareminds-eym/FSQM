# Database Setup Guide - Environment Tables

## 🚨 URGENT: Fix Database Fetching Issues

If you're experiencing issues with development and production database not properly fetching, follow these steps:

## Problem Diagnosis

The level unlock system requires `development` and `production` tables in your Supabase database. If these don't exist, you'll see errors like:

- `relation "development" does not exist`
- `relation "production" does not exist`
- `No config available, locking level X`

## Quick Diagnosis

Run this in your browser console to check the issue:

```javascript
// Import the test function
import { testDatabaseSetup } from './src/utils/testLevelLocking';

// Run the diagnostic
await testDatabaseSetup();
```

## Solution: Create the Required Tables

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### Step 2: Run the Environment Tables Script

Copy and paste this SQL script into the SQL Editor:

```sql
-- Environment-based Level Unlock System
-- Development table
CREATE TABLE IF NOT EXISTS public.development (
  id SERIAL PRIMARY KEY,
  training BOOLEAN NOT NULL DEFAULT FALSE,
  hl_1 BOOLEAN NOT NULL DEFAULT TRUE,
  hl_2 BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Production table
CREATE TABLE IF NOT EXISTS public.production (
  id SERIAL PRIMARY KEY,
  training BOOLEAN NOT NULL DEFAULT FALSE,
  hl_1 BOOLEAN NOT NULL DEFAULT FALSE,
  hl_2 BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default configuration for development
INSERT INTO public.development (training, hl_1, hl_2)
VALUES (FALSE, TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Insert default configuration for production
INSERT INTO public.production (training, hl_1, hl_2)
VALUES (FALSE, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.development ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production ENABLE ROW LEVEL SECURITY;

-- Create policies for read access
CREATE POLICY "Allow read access for authenticated users" ON public.development
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for authenticated users" ON public.production
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for admin updates
CREATE POLICY "Allow admin updates" ON public.development
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%@rareminds.in'
    )
  );

CREATE POLICY "Allow admin updates" ON public.production
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%@rareminds.in'
    )
  );
```

### Step 3: Click "Run" to Execute

After running the script, you should see success messages.

### Step 4: Verify Tables Created

1. Go to "Table Editor" in the left sidebar
2. You should see two new tables:
   - ✅ `development`
   - ✅ `production`

## Environment Mapping

| URL | Environment | Database Table |
|-----|-------------|----------------|
| `localhost` | development | `development` |
| `127.0.0.1` | development | `development` |
| `fsqm.netlify.app` | development | `development` |
| `fsqmdev.rareminds.in` | development | `development` |
| `fsqm.rareminds.in` | production | `production` |

## Default Configuration

### Development Table
- `training`: FALSE (locked)
- `hl_1`: TRUE (unlocked for testing)
- `hl_2`: FALSE (locked)

### Production Table
- `training`: FALSE (locked)
- `hl_1`: FALSE (locked)
- `hl_2`: FALSE (locked)

## Testing After Setup

Run these commands in your browser console to verify everything works:

```javascript
// Test database setup
import { testDatabaseSetup } from './src/utils/testLevelLocking';
await testDatabaseSetup();

// Test all levels
import { testAllLevels } from './src/utils/testLevelLocking';
await testAllLevels();

// Test specific level
import { testLevel } from './src/utils/testLevelLocking';
await testLevel(1);  // Test level 1
await testLevel(16); // Test HL1
await testLevel(17); // Test HL2
```

## Controlling Level Access

To change level access, update the appropriate table:

```sql
-- Unlock training levels in development
UPDATE public.development SET training = TRUE;

-- Unlock HL1 in production
UPDATE public.production SET hl_1 = TRUE;

-- Unlock HL2 in development
UPDATE public.development SET hl_2 = TRUE;
```

## Troubleshooting

### If you still get errors:

1. **Check Authentication**: Make sure users are logged in
2. **Check RLS Policies**: Verify policies allow read access
3. **Check Console Logs**: Look for detailed error messages
4. **Clear Cache**: Run `clearEnvironmentConfigCache()` in console

### Common Errors:

- **"relation does not exist"** → Run the SQL script above
- **"permission denied"** → Check RLS policies and authentication
- **"No data found"** → The system will auto-create default data

## Support

If you continue having issues:

1. Check the browser console for detailed error messages
2. Verify your Supabase connection is working
3. Ensure the SQL script ran without errors
4. Contact support with the specific error messages
