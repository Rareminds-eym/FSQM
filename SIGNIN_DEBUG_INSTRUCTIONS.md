# Sign-In Debug Instructions

Great news! Your team data is now being saved to the Supabase teams table. However, you're having trouble signing in. Here are the most common causes and solutions:

## Most Likely Cause: Email Confirmation Required

The most common reason you can't sign in after creating an account is that **email confirmation is required** but you haven't confirmed your email yet.

### Quick Fix:
1. **Check your email inbox** (including spam/junk folder)
2. **Look for an email from Supabase** with subject like "Confirm your signup"
3. **Click the confirmation link** in the email
4. **Try signing in again**

## Debug Steps

### Step 1: Check Email Confirmation Settings

Go to your **Supabase Dashboard** → **Authentication** → **Settings** and check if "Enable email confirmations" is turned on.

If it's ON, you MUST confirm your email before you can sign in.

### Step 2: Resend Confirmation Email

If you can't find the confirmation email, you can resend it by running this in your browser console while on the sign-in page:

```javascript
// Open browser console (F12) and run this:
import { supabase } from './src/lib/supabase';

supabase.auth.resend({
  type: 'signup',
  email: 'your-email@example.com'  // Replace with your email
}).then(result => {
  console.log('Resend result:', result);
});
```

### Step 3: Debug Authentication

Add this debug function to test what's happening:

```typescript
// Add this to your Auth component
const handleDebugSignIn = async () => {
  if (!formData.email || !formData.password) {
    toast.error('Please enter email and password first');
    return;
  }

  console.log('🔍 Debugging sign-in issues...');
  toast.info('Running sign-in debug... Check console for details');
  
  const result = await debugAuthIssues(formData.email, formData.password);
  
  if (result.success) {
    toast.success('✅ Sign-in debug passed! Authentication should work.');
  } else {
    toast.error('❌ Sign-in issues detected. Check console for details.');
    console.error('Debug results:', result);
    
    // Show specific recommendations
    if (result.recommendations.length > 0) {
      result.recommendations.forEach(rec => {
        toast.info(rec, { autoClose: 8000 });
      });
    }
  }
};

// Add this button to your debug buttons section
<button
  type="button"
  onClick={handleDebugSignIn}
  className="mt-4 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
>
  Debug Sign-In
</button>
```

## Common Issues and Solutions

### 1. Email Not Confirmed
**Symptoms**: "Email not confirmed" error or "Invalid login credentials"
**Solution**: Check your email and click the confirmation link

### 2. Wrong Password
**Symptoms**: "Invalid login credentials" error
**Solution**: Double-check your password, try password reset if needed

### 3. Account Doesn't Exist
**Symptoms**: "Invalid login credentials" error
**Solution**: Make sure you're using the same email you signed up with

### 4. Too Many Attempts
**Symptoms**: "Too many requests" error
**Solution**: Wait 5-10 minutes before trying again

### 5. Supabase Configuration Issue
**Symptoms**: Sign-in appears successful but no session is created
**Solution**: Check Supabase dashboard settings

## Quick Test

To quickly test if your account exists and is confirmed, try this:

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Look for your email in the user list
3. Check the "Email Confirmed" column - it should show a checkmark ✅

## Alternative: Disable Email Confirmation (Not Recommended for Production)

If you want to test without email confirmation:

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Turn OFF "Enable email confirmations"
3. Try signing in again

**Note**: This is not recommended for production as it reduces security.

## Enhanced AuthContext

I've created an enhanced AuthContext with better error handling and debugging. To use it:

1. Replace the import in your main App file:
```typescript
// Change from:
import { AuthProvider } from './components/home/AuthContext';

// To:
import { AuthProvider } from './components/home/AuthContext_Enhanced';
```

This will provide much better error messages and debugging information.

## Next Steps

1. **Check your email** for the confirmation link (most likely solution)
2. **Add the debug function** to test what's happening
3. **Check Supabase dashboard** user list to verify your account exists
4. **Try the enhanced AuthContext** for better error messages

The enhanced logging will show you exactly what's happening during the sign-in process and help identify the specific issue.