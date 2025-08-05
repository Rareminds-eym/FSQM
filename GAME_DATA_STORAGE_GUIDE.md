# Game Data Storage Implementation Guide

## Overview

This document explains the implementation of game data storage to Supabase for the FSQM (Fault Scenario Question Management) game. The implementation stores player progress, scores, and game completion data to the `player_progress` table in Supabase without modifying the existing game logic.

## Database Schema

The `player_progress` table structure:

```sql
CREATE TABLE public.player_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    level_id TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    accuracy NUMERIC DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    time_taken INTEGER,
    answers JSONB,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    CONSTRAINT player_progress_pkey PRIMARY KEY (id),
    CONSTRAINT player_progress_user_level_key UNIQUE (user_id, level_id),
    CONSTRAINT player_progress_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;
```

## Implementation Details

### 1. Enhanced Game Progress Functions

**File**: `/src/composables/gameProgress.tsx`

#### Key Functions Added:

- **`saveGameProgress()`**: Enhanced function that properly maps game state to database schema
- **`convertProgressToGameState()`**: Converts database records back to game state format
- **`saveGameCompletion()`**: Specialized function for saving completed games
- **`getUserBestScore()`**: Retrieves user's best performance for a level
- **`getAllUserProgress()`**: Gets comprehensive user progress for analytics
- **`updateLeaderboardFromProgress()`**: Updates leaderboard based on current progress

#### Data Mapping:

```typescript
// Game State → Database
{
  answeredQuestions: string[],     → answers.answeredQuestions (JSONB)
  selectedResolution: string[],    → answers.selectedResolution (JSONB)
  showResolution: boolean,         → answers.showResolution (JSONB)
  completed: boolean,              → completed (BOOLEAN)
  timeLeft: number,                → time_taken = 180 - timeLeft (INTEGER)
  score: number,                   → score (INTEGER)
  accuracy: number                 → accuracy (NUMERIC)
}
```

### 2. Game Page Integration

**File**: `/src/components/game/GamePage.tsx`

#### Key Changes:

1. **Authentication Integration**: Uses `useAuth()` hook to get authenticated user
2. **Progress Loading**: Automatically loads saved progress when user starts a level
3. **Auto-Save**: Debounced saving of game state changes (1-second delay)
4. **Completion Handling**: Proper saving of completed games and leaderboard updates

#### Implementation Features:

- **Non-intrusive**: Existing game logic remains unchanged
- **Graceful Degradation**: Works without authentication (local state only)
- **Error Handling**: Comprehensive error handling for database operations
- **Performance Optimized**: Debounced saves to prevent excessive database calls

### 3. Data Flow

```
User Action → Game State Update → Debounced Save → Supabase Database
     ↑                                                      ↓
User Interface ← Game State ← Progress Loading ← Database Query
```

#### Save Triggers:
- Question answered
- Resolution selected
- Game completed
- Time elapsed
- User navigates away

#### Load Triggers:
- User enters game level
- User authentication changes
- Level ID changes

### 4. JSONB Answers Structure

The `answers` field stores game interaction data as JSONB:

```json
{
  "answeredQuestions": ["Question 1 text", "Question 2 text"],
  "selectedResolution": ["option_id_1", "option_id_2"],
  "showResolution": true
}
```

## Usage Examples

### Saving Game Progress

```typescript
// Automatic saving (handled by useEffect)
const result = await saveGameProgress(user.id, gameState, levelId);
if (result.success) {
  console.log("Progress saved successfully");
}
```

### Loading Game Progress

```typescript
// Automatic loading (handled by useEffect)
const progress = await fetchGameProgress(user.id, levelId);
if (progress) {
  const gameState = convertProgressToGameState(progress);
  setGameState(gameState);
}
```

### Getting User Statistics

```typescript
const stats = await fetchUserStats(user.id);
// Returns: { totalScore, totalAccuracy, completedLevels }
```

## Benefits

1. **Persistent Progress**: Users can resume games across sessions
2. **Analytics Ready**: Comprehensive data for user behavior analysis
3. **Leaderboard Integration**: Automatic leaderboard updates on completion
4. **Cross-Device Sync**: Progress syncs across devices for authenticated users
5. **Performance Tracking**: Detailed metrics for each game attempt

## Security Considerations

- **Row Level Security (RLS)**: Ensure RLS policies are enabled on the `player_progress` table
- **User Isolation**: Users can only access their own progress data
- **Data Validation**: Input validation on both client and server side
- **Authentication Required**: Critical operations require authenticated users

## Monitoring and Debugging

### Console Logs:
- Progress loading/saving operations
- Authentication status
- Error conditions
- Performance metrics

### Database Queries:
```sql
-- Check user progress
SELECT * FROM player_progress WHERE user_id = 'user-uuid';

-- Get completion statistics
SELECT 
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN completed THEN 1 END) as completed_games,
  AVG(score) as average_score,
  AVG(accuracy) as average_accuracy
FROM player_progress 
WHERE user_id = 'user-uuid';
```

## Future Enhancements

1. **Offline Support**: Cache progress locally when offline
2. **Real-time Updates**: WebSocket integration for live progress updates
3. **Advanced Analytics**: More detailed gameplay analytics
4. **Achievement System**: Track and reward player achievements
5. **Social Features**: Share progress with friends

## Troubleshooting

### Common Issues:

1. **Progress Not Saving**:
   - Check user authentication status
   - Verify Supabase connection
   - Check console for error messages

2. **Progress Not Loading**:
   - Ensure user is authenticated
   - Check database permissions
   - Verify level ID format

3. **Performance Issues**:
   - Monitor save frequency (should be debounced)
   - Check for unnecessary re-renders
   - Optimize database queries

### Debug Commands:

```typescript
// Check authentication
console.log('User:', user, 'Authenticated:', isAuthenticated);

// Test database connection
const testResult = await saveGameProgress(user.id, gameState, 'test');
console.log('Save test:', testResult);
```

This implementation provides a robust, scalable solution for storing game data while maintaining the integrity of the existing game logic.