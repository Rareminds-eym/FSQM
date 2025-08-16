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
      const { error: permError } = await supabase
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
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
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
    const { data: teams, error } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // Get most recent first

    if (error) {
      console.error('Error fetching user team:', error);
      return null;
    }

    if (!teams || teams.length === 0) {
      // No team found
      return null;
    }

    // If multiple teams exist (shouldn't happen but handle gracefully), return the most recent
    if (teams.length > 1) {
      console.warn(`User ${userId} has multiple team records (${teams.length}). Using most recent.`);
    }

    return teams[0];
  } catch (error) {
    console.error('Error in getUserTeam:', error);
    return null;
  }
};

export const upsertUserTeam = async (userId: string, teamData: Partial<TeamData>) => {
  try {
    console.log('🔍 Checking if user exists in team table:', userId);

    // Check if user already exists in team table
    const existingTeam = await getUserTeam(userId);

    if (existingTeam) {
      console.log('✅ User found in team table, updating missing fields...');

      // Prepare update data - only include fields that are provided and different
      const updateData: Partial<Team> = {};

      if (teamData.email && teamData.email !== existingTeam.email) {
        updateData.email = teamData.email.trim();
      }
      if (teamData.phone && teamData.phone !== existingTeam.phone) {
        updateData.phone = teamData.phone.trim();
      }
      if (teamData.fullName && teamData.fullName !== existingTeam.full_name) {
        updateData.full_name = teamData.fullName.trim();
      }
      if (teamData.teamName && teamData.teamName !== existingTeam.team_name) {
        updateData.team_name = teamData.teamName.trim();
      }
      if (teamData.collegeCode && teamData.collegeCode !== existingTeam.college_code) {
        updateData.college_code = teamData.collegeCode.trim().toUpperCase();
      }
      if (teamData.isTeamLeader !== undefined && teamData.isTeamLeader !== existingTeam.is_team_leader) {
        updateData.is_team_leader = teamData.isTeamLeader;
      }

      // Only update if there are changes
      if (Object.keys(updateData).length === 0) {
        console.log('ℹ️ No changes needed, team data is up to date');
        return { team: existingTeam, action: 'no_change' };
      }

      console.log('📝 Updating team with data:', updateData);

      const { data, error } = await supabase
        .from('teams')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating team:', error);
        throw new Error(`Failed to update team: ${error.message}`);
      }

      console.log('🎉 Team updated successfully:', data);
      return { team: data, action: 'updated' };

    } else {
      console.log('❌ User not found in team table, inserting new record...');

      // Validate required fields for insertion
      if (!teamData.email || !teamData.phone || !teamData.fullName || !teamData.teamName || !teamData.collegeCode) {
        throw new Error('Missing required fields for team creation. Required: email, phone, fullName, teamName, collegeCode');
      }

      // Generate unique join code and session ID for new team
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

      // Prepare team record for insertion with validated data
      const teamRecord: Partial<Team> = {
        user_id: userId,
        email: teamData.email.trim(),
        phone: teamData.phone.trim(),
        full_name: teamData.fullName.trim(),
        team_name: teamData.teamName.trim(),
        college_code: teamData.collegeCode.trim().toUpperCase(),
        is_team_leader: teamData.isTeamLeader ?? true,
        join_code: joinCode,
        session_id: sessionId,
        created_at: new Date().toISOString(),
      };

      console.log('📝 Inserting new team record:', teamRecord);

      const { data, error } = await supabase
        .from('teams')
        .insert(teamRecord)
        .select()
        .single();

      if (error) {
        console.error('❌ Error inserting team:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Failed to insert team: ${error.message}`);
      }

      console.log('🎉 Team inserted successfully:', data);
      return { team: data, action: 'inserted', joinCode };
    }

  } catch (error: any) {
    console.error('❌ Error in upsertUserTeam:', error);
    throw error;
  }
};

export const updateUserTeamFields = async (userId: string, fieldsToUpdate: Partial<TeamData>) => {
  try {
    console.log('🔍 Updating specific fields for user:', userId);

    // Check if user exists in team table
    const existingTeam = await getUserTeam(userId);

    if (!existingTeam) {
      throw new Error('User not found in team table. Use upsertUserTeam to create a new record.');
    }

    // Prepare update data - only update provided fields
    const updateData: Partial<Team> = {};

    if (fieldsToUpdate.email !== undefined) {
      updateData.email = fieldsToUpdate.email.trim();
    }
    if (fieldsToUpdate.phone !== undefined) {
      updateData.phone = fieldsToUpdate.phone.trim();
    }
    if (fieldsToUpdate.fullName !== undefined) {
      updateData.full_name = fieldsToUpdate.fullName.trim();
    }
    if (fieldsToUpdate.teamName !== undefined) {
      updateData.team_name = fieldsToUpdate.teamName.trim();
    }
    if (fieldsToUpdate.collegeCode !== undefined) {
      updateData.college_code = fieldsToUpdate.collegeCode.trim().toUpperCase();
    }
    if (fieldsToUpdate.isTeamLeader !== undefined) {
      updateData.is_team_leader = fieldsToUpdate.isTeamLeader;
    }

    if (Object.keys(updateData).length === 0) {
      console.log('ℹ️ No fields provided for update');
      return { team: existingTeam, action: 'no_change' };
    }

    console.log('📝 Updating team fields:', updateData);

    const { data, error } = await supabase
      .from('teams')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating team fields:', error);
      throw new Error(`Failed to update team fields: ${error.message}`);
    }

    console.log('🎉 Team fields updated successfully:', data);
    return { team: data, action: 'updated' };

  } catch (error: any) {
    console.error('❌ Error in updateUserTeamFields:', error);
    throw error;
  }
};

export const insertUserTeamIfNotExists = async (userId: string, teamData: TeamData) => {
  try {
    console.log('🔍 Checking if user exists in team table for insertion:', userId);

    // Check if user already exists in team table
    const existingTeam = await getUserTeam(userId);

    if (existingTeam) {
      console.log('ℹ️ User already exists in team table, no insertion needed');
      return { team: existingTeam, action: 'already_exists' };
    }

    console.log('✅ User not found, proceeding with insertion...');

    // Validate required fields
    if (!teamData.email || !teamData.phone || !teamData.fullName || !teamData.teamName || !teamData.collegeCode) {
      throw new Error('Missing required fields for team creation. Required: email, phone, fullName, teamName, collegeCode');
    }

    // Generate unique join code and session ID
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

    // Prepare team record for insertion
    const teamRecord: Partial<Team> = {
      user_id: userId,
      email: teamData.email.trim(),
      phone: teamData.phone.trim(),
      full_name: teamData.fullName.trim(),
      team_name: teamData.teamName.trim(),
      college_code: teamData.collegeCode.trim().toUpperCase(),
      is_team_leader: teamData.isTeamLeader ?? true,
      join_code: joinCode,
      session_id: sessionId,
      created_at: new Date().toISOString(),
    };

    console.log('📝 Inserting team record:', teamRecord);

    const { data, error } = await supabase
      .from('teams')
      .insert(teamRecord)
      .select()
      .single();

    if (error) {
      console.error('❌ Error inserting team:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Failed to insert team: ${error.message}`);
    }

    console.log('🎉 Team inserted successfully:', data);
    return { team: data, action: 'inserted', joinCode };

  } catch (error: any) {
    console.error('❌ Error in insertUserTeamIfNotExists:', error);
    throw error;
  }
};