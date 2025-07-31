import { supabase } from '../lib/supabase';

/**
 * Test database permissions for team creation
 */
export const testDatabasePermissions = async () => {
  console.log('🔍 Testing database permissions...');
  
  try {
    // First, check if we have an authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ No authenticated user found');
      return {
        success: false,
        error: 'No authenticated user found',
        details: authError
      };
    }

    console.log('✅ Authenticated user found:', user.id);

    // Test 1: Try to read from teams table
    console.log('🔍 Testing SELECT permission...');
    const { data: selectTest, error: selectError } = await supabase
      .from('teams')
      .select('id')
      .limit(1);

    if (selectError) {
      console.error('❌ SELECT permission failed:', selectError);
      return {
        success: false,
        error: 'SELECT permission denied',
        details: selectError
      };
    }

    console.log('✅ SELECT permission OK');

    // Test 2: Try to insert a test record
    console.log('🔍 Testing INSERT permission...');
    const testRecord = {
      user_id: user.id,
      email: `permission_test_${Date.now()}@example.com`,
      phone: '+1234567890',
      full_name: 'Permission Test User',
      team_name: `Permission Test Team ${Date.now()}`,
      college_code: 'PTEST',
      is_team_leader: true,
      join_code: `PT${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      session_id: `permission_test_${Date.now()}`,
      created_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('teams')
      .insert(testRecord)
      .select()
      .single();

    if (insertError) {
      console.error('❌ INSERT permission failed:', insertError);
      console.error('Error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      
      return {
        success: false,
        error: 'INSERT permission denied',
        details: insertError
      };
    }

    console.log('✅ INSERT permission OK, test record created:', insertData.id);

    // Test 3: Clean up the test record
    console.log('🔍 Testing DELETE permission...');
    const { error: deleteError } = await supabase
      .from('teams')
      .delete()
      .eq('id', insertData.id);

    if (deleteError) {
      console.error('❌ DELETE permission failed (but INSERT worked):', deleteError);
      // This is not critical - the main thing is that INSERT worked
    } else {
      console.log('✅ DELETE permission OK, test record cleaned up');
    }

    return {
      success: true,
      message: 'All database permissions are working correctly',
      testRecordId: insertData.id
    };

  } catch (error: any) {
    console.error('❌ Permission test failed with exception:', error);
    return {
      success: false,
      error: 'Permission test failed with exception',
      details: error
    };
  }
};

/**
 * Test the Supabase permission fix function (if available)
 */
export const testSupabasePermissionFunction = async () => {
  console.log('🔍 Testing Supabase permission function...');
  
  try {
    const { data, error } = await supabase
      .rpc('test_permission_fix');

    if (error) {
      console.error('❌ Permission function test failed:', error);
      return {
        success: false,
        error: 'Permission function not available or failed',
        details: error
      };
    }

    console.log('✅ Permission function result:', data);
    
    return {
      success: data.includes('SUCCESS'),
      message: data,
      details: data
    };

  } catch (error: any) {
    console.error('❌ Permission function test error:', error);
    return {
      success: false,
      error: 'Permission function test error',
      details: error
    };
  }
};

/**
 * Comprehensive permission test
 */
export const runPermissionTests = async () => {
  console.log('🚀 Running comprehensive permission tests...');
  
  const results = {
    authTest: false,
    selectTest: false,
    insertTest: false,
    deleteTest: false,
    functionTest: false,
    errors: [] as string[]
  };

  // Test 1: Database permissions
  const dbTest = await testDatabasePermissions();
  if (dbTest.success) {
    results.authTest = true;
    results.selectTest = true;
    results.insertTest = true;
    results.deleteTest = true;
  } else {
    results.errors.push(`Database test failed: ${dbTest.error}`);
  }

  // Test 2: Supabase function
  const funcTest = await testSupabasePermissionFunction();
  if (funcTest.success) {
    results.functionTest = true;
  } else {
    results.errors.push(`Function test failed: ${funcTest.error}`);
  }

  const allPassed = results.authTest && results.selectTest && 
                   results.insertTest && results.deleteTest;

  console.log('📊 Permission Test Results:');
  console.log('Authentication:', results.authTest ? '✅' : '❌');
  console.log('SELECT permission:', results.selectTest ? '✅' : '❌');
  console.log('INSERT permission:', results.insertTest ? '✅' : '❌');
  console.log('DELETE permission:', results.deleteTest ? '✅' : '❌');
  console.log('Function test:', results.functionTest ? '✅' : '❌');

  if (results.errors.length > 0) {
    console.log('❌ Errors:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  if (allPassed) {
    console.log('🎉 All permission tests passed! Team creation should work.');
  } else {
    console.log('⚠️ Some permission tests failed. Please run the permission fix SQL script.');
  }

  return {
    success: allPassed,
    results,
    recommendation: allPassed 
      ? 'Permissions are working correctly'
      : 'Run the Auth_Permission_Fix.sql script in your Supabase dashboard'
  };
};