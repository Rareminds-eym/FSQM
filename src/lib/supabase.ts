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
