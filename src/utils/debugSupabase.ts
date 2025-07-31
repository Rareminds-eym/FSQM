import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Anon Key (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

    // Test 1: Check if we can connect to Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth test:', { user: user?.id, error: authError });

    // Test 2: Check if we can read from teams table
    const { data: teams, error: readError } = await supabase
      .from('teams')
      .select('*')
      .limit(1);
    console.log('Read test:', { teams, error: readError });

    // Test 3: Test a simple signup to see if auth is working
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'testpassword123';

    console.log('Testing signup with:', testEmail);
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    });

    console.log('Signup test result:', {
      user: signupData.user?.id,
      session: signupData.session ? 'present' : 'missing',
      error: signupError ? {
        message: signupError.message,
        status: (signupError as any).status,
        code: (signupError as any).code
      } : null
    });

    // Clean up test user if created
    if (signupData.user && !signupError) {
      console.log('Cleaning up test user...');
      // Note: In production, you'd need admin privileges to delete users
    }

    // Test 4: Check table permissions (only if function exists)
    let permissions = null;
    let permError = null;
    try {
      const { data, error } = await supabase
        .rpc('has_table_privilege', {
          table_name: 'teams',
          privilege: 'INSERT'
        });
      permissions = data;
      permError = error;
    } catch (error) {
      console.log('Permission function not available (this is normal)');
      permError = error;
    }
    console.log('Permission test:', { permissions, error: permError });

    return {
      connection: !authError,
      read: !readError,
      signup: !signupError,
      user: user?.id || null,
      errors: {
        auth: authError,
        read: readError,
        signup: signupError,
        permission: permError
      }
    };
  } catch (error) {
    console.error('Supabase test failed:', error);
    return {
      connection: false,
      read: false,
      signup: false,
      user: null,
      errors: { general: error }
    };
  }
};

export const testTeamInsertion = async (testData: any) => {
  try {
    console.log('🧪 Testing team insertion with data:', testData);

    // First check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Current user for insertion:', { user: user?.id, error: authError });

    if (!user) {
      console.error('❌ No authenticated user found for team insertion');
      return { success: false, error: 'No authenticated user' };
    }

    // Test the insertion
    const { data, error } = await supabase
      .from('teams')
      .insert(testData)
      .select()
      .single();

    console.log('Insert test result:', { data, error });

    if (error) {
      console.error('Insert error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    }

    return { success: !error, data, error };
  } catch (error) {
    console.error('Insert test failed:', error);
    return { success: false, data: null, error };
  }
};

export const checkDatabaseSetup = async () => {
  console.log('🔍 Checking database setup...');

  const results = {
    tablesExist: {
      teams: false,
      scenarios: false,
      leaderboard: false,
      player_progress: false
    },
    errors: {} as any
  };

  // Check each table
  const tables = ['teams', 'scenarios', 'leaderboard', 'player_progress'];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count(*)')
        .limit(1);

      if (error) {
        console.error(`❌ Table '${table}' error:`, error);
        results.errors[table] = error;
        results.tablesExist[table as keyof typeof results.tablesExist] = false;
      } else {
        console.log(`✅ Table '${table}' exists and is accessible`);
        results.tablesExist[table as keyof typeof results.tablesExist] = true;
      }
    } catch (error) {
      console.error(`❌ Unexpected error checking table '${table}':`, error);
      results.errors[table] = error;
      results.tablesExist[table as keyof typeof results.tablesExist] = false;
    }
  }

  return results;
};

export const testAuthSettings = async () => {
  console.log('🔍 Testing Supabase Auth Settings...');

  try {
    // Test basic connectivity
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });

    console.log('API connectivity test:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    // Test auth endpoint specifically
    const authResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: `test_connectivity_${Date.now()}@example.com`,
        password: 'testpassword123'
      })
    });

    const authResult = await authResponse.text();
    console.log('Auth endpoint test:', {
      status: authResponse.status,
      statusText: authResponse.statusText,
      response: authResult.substring(0, 200) + '...'
    });

    return {
      apiConnectivity: response.ok,
      authEndpoint: authResponse.status !== 404,
      details: {
        apiStatus: response.status,
        authStatus: authResponse.status
      }
    };

  } catch (error) {
    console.error('Auth settings test failed:', error);
    return {
      apiConnectivity: false,
      authEndpoint: false,
      error
    };
  }
};

// New comprehensive debugging function for form submission issues
export const debugFormSubmission = async (formData: any) => {
  console.log('🐛 Starting comprehensive form submission debug...');

  const debugResults = {
    step1_connection: false,
    step2_auth: false,
    step3_user_creation: false,
    step4_team_insertion: false,
    errors: [] as string[],
    details: {} as any
  };

  try {
    // Step 1: Test connection
    console.log('Step 1: Testing Supabase connection...');
    const { data: testQuery, error: connectionError } = await supabase
      .from('teams')
      .select('count(*)')
      .limit(1);

    if (connectionError) {
      debugResults.errors.push(`Connection failed: ${connectionError.message}`);
      console.error('❌ Connection test failed');
      return debugResults;
    } else {
      debugResults.step1_connection = true;
      console.log('✅ Connection successful');
    }

    // Step 2: Test authentication
    console.log('Step 2: Testing authentication...');
    const testEmail = `debug_${Date.now()}@test.com`;
    const testPassword = 'TestPassword123!';

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Debug Test User'
        }
      }
    });

    if (signupError) {
      debugResults.errors.push(`Signup failed: ${signupError.message}`);
      console.error('❌ Signup test failed:', signupError);
      return debugResults;
    } else {
      debugResults.step2_auth = true;
      debugResults.step3_user_creation = !!signupData.user;
      debugResults.details.testUser = signupData.user?.id;
      console.log('✅ Authentication successful, user created:', signupData.user?.id);
    }

    // Step 3: Test team insertion with the test user
    console.log('Step 3: Testing team insertion...');
    if (signupData.user) {
      const testTeamData = {
        user_id: signupData.user.id,
        email: testEmail,
        phone: '+911234567890',
        full_name: 'Debug Test User',
        team_name: `Debug Team ${Date.now()}`,
        college_code: 'DEBUG001',
        is_team_leader: true,
        session_id: `debug_session_${Date.now()}`,
        join_code: 'DEBUG1'
      };

      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert(testTeamData)
        .select()
        .single();

      if (teamError) {
        debugResults.errors.push(`Team insertion failed: ${teamError.message}`);
        console.error('❌ Team insertion failed:', teamError);
        console.error('Team error details:', {
          message: teamError.message,
          details: teamError.details,
          hint: teamError.hint,
          code: teamError.code
        });
      } else {
        debugResults.step4_team_insertion = true;
        debugResults.details.teamCreated = teamData.id;
        console.log('✅ Team insertion successful:', teamData.id);
      }
    }

  } catch (error: any) {
    debugResults.errors.push(`Debug process failed: ${error.message}`);
    console.error('❌ Debug process failed:', error);
  }

  console.log('🐛 Debug results:', debugResults);
  return debugResults;
};
