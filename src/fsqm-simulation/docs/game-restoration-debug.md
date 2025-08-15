# Game Restoration Debug Guide

## 🔍 **Issue: Game Not Getting Restored**

The game progress is not being restored when users return to the game, even though data might be saved in the database.

## 🛠️ **Debugging Steps Added**

### **1. Enhanced Logging in useGameState.ts**
```typescript
// Added comprehensive logging to track the restoration flow
console.log("🔄 loadSavedProgress called with:", { 
  session_id: teamInfo.session_id, 
  email: teamInfo.email, 
  progressLoaded,
  initialLevel 
});
```

### **2. Database Service Debugging**
```typescript
// Added debug function to check database connectivity and data
static async debugDatabase(email: string, sessionId: string): Promise<void>
```

### **3. Main Component Debugging**
```typescript
// Added logging to track when saved progress modal should show
console.log("🎯 Checking saved progress modal:", {
  hasSavedProgress,
  hasSavedProgressInfo: !!savedProgressInfo,
  hasTeamInfo: !!teamInfo,
  gameStarted: gameState.gameStarted,
  showCountdown: gameState.showCountdown
});
```

## 🔧 **How to Debug**

### **Step 1: Open Browser Console**
1. Open the game in your browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Look for debug messages starting with emojis (🔄, 📊, ✅, ❌)

### **Step 2: Check the Debug Flow**
Look for these specific log messages in order:

1. **🔍 Checking if should load saved progress**
   - Should show team info and progress loaded status

2. **🔄 loadSavedProgress called with**
   - Should show session_id, email, and module number

3. **🔧 DEBUG: Database connectivity**
   - Shows database connection test results

4. **📊 All records for email/session**
   - Shows if any records exist for this user

5. **📥 Query result**
   - Shows the actual saved progress data

6. **🎯 Checking saved progress modal**
   - Shows if the modal should be displayed

### **Step 3: Common Issues to Check**

#### **Issue 1: No Team Info**
```
❌ Skipping loadSavedProgress: {
  hasSessionId: false,
  hasEmail: false,
  progressLoaded: false
}
```
**Solution**: Check authentication flow and team registration

#### **Issue 2: Progress Already Loaded**
```
❌ Skipping loadSavedProgress: {
  hasSessionId: true,
  hasEmail: true,
  progressLoaded: true
}
```
**Solution**: Check if `progressLoaded` is being set to true prematurely

#### **Issue 3: No Database Records**
```
📊 All records for email/session: { allRecords: [], allError: null }
```
**Solution**: Check if data is being saved correctly during gameplay

#### **Issue 4: Wrong Module Number**
```
📥 Query result: { attemptDetails: [], error: null, recordCount: 0 }
```
**Solution**: Verify module number calculation (Level 1 = Module 5, Level 2 = Module 6)

## 🎯 **Expected Debug Flow**

### **Successful Restoration:**
```
🔍 Checking if should load saved progress: { hasTeamInfo: true, progressLoaded: false }
🚀 Loading saved progress...
🔄 loadSavedProgress called with: { session_id: "session_123", email: "user@example.com", progressLoaded: false, initialLevel: 1 }
🔧 DEBUG: Basic connection test: { testData: null, testError: null }
📊 All records for email/session: { allRecords: [Array(5)], allError: null }
📥 Query result: { attemptDetails: [Array(5)], error: null, recordCount: 5 }
✅ Complete saved data found (5 questions)
🎮 Game state restored: { currentQuestion: 2, timeRemaining: 450, questionsCount: 5, answersCount: 5 }
🎯 Checking saved progress modal: { hasSavedProgress: true, hasSavedProgressInfo: true, hasTeamInfo: true }
📱 Showing SavedProgressModal
```

### **No Saved Progress:**
```
🔍 Checking if should load saved progress: { hasTeamInfo: true, progressLoaded: false }
🚀 Loading saved progress...
🔄 loadSavedProgress called with: { session_id: "session_123", email: "user@example.com", progressLoaded: false, initialLevel: 1 }
📊 All records for email/session: { allRecords: [], allError: null }
📥 Query result: { attemptDetails: [], error: null, recordCount: 0 }
❌ No saved progress found or error loading: undefined
```

## 🔧 **Manual Database Check**

### **SQL Query to Check Data:**
```sql
-- Check if attempt_details table exists and has data
SELECT * FROM attempt_details 
WHERE email = 'your-email@example.com' 
ORDER BY created_at DESC 
LIMIT 10;

-- Check specific session data
SELECT * FROM attempt_details 
WHERE session_id = 'your-session-id' 
AND module_number IN (5, 6)
ORDER BY question_index;
```

### **Check Table Structure:**
```sql
-- Verify table structure
\d attempt_details;

-- Check constraints
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'attempt_details'::regclass;
```

## 🚀 **Quick Fixes**

### **Fix 1: Clear Browser Cache**
```javascript
// Clear localStorage
localStorage.clear();

// Refresh the page
window.location.reload();
```

### **Fix 2: Reset Progress State**
```javascript
// In browser console
localStorage.removeItem('fsqm_game_progress');
```

### **Fix 3: Force Debug Mode**
```javascript
// Add to browser console to enable more logging
window.DEBUG_GAME_RESTORATION = true;
```

## 📊 **Performance Monitoring**

### **Key Metrics to Watch:**
- **Load Time**: How long does `loadSavedProgress` take?
- **Database Queries**: Are queries completing successfully?
- **Data Size**: How much data is being loaded?
- **Error Rate**: Are there any database errors?

### **Expected Performance:**
- **Load Time**: < 500ms
- **Query Success Rate**: 100%
- **Data Integrity**: All 5 questions + answers restored

## 🔮 **Next Steps**

If debugging shows:

1. **Data is being saved but not loaded**: Check query parameters
2. **Data is not being saved**: Check save function calls
3. **Modal not showing**: Check React state management
4. **Authentication issues**: Check session validation

## 📝 **Debug Checklist**

- [ ] Browser console shows debug messages
- [ ] Team info is loaded correctly
- [ ] Database connection is working
- [ ] Saved progress data exists in database
- [ ] Module number calculation is correct
- [ ] Game state is being restored
- [ ] Saved progress modal is displayed
- [ ] Continue game function works
