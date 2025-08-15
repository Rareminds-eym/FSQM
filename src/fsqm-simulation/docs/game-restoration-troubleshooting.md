# Game Restoration Troubleshooting Guide

## 🚨 **Issue: Game Restoration Not Working & Continue Button Not Showing**

The game is not detecting saved progress and the continue button is not appearing on the start screen.

## 🔧 **Enhanced Debugging Added**

### **1. Progress State Monitoring**
```typescript
// Added debug effect to monitor all progress state changes
useEffect(() => {
  console.log("📊 Progress state changed:", {
    progressLoaded,
    isLoadingProgress,
    hasSavedProgress,
    hasAnyProgress,
    savedProgressInfo: !!savedProgressInfo
  });
}, [progressLoaded, isLoadingProgress, hasSavedProgress, hasAnyProgress, savedProgressInfo]);
```

### **2. Enhanced Progress Loading Check**
```typescript
// Added isLoadingProgress check to prevent duplicate loading
if (teamInfo && !progressLoaded && !isLoadingProgress) {
  console.log("🚀 Loading saved progress...");
  loadSavedProgress(teamInfo);
}
```

### **3. Debug UI Display**
Added real-time debug information on the start screen:
```
🔧 Debug Info:
Progress Loaded: ✅/❌
Loading Progress: 🔄/❌
Has Any Progress: ✅/❌
Has Saved Progress: ✅/❌
Team Info: ✅/❌
```

### **4. Manual Testing Buttons**
- **🧪 TEST CONTINUE**: Bypasses all logic and starts game
- **🔄 LOAD PROGRESS**: Manually triggers progress loading
- **🗄️ TEST DB**: Directly tests database connection

## 🔍 **Step-by-Step Debugging Process**

### **Step 1: Check Browser Console**
1. Open the game with browser console open (F12)
2. Look for these key log messages:

#### **Expected Flow:**
```
🔍 Checking if should load saved progress: { hasTeamInfo: true, progressLoaded: false }
🚀 Loading saved progress...
🔄 loadSavedProgress called with: { session_id: "...", email: "...", progressLoaded: false, initialLevel: 1 }
🔧 DEBUG: Basic connection test: { testData: null, testError: null }
📊 All records for email/session: { allRecords: [...], allError: null }
📥 Query result: { attemptDetails: [...], error: null, recordCount: X }
📊 Progress state changed: { progressLoaded: true, hasAnyProgress: true, ... }
```

### **Step 2: Check Debug UI**
Look at the debug info box on the start screen:
- **Progress Loaded**: Should be ✅ after loading completes
- **Has Any Progress**: Should be ✅ if data exists
- **Team Info**: Should be ✅ if authentication worked

### **Step 3: Test Manual Functions**
Use the debug buttons to isolate the issue:

1. **Click "🗄️ TEST DB"**: 
   - Tests direct database connection
   - Should show database query results in console

2. **Click "🔄 LOAD PROGRESS"**:
   - Manually triggers progress loading
   - Should show the same logs as automatic loading

3. **Click "🧪 TEST CONTINUE"**:
   - Bypasses all logic and starts game
   - If this works, issue is in progress detection

## 🎯 **Common Issues & Solutions**

### **Issue 1: Team Info Not Available**
**Symptoms:**
```
🔍 Checking if should load saved progress: { hasTeamInfo: false }
Debug UI shows: Team Info: ❌
```

**Causes:**
- Authentication failed
- User not registered
- Session expired

**Solution:**
1. Check authentication flow
2. Verify user registration
3. Check browser network tab for auth errors

### **Issue 2: Progress Loading Never Triggered**
**Symptoms:**
```
🔍 Checking if should load saved progress: { hasTeamInfo: true, progressLoaded: false }
// But no "🚀 Loading saved progress..." message
```

**Causes:**
- `isLoadingProgress` stuck as true
- `progressLoaded` already true
- useEffect dependency issues

**Solution:**
1. Check if `isLoadingProgress` is stuck
2. Manually click "🔄 LOAD PROGRESS"
3. Refresh page to reset state

### **Issue 3: Database Connection Issues**
**Symptoms:**
```
🗄️ Testing database connection...
💥 Database test error: [error details]
```

**Causes:**
- Supabase connection issues
- Authentication problems
- Network connectivity

