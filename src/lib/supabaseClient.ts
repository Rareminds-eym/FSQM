import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch data from Supabase with fallback to local data if Supabase fails.
 * @param fetchFn - A function that returns a Supabase query promise.
 * @param fallbackFn - A function that returns local data as a fallback.
 */
export async function fetchWithFallback<T>(
  fetchFn: () => Promise<T>,
  fallbackFn: () => Promise<T> | T
): Promise<T> {
  try {
    return await fetchFn();
  } catch (error) {
    console.warn('Supabase fetch failed, falling back to local data:', error);
    return await fallbackFn();
  }
}
