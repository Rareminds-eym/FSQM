import { User } from '@supabase/supabase-js';

/**
 * Get display name for user with smart fallbacks
 */
export const getDisplayName = (user: User | null): string => {
  if (!user) return 'Guest';
  
  // Try user metadata full_name first
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  }
  
  // Try app metadata full_name
  if (user.app_metadata?.full_name) {
    return user.app_metadata.full_name;
  }
  
  // Try email username (part before @)
  if (user.email) {
    const emailUsername = user.email.split('@')[0];
    // Capitalize first letter and replace dots/underscores with spaces
    return emailUsername
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
  
  // Final fallback
  return 'Player';
};

/**
 * Format team role for display
 */
export const formatTeamRole = (isTeamLeader: boolean): string => {
  return isTeamLeader ? 'Team Leader' : 'Team Member';
};

/**
 * Get team role with icon
 */
export const getTeamRoleWithIcon = (isTeamLeader: boolean): string => {
  return isTeamLeader ? '👑 Team Leader' : '👤 Team Member';
};

/**
 * Format join code for display (adds spacing for readability)
 */
export const formatJoinCode = (joinCode: string): string => {
  if (!joinCode) return '';
  
  // Add space every 3 characters for better readability
  return joinCode.replace(/(.{3})/g, '$1 ').trim();
};

/**
 * Validate join code format
 */
export const isValidJoinCode = (joinCode: string): boolean => {
  // Join codes should be 6 characters, alphanumeric
  const joinCodeRegex = /^[A-Z0-9]{6}$/;
  return joinCodeRegex.test(joinCode.toUpperCase());
};

/**
 * Copy text to clipboard with fallback
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Get user initials for avatar fallback
 */
export const getUserInitials = (user: User | null): string => {
  const displayName = getDisplayName(user);
  
  const words = displayName.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return 'PL'; // Player
};

/**
 * Format email for display (truncate if too long)
 */
export const formatEmailForDisplay = (email: string, maxLength: number = 25): string => {
  if (!email) return '';
  
  if (email.length <= maxLength) {
    return email;
  }
  
  const [username, domain] = email.split('@');
  const truncatedUsername = username.length > 10 
    ? username.substring(0, 10) + '...' 
    : username;
  
  return `${truncatedUsername}@${domain}`;
};