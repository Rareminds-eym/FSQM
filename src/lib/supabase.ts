import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Team {
  id?: string;
  user_id?: string;
  email: string;
  phone: string;
  full_name: string;
  team_name: string;
  college_code: string;
  created_at?: string;
  is_team_leader?: boolean;
  session_id?: string;
  join_code?: string;
}

export interface GameUnlock {
  id: number;
  created_at: string;
  is_lock: boolean;
}

// Function to check if the game is locked
export const checkGameLockStatus = async (): Promise<boolean> => {
  try {
    // First check if user has special access based on email
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user?.email) {
      const userEmail = user.email;
      if (userEmail && userEmail.endsWith("@rareminds.in")) {
        console.log('🔓 Special unlock for user:', userEmail);
        return false;
      }
    }

    const { data, error } = await supabase
      .from('game_unlock')
      .select('is_lock')
      .single();

    if (error) {
      console.error('Error checking game lock status:', error);
      // Default to locked if there's an error
      return true;
    }

    return data?.is_lock || false;
  } catch (error) {
    console.error('Error checking game lock status:', error);
    // Default to locked if there's an error
    return true;
  }
};
