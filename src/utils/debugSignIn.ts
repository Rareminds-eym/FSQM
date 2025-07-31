import { supabase } from '../lib/supabase';

/**
 * Comprehensive sign-in debugging tool
 */
export const debugSignInError = async (email: string, password: string) => {
  console.log('🔍 Starting comprehensive sign-in debug for:', email);
  
  const results = {
    step1_connection: false,
    step2_auth_settings: false,
    step3_user_exists: false,
    step4_email_confirmed: false,
    step5_credentials_valid: false,
    errors: [] as string[],
    details: {} as any,
    recommendations: [] as string[]
  };

  try {
    // Step 1: Test basic connection
    console.log('Step 1: Testing Supabase connection...');
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok || response.status === 404) { // 404 is expected for root endpoint
        results.step1_connection = true;
        console.log('✅ Connection test passed');
      } else {
        results.errors.push(`Connection failed: ${response.status} ${response.statusText}`);
        console.error('❌ Connection test failed');
      }
    } catch (connError: any) {
      results.errors.push(`Connection error: ${connError.message}`);
      console.error('❌ Connection error:', connError);
    }

    // Step 2: Check auth settings
    console.log('Step 2: Checking authentication settings...');
    try {
      const authResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/settings`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        }
      });

      if (authResponse.ok) {
        const settings = await authResponse.json();
        results.step2_auth_settings = true;
        results.details.authSettings = settings;
        
        console.log('✅ Auth settings retrieved:', {
          signupEnabled: settings.disable_signup === false,
          emailConfirmRequired: settings.email_confirm_required,
          passwordMinLength: settings.password_min_length
        });

        if (settings.disable_signup === true) {
          results.errors.push('Signup is disabled in Supabase settings');
          results.recommendations.push('Enable signup in Supabase Dashboard → Authentication → Settings');
        }
      } else {
        results.errors.push(`Auth settings check failed: ${authResponse.status}`);
        console.error('❌ Auth settings check failed');
      }
    } catch (authError: any) {
      results.errors.push(`Auth settings error: ${authError.message}`);
      console.error('❌ Auth settings error:', authError);
    }

    // Step 3: Test sign-in and analyze the response
    console.log('Step 3: Testing sign-in with detailed error analysis...');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        console.error('❌ Sign-in error details:', {
          message: error.message,
          status: (error as any).status,
          code: (error as any).code,
          details: (error as any).details
        });

        results.details.signInError = {
          message: error.message,
          status: (error as any).status,
          code: (error as any).code,
          details: (error as any).details
        };

        // Analyze specific error types
        if (error.message.includes('Invalid login credentials')) {
          results.errors.push('Invalid credentials - email not found or password incorrect');
          results.recommendations.push('1. Verify the email address is correct');
          results.recommendations.push('2. Check if you signed up with this email');
          results.recommendations.push('3. Try password reset if you forgot your password');
        } else if (error.message.includes('Email not confirmed')) {
          results.step3_user_exists = true;
          results.errors.push('Email address not confirmed');
          results.recommendations.push('Check your email for a confirmation link and click it');
          results.recommendations.push('Check spam/junk folder for the confirmation email');
        } else if (error.message.includes('Too many requests')) {
          results.errors.push('Rate limited - too many sign-in attempts');
          results.recommendations.push('Wait 5-10 minutes before trying again');
        } else if (error.message.includes('signup_disabled')) {
          results.errors.push('User signup is disabled');
          results.recommendations.push('Contact administrator or enable signup in Supabase settings');
        } else {
          results.errors.push(`Unknown auth error: ${error.message}`);
        }
      } else if (data.user) {
        results.step3_user_exists = true;
        results.step4_email_confirmed = !!data.user.email_confirmed_at;
        results.step5_credentials_valid = true;

        console.log('✅ Sign-in successful!');
        console.log('User details:', {
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: data.user.email_confirmed_at,
          lastSignIn: data.user.last_sign_in_at,
          createdAt: data.user.created_at
        });

        results.details.user = {
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: data.user.email_confirmed_at,
          lastSignIn: data.user.last_sign_in_at,
          createdAt: data.user.created_at
        };

        if (!data.user.email_confirmed_at) {
          results.errors.push('Email not confirmed');
          results.recommendations.push('Check your email for confirmation link');
        }
      }
    } catch (signInException: any) {
      console.error('❌ Sign-in exception:', signInException);
      results.errors.push(`Sign-in exception: ${signInException.message}`);
    }

    // Step 4: Test with a known invalid email to see the difference
    console.log('Step 4: Testing with invalid email for comparison...');
    try {
      const { error: invalidError } = await supabase.auth.signInWithPassword({
        email: 'definitely-not-a-real-email@nonexistent-domain-12345.com',
        password: 'wrongpassword'
      });

      if (invalidError) {
        console.log('Invalid email test error (expected):', invalidError.message);
        results.details.invalidEmailError = invalidError.message;
      }
    } catch (invalidException) {
      console.log('Invalid email test exception (expected):', invalidException);
    }

  } catch (overallError: any) {
    console.error('❌ Overall debug process failed:', overallError);
    results.errors.push(`Debug process failed: ${overallError.message}`);
  }

  // Generate summary and recommendations
  console.log('\n📊 Sign-In Debug Results:');
  console.log('Connection:', results.step1_connection ? '✅' : '❌');
  console.log('Auth Settings:', results.step2_auth_settings ? '✅' : '❌');
  console.log('User Exists:', results.step3_user_exists ? '✅' : '❌');
  console.log('Email Confirmed:', results.step4_email_confirmed ? '✅' : '❌');
  console.log('Credentials Valid:', results.step5_credentials_valid ? '✅' : '❌');

  if (results.errors.length > 0) {
    console.log('\n❌ Issues Found:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  if (results.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    results.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  return results;
};

/**
 * Quick test to check if user exists in Supabase
 */
export const checkUserExists = async (email: string) => {
  console.log('🔍 Checking if user exists for:', email);
  
  try {
    // Try to trigger a password reset - this will tell us if the user exists
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://example.com' // Dummy redirect
    });

    if (error) {
      if (error.message.includes('User not found')) {
        console.log('❌ User does not exist');
        return { exists: false, error: 'User not found' };
      } else {
        console.log('⚠️ Password reset error (but user might exist):', error.message);
        return { exists: true, error: error.message };
      }
    } else {
      console.log('✅ User exists (password reset email would be sent)');
      return { exists: true, error: null };
    }
  } catch (error: any) {
    console.error('❌ Error checking user existence:', error);
    return { exists: false, error: error.message };
  }
};

/**
 * Resend confirmation email if needed
 */
export const resendConfirmation = async (email: string) => {
  console.log('📧 Attempting to resend confirmation email to:', email);
  
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });

    if (error) {
      console.error('❌ Failed to resend confirmation:', error);
      return { success: false, error: error.message };
    } else {
      console.log('✅ Confirmation email resent successfully');
      return { success: true, error: null };
    }
  } catch (error: any) {
    console.error('❌ Exception resending confirmation:', error);
    return { success: false, error: error.message };
  }
};