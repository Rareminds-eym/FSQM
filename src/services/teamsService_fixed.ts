import { supabase } from '../lib/supabase';
import { Team } from '../lib/supabase';

export interface TeamData {
  email: string;
  phone: string;
  fullName: string;
  teamName: string;
  collegeCode: string;
  isTeamLeader: boolean;
  joinCode?: string;
  userId?: string;
}

export const getTeamByJoinCode = async (joinCode: string) => {
  try {
    const { data: teams, error } = await supabase
      .from('teams')
      .select('*')
      .eq('join_code', joinCode.trim().toUpperCase())
      .limit(1);

    if (error) {
      console.error('Error fetching team by join code:', error);
      return null;
    }

    if (!teams || teams.length === 0) {
      return null;
    }

    return teams[0];
  } catch (error) {
    console.error('Error in getTeamByJoinCode:', error);
    return null;
  }
};

export const createTeam = async (teamData: TeamData) => {
  try {
    console.log('🚀 Starting team creation process...');
    console.log('📋 TeamData received:', teamData);

    let user = null;

    // Strategy 1: Use provided userId if available
    if (teamData.userId) {
      console.log('🔍 Using provided userId:', teamData.userId);
      
      // Create a mock user object for now - we'll verify permissions later
      user = { id: teamData.userId };
      console.log('✅ Using provided user ID');
    }

    // Strategy 2: Try to get from current session if no userId provided
    if (!user) {
      console.log('🔍 No userId provided, attempting to get from session...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (session?.user && !sessionError) {
        user = session.user;
        console.log('✅ Got user from session:', user.id);
      } else {
        console.log('❌ Session check failed:', sessionError);
      }
    }

    // Strategy 3: Try getUser() as fallback
    if (!user) {
      console.log('🔍 Trying getUser() as fallback...');
      
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authUser && !authError) {
        user = authUser;
        console.log('✅ Got user from getUser():', user.id);
      } else {
        console.log('❌ getUser() failed:', authError);
      }
    }

    if (!user) {
      console.error('❌ Failed to authenticate user');
      throw new Error('Authentication failed - please log in and try again');
    }

    console.log('✅ User authenticated:', user.id);

    // Test database permissions before proceeding
    console.log('🔍 Testing database permissions...');
    try {
      const { data: permTest, error: permError } = await supabase
        .from('teams')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (permError && permError.code !== 'PGRST116') {
        console.error('❌ Permission test failed:', permError);
        throw new Error(`Database permission error: ${permError.message}`);
      }
      console.log('✅ Database permissions OK');
    } catch (permissionError: any) {
      console.error('❌ Permission verification failed:', permissionError);
      throw new Error(`Database access error: ${permissionError.message}`);
    }

    // Check if user already has a team
    console.log('🔍 Checking if user already has a team...');
    const existingTeam = await getUserTeam(user.id);
    if (existingTeam) {
      console.log('❌ User already has a team:', existingTeam.team_name);
      throw new Error('User already belongs to a team');
    }
    console.log('✅ User does not have an existing team');

    // Generate unique join code
    console.log('🔍 Generating unique join code...');
    let joinCode = generateJoinCode();
    let codeAttempts = 0;
    const maxCodeAttempts = 10;

    while (codeAttempts < maxCodeAttempts) {
      const existingCodeTeam = await getTeamByJoinCode(joinCode);
      if (!existingCodeTeam) {
        break; // Code is unique
      }
      joinCode = generateJoinCode();
      codeAttempts++;
    }

    if (codeAttempts >= maxCodeAttempts) {
      throw new Error('Failed to generate unique join code');
    }
    console.log('✅ Generated unique join code:', joinCode);

    const sessionId = generateSessionId();

    // Prepare team record
    const teamRecord: Partial<Team> = {
      user_id: user.id,
      email: teamData.email.trim(),
      phone: teamData.phone.trim(),
      full_name: teamData.fullName.trim(),
      team_name: teamData.teamName.trim(),
      college_code: teamData.collegeCode.trim().toUpperCase(),
      is_team_leader: true,
      join_code: joinCode,
      session_id: sessionId,
      created_at: new Date().toISOString(),
    };

    console.log('📝 Creating team with record:', teamRecord);

    // Insert team record
    const { data, error } = await supabase
      .from('teams')
      .insert(teamRecord)
      .select()
      .single();

    if (error) {
      console.error('❌ Team creation failed:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        statusCode: (error as any).statusCode
      });

      // Provide specific error messages
      if (error.code === '23505') {
        throw new Error('A team with this information already exists');
      } else if (error.code === '42501') {
        throw new Error('Database permission denied - please contact support');
      } else if (error.code === '23503') {
        throw new Error('User authentication issue - please log in again');
      } else if (error.message.includes('permission denied')) {
        throw new Error('Database access denied - please contact support');
      } else if (error.message.includes('not authenticated')) {
        throw new Error('Authentication expired - please log in again');
      } else {
        throw new Error(`Team creation failed: ${error.message}`);
      }
    }

    if (!data) {
      throw new Error('Team creation succeeded but no data returned');
    }

    console.log('🎉 Team created successfully:', data);
    return { team: data, joinCode };

  } catch (error: any) {
    console.error('❌ Error in createTeam:', error);
    throw error;
  }
};

