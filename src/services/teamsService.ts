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
    // Try to get user, with retries if needed
    let user = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (!user && attempts < maxAttempts) {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error getting user in createTeam:', error);
      }

      if (currentUser) {
        user = currentUser;
        break;
      }

      if (attempts < maxAttempts - 1) {
        console.log(`Retrying user fetch in createTeam, attempt ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      attempts++;
    }

    if (!user) {
      throw new Error('User not authenticated - please try logging in again');
    }

    console.log('Creating team for authenticated user:', user.id);

    // Check if user already has a team
    const existingTeam = await getUserTeam(user.id);
    if (existingTeam) {
      throw new Error('User already belongs to a team');
    }

    // Generate a unique join code (ensure it's unique)
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

    const sessionId = generateSessionId();

    const teamRecord: Partial<Team> = {
      user_id: user.id,
      email: teamData.email,
      phone: teamData.phone,
      full_name: teamData.fullName,
      team_name: teamData.teamName,
      college_code: teamData.collegeCode,
      is_team_leader: true,
      join_code: joinCode,
      session_id: sessionId,
      created_at: new Date().toISOString(),
    };

    console.log('Creating team with data:', teamRecord);

    const { data, error } = await supabase
      .from('teams')
      .insert(teamRecord)
      .select()
      .single();

    if (error) {
      console.error('Error creating team:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Team created successfully:', data);
    return { team: data, joinCode };
  } catch (error) {
    console.error('Error in createTeam:', error);
    throw error;
  }
};

export const joinTeam = async (teamData: TeamData, joinCode: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user already has a team
    const existingUserTeam = await getUserTeam(user.id);
    if (existingUserTeam) {
      throw new Error('User already belongs to a team');
    }

    // First, get the team by join code
    const existingTeam = await getTeamByJoinCode(joinCode);

    if (!existingTeam) {
      throw new Error('Team not found with the provided join code');
    }

    // Check team size limit (max 4 members)
    const teamMembers = await getTeamMembers(existingTeam.session_id);
    if (teamMembers.length >= 4) {
      throw new Error('Team is already full (maximum 4 members)');
    }

    // Check if user email is already in this team (prevent duplicates)
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

    console.log('Joining team with data:', teamRecord);

    const { data, error } = await supabase
      .from('teams')
      .insert(teamRecord)
      .select()
      .single();

    if (error) {
      console.error('Error joining team:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Successfully joined team:', data);
    return { team: data };
  } catch (error) {
    console.error('Error in joinTeam:', error);
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