**Solution:**
1. Check Supabase dashboard
2. Verify API keys
3. Check network connectivity

### **Issue 4: No Data in Database**
**Symptoms:**
```
📥 Direct database result: { success: true, data: [] }
📊 Progress state changed: { hasAnyProgress: false }
```

**Causes:**
- No saved progress exists
- Wrong module number
- Data saved under different email/session

**Solution:**
1. Check database manually:
```sql
SELECT * FROM attempt_details 
WHERE email = 'user@example.com' 
ORDER BY created_at DESC;
```

### **Issue 5: Progress Loaded But Continue Button Not Showing**
**Symptoms:**
```
📊 Progress state changed: { hasAnyProgress: true, progressLoaded: true }
// But continue button still not visible
```

**Causes:**
- React state update not triggering re-render
- Conditional rendering logic issue
- Component unmounting/remounting

**Solution:**
1. Check render decision logs:
```
🎯 Render decision: {
  shouldShowStartScreen: true,
  hasAnyProgress: true
}
```
2. Force re-render by refreshing page

## 🧪 **Testing Checklist**

### **Authentication & Team Info**
- [ ] User is logged in
- [ ] Team registration completed
- [ ] Team info available in console logs
- [ ] Debug UI shows "Team Info: ✅"

### **Progress Loading**
- [ ] Progress loading triggered automatically
- [ ] Manual "🔄 LOAD PROGRESS" works
- [ ] Database connection successful
- [ ] Debug UI shows "Progress Loaded: ✅"

### **Data Detection**
- [ ] Database contains saved progress
- [ ] Correct module number (5 for Level 1, 6 for Level 2)
- [ ] Progress data matches current user
- [ ] Debug UI shows "Has Any Progress: ✅"

### **UI Rendering**
- [ ] Start screen appears
- [ ] Debug info box visible
- [ ] Continue button appears when hasAnyProgress is true
- [ ] Progress indicator shows when progress exists

## 🔧 **Quick Fixes**

### **Fix 1: Force Progress Reload**
```javascript
// In browser console
localStorage.clear();
window.location.reload();
```

### **Fix 2: Manual Progress Check**
```javascript
// In browser console
console.log("Current game state:", window.gameState);
console.log("Team info:", window.teamInfo);
```

### **Fix 3: Database Manual Check**
```sql
-- In Supabase SQL editor
SELECT 
  email, 
  session_id, 
  module_number, 
  COUNT(*) as question_count,
  MAX(created_at) as last_saved
FROM attempt_details 
GROUP BY email, session_id, module_number
ORDER BY last_saved DESC;
```

## 📊 **Expected Debug Output**

### **Successful Flow:**
```
🔍 Checking if should load saved progress: { hasTeamInfo: true, progressLoaded: false, isLoadingProgress: false }
🚀 Loading saved progress...
🔄 loadSavedProgress called with: { session_id: "abc123", email: "user@example.com", progressLoaded: false, initialLevel: 1 }
🔧 DEBUG: Basic connection test: { testData: null, testError: null }
📊 All records for email/session: { allRecords: [Array(3)], allError: null }
📥 Query result: { attemptDetails: [Array(3)], error: null, recordCount: 3 }
✅ Found saved progress: [Array(3)]
📊 Progress state changed: { progressLoaded: true, isLoadingProgress: false, hasSavedProgress: false, hasAnyProgress: true, savedProgressInfo: false }
🎯 Render decision: { shouldShowLoading: false, shouldShowSavedProgressModal: false, shouldShowStartScreen: true, hasSavedProgress: false, hasAnyProgress: true }
```

### **No Progress Flow:**
```
🔍 Checking if should load saved progress: { hasTeamInfo: true, progressLoaded: false, isLoadingProgress: false }
🚀 Loading saved progress...
📥 Query result: { attemptDetails: [], error: null, recordCount: 0 }
❌ No saved progress found
📊 Progress state changed: { progressLoaded: true, hasAnyProgress: false }
🎯 Render decision: { shouldShowStartScreen: true, hasAnyProgress: false }
```

## 🔮 **Next Steps**

1. **Load the game** with browser console open
2. **Check debug UI** for current state
3. **Use manual buttons** to test each component
4. **Follow console logs** to identify where the flow breaks
5. **Report findings** with specific console output

The enhanced debugging will help pinpoint exactly where the game restoration is failing!