export const joinTeam = async (teamData: TeamData, joinCode: string) => {
  try {
    console.log('🚀 Starting team join process...');
    
    let user = null;

    // Try to get user (similar strategy as createTeam)
    if (teamData.userId) {
      user = { id: teamData.userId };
      console.log('✅ Using provided userId for join:', teamData.userId);
    } else {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      if (authUser && !error) {
        user = authUser;
        console.log('✅ Got user from auth for join:', user.id);
      }
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user already has a team
    const existingUserTeam = await getUserTeam(user.id);
    if (existingUserTeam) {
      throw new Error('User already belongs to a team');
    }

    // Get the team by join code
    const existingTeam = await getTeamByJoinCode(joinCode);
    if (!existingTeam) {
      throw new Error('Team not found with the provided join code');
    }

    // Check team size limit
    const teamMembers = await getTeamMembers(existingTeam.session_id);
    if (teamMembers.length >= 4) {
      throw new Error('Team is already full (maximum 4 members)');
    }

    // Check for duplicate email
    const emailExists = teamMembers.some(member => member.email === teamData.email);
    if (emailExists) {
      throw new Error('This email is already registered in the team');
    }

    const teamRecord: Partial<Team> = {
      user_id: user.id,
      email: teamData.email,
      phone: teamData.phone,
      full_name: teamData.fullName,
      team_name: existingTeam.team_name,
      college_code: existingTeam.college_code,
      is_team_leader: false,
      join_code: existingTeam.join_code,
      session_id: existingTeam.session_id,
      created_at: new Date().toISOString(),
    };

    console.log('📝 Joining team with data:', teamRecord);

    const { data, error } = await supabase
      .from('teams')
      .insert(teamRecord)
      .select()
      .single();

    if (error) {
      console.error('❌ Error joining team:', error);
      throw error;
    }

    console.log('🎉 Successfully joined team:', data);
    return { team: data };
  } catch (error) {
    console.error('❌ Error in joinTeam:', error);
    throw error;
  }
};

// Helper function to generate a 6-character join code
const generateJoinCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper function to generate a session ID
const generateSessionId = (): string => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const getTeamMembers = async (sessionId: string) => {
  try {
    const { data: members, error } = await supabase
      .from('teams')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    return members || [];
  } catch (error) {
    console.error('Error in getTeamMembers:', error);
    return [];
  }
};

export const getUserTeam = async (userId: string) => {
  try {
    const { data: team, error } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No team found
        return null;
      }
      console.error('Error fetching user team:', error);
      return null;
    }

    return team;
  } catch (error) {
    console.error('Error in getUserTeam:', error);
    return null;
  }
};