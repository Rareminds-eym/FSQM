import { getUserTeam } from '../services/teamsService';

/**
 * Test function to check if team registration system is working
 * This can be called from browser console for testing
 */
export const testTeamRegistration = async (userId?: string) => {
  try {
    console.log('🧪 Testing Team Registration System...');
    
    if (!userId) {
      console.error('❌ No userId provided. Usage: testTeamRegistration("user-id-here")');
      return;
    }

    console.log(`🔍 Checking user: ${userId}`);
    
    const team = await getUserTeam(userId);
    
    if (team) {
      console.log('✅ User found in teams table:');
      console.log('📋 Team data:', {
        id: team.id,
        team_name: team.team_name,
        full_name: team.full_name,
        email: team.email,
        phone: team.phone,
        college_code: team.college_code,
        is_team_leader: team.is_team_leader,
        join_code: team.join_code,
        session_id: team.session_id
      });
      
      // Check for missing fields
      const missingFields = [];
      if (!team.email || team.email.trim() === '' || team.email.toUpperCase() === 'EMPTY') {
        missingFields.push('email');
      }
      if (!team.phone || team.phone.trim() === '' || team.phone.toUpperCase() === 'EMPTY') {
        missingFields.push('phone');
      }
      if (!team.full_name || team.full_name.trim() === '' || team.full_name.toUpperCase() === 'EMPTY') {
        missingFields.push('full_name');
      }
      if (!team.team_name || team.team_name.trim() === '' || team.team_name.toUpperCase() === 'EMPTY') {
        missingFields.push('team_name');
      }
      if (!team.college_code || team.college_code.trim() === '' || team.college_code.toUpperCase() === 'EMPTY') {
        missingFields.push('college_code');
      }
      if (team.is_team_leader === null || team.is_team_leader === undefined) {
        missingFields.push('is_team_leader');
      }
      
      if (missingFields.length > 0) {
        console.log('⚠️ Missing fields detected:', missingFields);
        console.log('📝 Registration form should show for these fields');
      } else {
        console.log('✅ All required fields are present');
      }
      
    } else {
      console.log('❌ User NOT found in teams table');
      console.log('📝 Registration modal should appear automatically');
    }
    
  } catch (error) {
    console.error('❌ Error testing team registration:', error);
  }
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testTeamRegistration = testTeamRegistration;
}