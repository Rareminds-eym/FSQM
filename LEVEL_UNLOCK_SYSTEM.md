# Level Unlock System - Environment-Based Control

## Overview

This document describes the new level unlock system that replaces the `hackathon_unlocks` table with environment-based control using `development` and `production` tables.

## System Logic

**Unlock Logic: TRUE = Unlocked, FALSE = Locked**

- When a boolean column value is `TRUE`, the corresponding levels are **unlocked**
- When a boolean column value is `FALSE`, the corresponding levels are **locked**

## Database Tables

### Development Table
Controls level access in development environment:
```sql
CREATE TABLE public.development (
  id SERIAL PRIMARY KEY,
  training BOOLEAN NOT NULL DEFAULT FALSE,  -- Controls levels 1-15
  hl_1 BOOLEAN NOT NULL DEFAULT TRUE,       -- Controls level 16  
  hl_2 BOOLEAN NOT NULL DEFAULT FALSE,      -- Controls level 17
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

**Default Development Configuration:**
- Training levels (1-15): `FALSE` = **Locked**
- HL_1 level (16): `TRUE` = **Unlocked**
- HL_2 level (17): `FALSE` = **Locked**

### Production Table
Controls level access in production environment:
```sql
CREATE TABLE public.production (
  id SERIAL PRIMARY KEY,
  training BOOLEAN NOT NULL DEFAULT FALSE,  -- Controls levels 1-15
  hl_1 BOOLEAN NOT NULL DEFAULT FALSE,      -- Controls level 16
  hl_2 BOOLEAN NOT NULL DEFAULT FALSE,      -- Controls level 17
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

**Default Production Configuration:**
- Training levels (1-15): `FALSE` = **Locked**
- HL_1 level (16): `FALSE` = **Locked**
- HL_2 level (17): `FALSE` = **Locked**

## Level Mapping

| Level ID Range | Column Name | Description |
|----------------|-------------|-------------|
| 1-15 | `training` | Training levels |
| 16 | `hl_1` | Hackathon Level 1 |
| 17 | `hl_2` | Hackathon Level 2 |
| 18+ | N/A | Always unlocked (not controlled) |

## Environment Detection

The system automatically detects the environment:

**Development Environment:**
- `import.meta.env.DEV` is true
- `import.meta.env.MODE` is 'development'
- `window.location.hostname` is 'localhost' or '127.0.0.1'

**Production Environment:**
- All other cases

## Implementation Files

### Core Files Modified:
1. **`src/data/levels.ts`** - Added `checkLevelUnlockStatus()` function
2. **`src/components/game/levels/LevelCard.tsx`** - Updated to use new unlock system
3. **`src/utils/fetchHackathonUnlockTime.ts`** - Updated to use new system
4. **`database/environment_tables.sql`** - Database setup script

### New Files Created:
1. **`src/utils/testLevelUnlock.ts`** - Test utilities for the new system
2. **`LEVEL_UNLOCK_SYSTEM.md`** - This documentation file

## Usage

### Checking Level Unlock Status
```typescript
import { checkLevelUnlockStatus } from '../data/levels';

const isUnlocked = await checkLevelUnlockStatus(16); // Check HL_1
console.log(`Level 16 is ${isUnlocked ? 'unlocked' : 'locked'}`);
```

### Testing the System
```typescript
import { runAllTests } from '../utils/testLevelUnlock';

// Run comprehensive tests
await runAllTests();
```

## Database Setup

1. Run the SQL script to create the tables:
```bash
psql -h your-host -U your-user -d your-database -f database/environment_tables.sql
```

2. The script will:
   - Create `development` and `production` tables
   - Set up Row Level Security (RLS)
   - Create policies for read/update access
   - Insert default configurations
   - Add helpful comments

## Controlling Level Access

To change level access, update the appropriate table:

```sql
-- Unlock HL_1 in development
UPDATE public.development SET hl_1 = TRUE;

-- Lock HL_2 in production
UPDATE public.production SET hl_2 = FALSE;

-- Unlock all training levels in production
UPDATE public.production SET training = TRUE;
```

## Migration from hackathon_unlocks

The old `hackathon_unlocks` table is no longer used. The new system:

1. ✅ Provides environment-specific control
2. ✅ Simplifies level management
3. ✅ Uses clear boolean logic
4. ✅ Supports real-time updates
5. ✅ Includes comprehensive logging

## Security

- Row Level Security (RLS) is enabled on both tables
- Only authenticated users can read the tables
- Only admin users (with @rareminds.in emails) can update the tables
- All changes are logged with timestamps
