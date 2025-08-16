import { getUserTeam } from '../services/teamsService';

/**
 * Check if a user exists in the teams table
 * @param userId - The user ID to check
 * @returns Promise<boolean> - true if user exists in teams table, false otherwise
 */
export const checkUserExistsInTeamsTable = async (userId: string): Promise<boolean> => {
  try {
    const team = await getUserTeam(userId);
    return !!team;
  } catch (error) {
    console.error('Error checking user in teams table:', error);
    return false;
  }
};

/**
 * Check if user has complete team information
 * @param userId - The user ID to check
 * @returns Promise<{exists: boolean, isComplete: boolean, missingFields: string[]}> 
 */
export const checkTeamRegistrationStatus = async (userId: string) => {
  try {
    const team = await getUserTeam(userId);
    
    if (!team) {
      return {
        exists: false,
        isComplete: false,
        missingFields: ['email', 'phone', 'full_name', 'team_name', 'college_code', 'is_team_leader']
      };
    }

    const missingFields: string[] = [];
    
    // Check for empty or null fields
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
    if (team.is_team_leader && (!team.join_code || team.join_code.trim() === '' || team.join_code.toUpperCase() === 'EMPTY')) {
      missingFields.push('join_code');
    }

    return {
      exists: true,
      isComplete: missingFields.length === 0,
      missingFields,
      team
    };
  } catch (error) {
    console.error('Error checking team registration status:', error);
    return {
      exists: false,
      isComplete: false,
      missingFields: ['unknown'],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};