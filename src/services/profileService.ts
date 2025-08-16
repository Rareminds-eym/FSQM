import { supabase } from '../lib/supabase';
import { getUserTeam } from './teamsService';

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  teamName: string;
  collegeCode: string;
  isTeamLeader: boolean;
  joinCode?: string;
  sessionId?: string;
  createdAt?: string;
}

/**
 * Get user profile information from the teams table
 * This should be used instead of getting profile info from auth.users
 */
export const getUserProfile = async (userId?: string): Promise<UserProfile | null> => {
  try {
    let targetUserId = userId;
    
    // If no userId provided, get from current session
    if (!targetUserId) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('Error getting current user:', error);
        return null;
      }
      targetUserId = user.id;
    }

    // Get user's team information (which contains their profile data)
    const teamData = await getUserTeam(targetUserId);
    
    if (!teamData) {
      console.log('No team data found for user:', targetUserId);
      return null;
    }

    // Map team data to profile format
    const profile: UserProfile = {
      id: teamData.user_id,
      email: teamData.email,
      phone: teamData.phone,
      fullName: teamData.full_name,
      teamName: teamData.team_name,
      collegeCode: teamData.college_code,
      isTeamLeader: teamData.is_team_leader,
      joinCode: teamData.join_code,
      sessionId: teamData.session_id,
      createdAt: teamData.created_at,
    };

    return profile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

/**
 * Get team members for the current user's team
 */
export const getTeamMembersProfile = async (userId?: string): Promise<UserProfile[]> => {
  try {
    let targetUserId = userId;
    
    if (!targetUserId) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('Error getting current user:', error);
        return [];
      }
      targetUserId = user.id;
    }

    // First get the user's team to find the session_id
    const userTeam = await getUserTeam(targetUserId);
    if (!userTeam) {
      return [];
    }

    // Get all team members using the session_id
    const { data: teamMembers, error } = await supabase
      .from('teams')
      .select('*')
      .eq('session_id', userTeam.session_id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    // Map to profile format
    const profiles: UserProfile[] = teamMembers.map(member => ({
      id: member.user_id,
      email: member.email,
      phone: member.phone,
      fullName: member.full_name,
      teamName: member.team_name,
      collegeCode: member.college_code,
      isTeamLeader: member.is_team_leader,
      joinCode: member.join_code,
      sessionId: member.session_id,
      createdAt: member.created_at,
    }));

    return profiles;
  } catch (error) {
    console.error('Error in getTeamMembersProfile:', error);
    return [];
  }
};

/**
 * Update user profile information in the teams table
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Pick<UserProfile, 'phone' | 'fullName'>>
): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.fullName) updateData.full_name = updates.fullName;

    const { error } = await supabase
      .from('teams')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return false;
  }
};