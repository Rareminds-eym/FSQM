import { supabase } from '../lib/supabase';

/**
 * Comprehensive test to verify database setup and team creation functionality
 */
export const runDatabaseTests = async () => {
  console.log('🧪 Starting comprehensive database tests...');
  
  const results = {
    connectionTest: false,
    authTest: false,
    permissionTest: false,
    teamInsertTest: false,
    cleanupTest: false,
    errors: [] as string[]
  };

  try {
    // Test 1: Basic connection
    console.log('Test 1: Testing database connection...');
    const { data: connectionData, error: connectionError } = await supabase
      .from('teams')
      .select('count(*)')
      .limit(1);

    if (connectionError) {
      results.errors.push(`Connection failed: ${connectionError.message}`);
      console.error('❌ Connection test failed:', connectionError);
    } else {
      results.connectionTest = true;
      console.log('✅ Connection test passed');
    }

    // Test 2: Authentication
    console.log('Test 2: Testing authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      results.errors.push(`Authentication failed: ${authError?.message || 'No user found'}`);
      console.error('❌ Auth test failed - please log in first');
      return results;
    } else {
      results.authTest = true;
      console.log('✅ Authentication test passed, user:', user.id);
    }

    // Test 3: Permission check
    console.log('Test 3: Testing database permissions...');
    try {
      // Test if we can call the permission check function
      const { data: permData, error: permError } = await supabase
        .rpc('check_user_permissions', { p_user_id: user.id });

      if (permError) {
        console.log('Permission function not available, testing manually...');
        
        // Manual permission test
        const { data: manualTest, error: manualError } = await supabase
          .from('teams')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (manualError && manualError.code !== 'PGRST116') {
          results.errors.push(`Permission test failed: ${manualError.message}`);
          console.error('❌ Manual permission test failed:', manualError);
        } else {
          results.permissionTest = true;
          console.log('✅ Manual permission test passed');
        }
      } else {
        results.permissionTest = true;
        console.log('✅ Permission test passed:', permData);
      }
    } catch (error: any) {
      results.errors.push(`Permission test error: ${error.message}`);
      console.error('❌ Permission test error:', error);
    }

    // Test 4: Team insertion test
    console.log('Test 4: Testing team insertion...');
    const testTeamData = {
      user_id: user.id,
      email: `test_${Date.now()}@example.com`,
      phone: '+911234567890',
      full_name: 'Database Test User',
      team_name: `Test Team ${Date.now()}`,
      college_code: 'DBTEST',
      is_team_leader: true,
      session_id: `test_session_${Date.now()}`,
      join_code: `TST${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      created_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('teams')
      .insert(testTeamData)
      .select()
      .single();

    if (insertError) {
      results.errors.push(`Team insertion failed: ${insertError.message}`);
      console.error('❌ Team insertion test failed:', insertError);
      console.error('Error details:', {
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      });
    } else {
      results.teamInsertTest = true;
      console.log('✅ Team insertion test passed:', insertData.id);

      // Test 5: Cleanup
      console.log('Test 5: Testing cleanup (delete test record)...');
      const { error: deleteError } = await supabase
        .from('teams')
        .delete()
        .eq('id', insertData.id);

      if (deleteError) {
        results.errors.push(`Cleanup failed: ${deleteError.message}`);
        console.error('❌ Cleanup test failed:', deleteError);
      } else {
        results.cleanupTest = true;
        console.log('✅ Cleanup test passed');
      }
    }

  } catch (error: any) {
    results.errors.push(`Test suite error: ${error.message}`);
    console.error('❌ Test suite error:', error);
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('Connection:', results.connectionTest ? '✅' : '❌');
  console.log('Authentication:', results.authTest ? '✅' : '❌');
  console.log('Permissions:', results.permissionTest ? '✅' : '❌');
  console.log('Team Insertion:', results.teamInsertTest ? '✅' : '❌');
  console.log('Cleanup:', results.cleanupTest ? '✅' : '❌');

  if (results.errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  const allTestsPassed = results.connectionTest && results.authTest && 
                        results.permissionTest && results.teamInsertTest && 
                        results.cleanupTest;

  if (allTestsPassed) {
    console.log('\n🎉 All tests passed! Your database is properly configured.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above and fix the database configuration.');
  }

  return results;
};

/**
 * Quick test to verify if team creation will work
 */
export const quickTeamCreationTest = async () => {
  console.log('🚀 Quick team creation test...');
  
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ Not authenticated. Please log in first.');
      return false;
    }

    // Check if user already has a team
    const { data: existingTeam, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (teamError && teamError.code !== 'PGRST116') {
      console.error('❌ Error checking existing team:', teamError);
      return false;
    }

    if (existingTeam) {
      console.log('ℹ️ User already has a team:', existingTeam.team_name);
      return true; // This is actually good - means the system is working
    }

    // Test basic insert permission
    const testData = {
      user_id: user.id,
      email: 'permission_test@example.com',
      phone: '+911234567890',
      full_name: 'Permission Test',
      team_name: 'Permission Test Team',
      college_code: 'PTEST',
      is_team_leader: true,
      session_id: `perm_test_${Date.now()}`,
      join_code: 'PTEST1'
    };

    const { data, error } = await supabase
      .from('teams')
      .insert(testData)
      .select()
      .single();

    if (error) {
      console.error('❌ Permission test failed:', error.message);
      return false;
    }

    // Clean up test record
    await supabase.from('teams').delete().eq('id', data.id);
    
    console.log('✅ Quick test passed! Team creation should work.');
    return true;

  } catch (error: any) {
    console.error('❌ Quick test error:', error.message);
    return false;
  }
};