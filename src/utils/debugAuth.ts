import { supabase } from '../lib/supabase';

/**
 * Debug authentication issues
 */
export const debugAuthIssues = async (email: string, password: string) => {
  console.log('🔍 Starting authentication debug for:', email);
  
  const results = {
    connectionTest: false,
    userExists: false,
    emailConfirmed: false,
    passwordCorrect: false,
    sessionCreated: false,
    errors: [] as string[],
    details: {} as any
  };

  try {
    // Test 1: Basic connection
    console.log('Test 1: Testing Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('teams')
      .select('count(*)')
      .limit(1);

    if (connectionError) {
      results.errors.push(`Connection failed: ${connectionError.message}`);
      console.error('❌ Connection test failed');
    } else {
      results.connectionTest = true;
      console.log('✅ Connection test passed');
    }

    // Test 2: Check if user exists in auth.users
    console.log('Test 2: Checking if user exists...');
    try {
      // We can't directly query auth.users, but we can try to sign in and see the error
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.log('Sign in error details:', {
          message: signInError.message,
          status: (signInError as any).status,
          code: (signInError as any).code
        });

        if (signInError.message.includes('Invalid login credentials')) {
          results.errors.push('Invalid credentials - either email not found or password incorrect');
        } else if (signInError.message.includes('Email not confirmed')) {
          results.userExists = true;
          results.errors.push('Email not confirmed - check your email for confirmation link');
        } else if (signInError.message.includes('Too many requests')) {
          results.errors.push('Too many sign-in attempts - wait before trying again');
        } else {
          results.errors.push(`Sign in error: ${signInError.message}`);
        }
      } else if (signInData.user) {
        results.userExists = true;
        results.passwordCorrect = true;
        results.emailConfirmed = !!signInData.user.email_confirmed_at;
        results.sessionCreated = !!signInData.session;

        console.log('✅ Sign in successful!');
        console.log('User details:', {
          id: signInData.user.id,
          email: signInData.user.email,
          emailConfirmed: signInData.user.email_confirmed_at,
          lastSignIn: signInData.user.last_sign_in_at,
          createdAt: signInData.user.created_at
        });

        results.details.user = {
          id: signInData.user.id,
          email: signInData.user.email,
          emailConfirmed: signInData.user.email_confirmed_at,
          lastSignIn: signInData.user.last_sign_in_at,
          createdAt: signInData.user.created_at
        };

        if (signInData.session) {
          console.log('✅ Session created successfully');
          results.details.session = {
            accessToken: signInData.session.access_token ? 'present' : 'missing',
            refreshToken: signInData.session.refresh_token ? 'present' : 'missing',
            expiresAt: signInData.session.expires_at
          };
        } else {
          console.warn('⚠️ No session created');
          results.errors.push('No session created despite successful authentication');
        }
      }

    } catch (authError: any) {
      console.error('❌ Authentication test error:', authError);
      results.errors.push(`Authentication error: ${authError.message}`);
    }

    // Test 3: Check Supabase auth settings
    console.log('Test 3: Checking auth configuration...');
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/settings`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        }
      });

      if (response.ok) {
        const settings = await response.json();
        console.log('Auth settings:', settings);
        results.details.authSettings = settings;
      } else {
        console.warn('Could not fetch auth settings');
      }
    } catch (settingsError) {
      console.warn('Could not check auth settings:', settingsError);
    }

  } catch (error: any) {
    console.error('❌ Debug process failed:', error);
    results.errors.push(`Debug process failed: ${error.message}`);
  }

  // Summary
  console.log('\n📊 Authentication Debug Results:');
  console.log('Connection:', results.connectionTest ? '✅' : '❌');
  console.log('User exists:', results.userExists ? '✅' : '❌');
  console.log('Email confirmed:', results.emailConfirmed ? '✅' : '❌');
  console.log('Password correct:', results.passwordCorrect ? '✅' : '❌');
  console.log('Session created:', results.sessionCreated ? '✅' : '❌');

  if (results.errors.length > 0) {
    console.log('\n❌ Issues found:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  // Recommendations
  const recommendations = [];
  
  if (!results.userExists) {
    recommendations.push('User may not exist - try signing up first');
  } else if (!results.emailConfirmed) {
    recommendations.push('Check your email for a confirmation link and click it');
  } else if (!results.passwordCorrect) {
    recommendations.push('Check your password - it may be incorrect');
  } else if (!results.sessionCreated) {
    recommendations.push('Session creation failed - this may be a Supabase configuration issue');
  }

  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  return {
    success: results.userExists && results.emailConfirmed && results.passwordCorrect && results.sessionCreated,
    results,
    recommendations
  };
};

/**
 * Check if email confirmation is required
 */
export const checkEmailConfirmationStatus = async () => {
  try {
    console.log('🔍 Checking email confirmation settings...');
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      }
    });

    if (response.ok) {
      const settings = await response.json();
      console.log('Email confirmation required:', settings.email_confirm_required || 'Unknown');
      return settings.email_confirm_required;
    } else {
      console.warn('Could not fetch auth settings');
      return null;
    }
  } catch (error) {
    console.error('Error checking email confirmation settings:', error);
    return null;
  }
};

/**
 * Resend confirmation email
 */
export const resendConfirmationEmail = async (email: string) => {
  try {
    console.log('📧 Resending confirmation email to:', email);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });

    if (error) {
      console.error('❌ Failed to resend confirmation email:', error);
      return { success: false, error: error.message };
    } else {
      console.log('✅ Confirmation email resent successfully');
      return { success: true };
    }
  } catch (error: any) {
    console.error('❌ Error resending confirmation email:', error);
    return { success: false, error: error.message };
  }
};