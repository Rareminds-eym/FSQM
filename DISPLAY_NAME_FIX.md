# Display Name Fix Instructions

I found the issue! The problem is that the user metadata has `"full_name":"karthik"` which is incorrect, but the teams table should have the correct full name.

## 🔍 What I Found:

From your debug info:
- **User Metadata**: `"full_name":"karthik"` (incorrect)
- **Team Full Name**: `Not found` (the team data should have the correct name)

## 🛠️ Quick Fix:

The teams table has a `full_name` field that should contain the correct name. Let me create a simple fix to get the correct name from the database.

### Option 1: Manual Database Check

1. **Go to your Supabase Dashboard**
2. **Navigate to Table Editor → teams**
3. **Find the row with user_id**: `ebcaa62f-9c15-4d5b-8a67-9f1be510478f`
4. **Check what's in the `full_name` column**

### Option 2: Quick Fix in Code

Add this temporary function to see what's actually in the database:

```typescript
// Add this to your ProfileMenu component for debugging
const debugTeamData = async () => {
  if (user?.id) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    console.log('🔍 Raw team data from database:', data);
    console.log('🔍 Full name in database:', data?.full_name);
    
    if (data?.full_name) {
      alert(`Correct name in database: ${data.full_name}`);
    } else {
      alert('No full_name found in teams table');
    }
  }
};

// Add this button to test
<button onClick={debugTeamData} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
  Check DB Name
</button>
```

## 🎯 Expected Solutions:

### If the database has the correct name:
The ProfileMenu should pick it up automatically. The issue might be that the `getUserTeam` function is not returning the `full_name` field properly.

### If the database has "karthik" too:
This means the wrong name was saved during signup. We need to:
1. Update the teams table with the correct name
2. Fix the signup process to save the correct name

## 🚀 Immediate Fix:

Since the user metadata shows the wrong name, let me create a version that ignores "karthik" and uses the email username instead:

```typescript
const getDisplayName = () => {
  // Skip if the name is "karthik" (known incorrect value)
  if (teamInfo?.full_name && teamInfo.full_name !== 'karthik') {
    return teamInfo.full_name;
  }
  
  if (user?.user_metadata?.full_name && user.user_metadata.full_name !== 'karthik') {
    return user.user_metadata.full_name;
  }
  
  // Use email username as fallback
  if (user?.email) {
    const emailUsername = user.email.split('@')[0]; // "gokul"
    return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1); // "Gokul"
  }
  
  return 'Player';
};
```

## 🔧 Next Steps:

1. **Check the database** to see what name is actually stored
2. **If it's wrong in the database too**, we need to update it
3. **Fix the signup process** to prevent this in the future

Would you like me to implement the immediate fix that uses "Gokul" (from the email) instead of "karthik"?