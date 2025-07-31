// Add this to your Auth.tsx component

// 1. Add this import at the top
import { debugSignInError, checkUserExists, resendConfirmation } from "../../utils/debugSignIn";

// 2. Add these functions inside your Auth component (after the existing handlers)

const handleDebugSignIn = async () => {
  if (!formData.email || !formData.password) {
    toast.error('Please enter email and password first');
    return;
  }

  console.log('🔍 Starting sign-in debug...');
  toast.info('Debugging sign-in issue... Check console for details');
  
  const result = await debugSignInError(formData.email, formData.password);
  
  if (result.step5_credentials_valid) {
    toast.success('✅ Sign-in should work! Try signing in again.');
  } else {
    // Show specific error messages
    if (result.errors.length > 0) {
      const mainError = result.errors[0];
      toast.error(`❌ ${mainError}`);
    }
    
    // Show recommendations
    if (result.recommendations.length > 0) {
      setTimeout(() => {
        result.recommendations.forEach((rec, index) => {
          toast.info(`💡 ${rec}`, { autoClose: 8000 });
        });
      }, 1000);
    }
  }
};

const handleCheckUserExists = async () => {
  if (!formData.email) {
    toast.error('Please enter email first');
    return;
  }

  console.log('🔍 Checking if user exists...');
  toast.info('Checking if user exists...');
  
  const result = await checkUserExists(formData.email);
  
  if (result.exists) {
    toast.success('✅ User exists in Supabase');
  } else {
    toast.error('❌ User not found - you may need to sign up first');
  }
};

const handleResendConfirmation = async () => {
  if (!formData.email) {
    toast.error('Please enter email first');
    return;
  }

  console.log('📧 Resending confirmation email...');
  toast.info('Resending confirmation email...');
  
  const result = await resendConfirmation(formData.email);
  
  if (result.success) {
    toast.success('✅ Confirmation email resent! Check your inbox.');
  } else {
    toast.error(`❌ Failed to resend: ${result.error}`);
  }
};

// 3. Add these buttons to your debug buttons section (replace the existing debug buttons)

<div className="flex gap-1 justify-center flex-wrap">
  <button
    type="button"
    onClick={handleDebugSignIn}
    className="mt-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
  >
    Debug Sign-In
  </button>
  <button
    type="button"
    onClick={handleCheckUserExists}
    className="mt-4 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
  >
    Check User Exists
  </button>
  <button
    type="button"
    onClick={handleResendConfirmation}
    className="mt-4 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
  >
    Resend Confirmation
  </button>
  <button
    type="button"
    onClick={handleCheckDatabase}
    className="mt-4 px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs"
  >
    Check Database
  </button>
</div>