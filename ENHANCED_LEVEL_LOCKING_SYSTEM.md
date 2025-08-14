# Enhanced Level Locking System

## Overview

This document describes the enhanced level locking system that implements database-driven level access control with environment detection and optimized context usage.

## Key Features

✅ **Environment Detection**: Automatically detects development vs production mode  
✅ **Database-Driven Locking**: Uses Supabase database columns to control level access  
✅ **Complete Level Locking**: Can lock ALL levels including level 1 when training is disabled  
✅ **Context Optimization**: Disables GameProgressContext when training is locked  
✅ **Graceful Error Handling**: Defaults to locked state on database errors  
✅ **Caching**: Reduces database calls with intelligent caching  
✅ **Real-time Updates**: Periodically refreshes unlock status  

## System Architecture

### 1. Environment Detection
```typescript
// Automatically detects environment based on:
- import.meta.env.DEV
- import.meta.env.MODE === 'development'
- window.location.hostname === 'localhost' || '127.0.0.1'
```

### 2. Database Schema
```sql
-- Development table
CREATE TABLE public.development (
  id SERIAL PRIMARY KEY,
  training BOOLEAN NOT NULL DEFAULT FALSE,  -- Controls levels 1-15
  hl_1 BOOLEAN NOT NULL DEFAULT TRUE,       -- Controls level 16
  hl_2 BOOLEAN NOT NULL DEFAULT FALSE,      -- Controls level 17
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Production table (same structure)
CREATE TABLE public.production (
  -- Same structure as development
);
```

### 3. Locking Logic

#### Independent Column Control:
1. **`training` column**: Controls ONLY levels 1-15 (training levels)
   - If `training` = false: Lock training levels 1-15 (including level 1)
   - If `training` = true: Unlock training levels 1-15 (subject to progression logic)

2. **`hl_1` column**: Controls ONLY level 16 (HL1) - **Independent of training**
   - If `hl_1` = false: Lock level 16
   - If `hl_1` = true: Unlock level 16

3. **`hl_2` column**: Controls ONLY level 17 (HL2) - **Independent of training**
   - If `hl_2` = false: Lock level 17
   - If `hl_2` = true: Unlock level 17

4. **Levels 18+**: Always unlocked (not controlled by system)

#### Context Optimization:
- When `training` = false: GameProgressContext returns empty data for training levels
- Hackathon levels (16, 17) operate independently and don't rely on GameProgressContext

## Implementation Files

### Core Files Modified:

1. **`src/components/game/levels/levelUnlock.ts`**
   - Enhanced with complete environment configuration fetching
   - Implements caching to reduce database calls
   - Added comprehensive locking logic

2. **`src/components/game/levels/LevelCard.tsx`**
   - Updated to use EnhancedGameProgressContext
   - Implements real-time unlock status checking
   - Enhanced UI feedback for different lock states

3. **`src/context/EnhancedGameProgressContext.tsx`** (NEW)
   - Wraps original GameProgressContext
   - Conditionally disables context when training is locked
   - Provides training status and loading states

4. **`src/App.tsx`**
   - Updated provider hierarchy to include EnhancedGameProgressProvider

### New Files Created:

1. **`src/utils/testLevelLocking.ts`** - Test utilities for the system
2. **`ENHANCED_LEVEL_LOCKING_SYSTEM.md`** - This documentation

## Usage Examples

### Testing the System
```typescript
// In browser console:
await window.testLevelLocking.testAllLevels();
await window.testLevelLocking.testLevel(1);
await window.testLevelLocking.testTrainingStatus();
```

### Checking Level Status in Code
```typescript
import { checkLevelUnlockStatus, isTrainingEnabled } from './levelUnlock';

// Check if a specific level is unlocked
const isLevel1Unlocked = await checkLevelUnlockStatus(1);

// Check if training is enabled
const trainingActive = await isTrainingEnabled();
```

### Using Enhanced Context
```typescript
import { useEnhancedGameProgress } from '../context/EnhancedGameProgressContext';

const MyComponent = () => {
  const { progress, isTrainingActive, isLoading } = useEnhancedGameProgress();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isTrainingActive) return <div>Training disabled</div>;
  
  // Use progress normally
  return <div>Completed levels: {progress.completedLevels.length}</div>;
};
```

## Database Control

### Control Training Levels (1-15)
```sql
-- Unlock training levels
UPDATE public.development SET training = TRUE;
UPDATE public.production SET training = TRUE;

-- Lock training levels (including level 1)
UPDATE public.development SET training = FALSE;
UPDATE public.production SET training = FALSE;
```

### Control Hackathon Levels (Independent)
```sql
-- Control HL1 (level 16) - independent of training
UPDATE public.development SET hl_1 = TRUE;  -- Unlock HL1
UPDATE public.development SET hl_1 = FALSE; -- Lock HL1

-- Control HL2 (level 17) - independent of training
UPDATE public.production SET hl_2 = TRUE;   -- Unlock HL2
UPDATE public.production SET hl_2 = FALSE;  -- Lock HL2
```

### Example Scenarios
```sql
-- Scenario 1: Only training levels unlocked, hackathons locked
UPDATE public.development SET training = TRUE, hl_1 = FALSE, hl_2 = FALSE;

-- Scenario 2: Training locked, but HL1 unlocked for testing
UPDATE public.development SET training = FALSE, hl_1 = TRUE, hl_2 = FALSE;

-- Scenario 3: Everything unlocked
UPDATE public.development SET training = TRUE, hl_1 = TRUE, hl_2 = TRUE;
```

## Security Features

- **Default Locked**: All levels default to locked on errors
- **RLS Policies**: Database tables have Row Level Security
- **Admin Control**: Only admin users can update configurations
- **Environment Isolation**: Development and production are completely separate

## Performance Optimizations

- **Caching**: Environment config cached for 1 minute
- **Conditional Context**: GameProgressContext disabled when not needed
- **Batch Queries**: Single query fetches all environment settings
- **Periodic Updates**: Status refreshed every 1 minute, not on every render

## Error Handling

- Database connection errors → Default to locked
- Missing configuration → Default to locked
- Invalid data → Default to locked
- Network timeouts → Default to locked

## Migration Notes

This system is fully backward compatible with the existing level progression logic. When training is enabled, the normal level progression (completing previous levels) still applies for levels 1-15.

## Testing

Use the test utilities to verify the system:
```bash
# In browser console
await window.testLevelLocking.testAllLevels();
```

This will show the current configuration and unlock status for all levels.
