# Multi-Row Progress System Guide

## 🎯 **Understanding the Progress Storage**

Each case (question) in the game is stored as a **separate row** in the `attempt_details` table. This means:

- **1 question answered** = 1 row in database
- **3 questions answered** = 3 rows in database  
- **5 questions completed** = 5 rows in database

## 📊 **Database Structure Example**

```sql
-- Example data for a user who answered 3 questions:
| id | email           | session_id | module_number | question_index | question | answer | created_at |
|----|-----------------|------------|---------------|----------------|----------|--------|------------|
| 1  | user@email.com  | abc123     | 5             | 0              | {...}    | {...}  | 2024-01-01 |
| 2  | user@email.com  | abc123     | 5             | 1              | {...}    | {...}  | 2024-01-01 |
| 3  | user@email.com  | abc123     | 5             | 2              | {...}    | {...}  | 2024-01-01 |
```

## 🔍 **Progress Detection Logic**

The system should detect progress if **ANY rows exist** for the user:

```typescript
// In useGameState.ts
if (attemptDetails.length > 0) {  // ANY number of rows > 0
  setHasAnyProgress(true);        // Should show continue button
  
  if (attemptDetails.length === 5) {  // Complete game
    setHasSavedProgress(true);         // Show detailed modal
  }
}
```

## 🧪 **Testing Your Current Data**

### **Step 1: Click "🗄️ TEST DB" Button**
This will now show:
- Total records in the table
- Recent 10 records from all users
- Your specific query results

### **Step 2: Run These SQL Queries**

```sql
-- 1. Check total records in table
SELECT COUNT(*) as total_records FROM attempt_details;

-- 2. See all unique users and their progress counts
SELECT 
  email, 
  session_id, 
  module_number,
  COUNT(*) as questions_answered,
  MIN(created_at) as first_answer,
  MAX(created_at) as last_answer
FROM attempt_details 
GROUP BY email, session_id, module_number
ORDER BY last_answer DESC;

-- 3. Check YOUR specific progress (replace with your actual values)
SELECT 
  question_index,
  created_at,
  answer->>'violation' as violation,
  answer->>'rootCause' as root_cause,
  answer->>'solution' as solution
FROM attempt_details 
WHERE email = 'YOUR_EMAIL_HERE'
  AND session_id = 'YOUR_SESSION_ID_HERE'
  AND module_number = 5  -- or 6 for Level 2
ORDER BY question_index;

-- 4. See the most recent activity
SELECT 
  email,
  session_id,
  module_number,
  question_index,
  created_at
FROM attempt_details 
ORDER BY created_at DESC 
LIMIT 20;
```

## 🎮 **Expected Behavior by Progress Amount**

### **No Progress (0 rows)**
```
Debug Info:
Has Any Progress: ❌
Has Saved Progress: ❌

UI Shows:
[START GAME] button only
```

### **Partial Progress (1-4 rows)**
```
Debug Info:
Has Any Progress: ✅
Has Saved Progress: ❌

UI Shows:
📋 Previous progress detected
[CONTINUE GAME] button
[START FRESH] button
```

### **Complete Progress (5 rows)**
```
Debug Info:
Has Any Progress: ✅
Has Saved Progress: ✅

UI Shows:
SavedProgressModal with detailed info
```

## 🔧 **Debugging Your Specific Case**

Since your debug shows:
```
Has Any Progress: ❌
```

This means the query returned **0 rows** for your email + session_id + module_number combination.

### **Possible Reasons:**

1. **No data exists** - You haven't played before
2. **Different email** - Progress saved under different email
3. **Different session_id** - Progress saved under different team/session
4. **Different module** - Level 1 progress but checking Level 2 (or vice versa)
5. **Data exists but query parameters don't match**

### **Verification Steps:**

1. **Check your current parameters** (shown in debug UI):
   ```
   Email: your-email@example.com
   Session: your-session-id  
   Module: 5 (Level 1) or 6 (Level 2)
   ```

2. **Run SQL to see if ANY data exists for your email**:
   ```sql
   SELECT * FROM attempt_details 
   WHERE email = 'your-email@example.com'
   ORDER BY created_at DESC;
   ```

3. **Check if data exists for your session**:
   ```sql
   SELECT * FROM attempt_details 
   WHERE session_id = 'your-session-id'
   ORDER BY created_at DESC;
   ```

4. **See all data in the table**:
   ```sql
   SELECT 
     email, 
     session_id, 
     module_number, 
     COUNT(*) as rows
   FROM attempt_details 
   GROUP BY email, session_id, module_number
   ORDER BY COUNT(*) DESC;
   ```

## 🎯 **Most Likely Scenarios**

### **Scenario A: First Time Playing**
- No rows exist for your user
- This is normal and expected
- **Action**: Start new game to create progress

### **Scenario B: Progress Under Different Module**
- You have Level 1 progress (module 5) but trying Level 2 (module 6)
- Or vice versa
- **Action**: Check both modules or switch game modes

### **Scenario C: Progress Under Different Session**
- You played with a different team/session before
- **Action**: Check if you're using the same team registration

### **Scenario D: Progress Under Different Email**
- You registered with a different email before
- **Action**: Check if you're logged in with the same email

## 🚀 **Quick Test to Create Progress**

1. **Start a new game** (click START GAME)
2. **Answer 1-2 questions** completely
3. **Check database** to see if rows were created:
   ```sql
   SELECT * FROM attempt_details 
   WHERE email = 'your-email@example.com'
   ORDER BY created_at DESC;
   ```
4. **Refresh the page**
5. **Check if continue button now appears**

## 📊 **Expected Console Output**

### **When Progress Exists:**
```
🗄️ Testing database connection...
📥 Direct database result: { success: true, data: [Array(3)] }
📋 Recent records (last 10): { recentRecords: [Array(10)] }
👥 All users with progress: { groupedRecords: [Array(X)] }
```

### **When No Progress Exists:**
```
📥 Direct database result: { success: true, data: [] }
📊 Total records in attempt_details: { count: 0 }
```

## 🎯 **Action Plan**

1. **Click "🗄️ TEST DB"** to see detailed database info
2. **Note your email/session** from debug UI
3. **Run SQL queries** to check if data exists under different parameters
4. **If no data exists**: Start new game to create some progress
5. **If data exists but not detected**: Check parameter mismatches

The multi-row system is working correctly - we just need to identify why your specific progress isn't being found!
