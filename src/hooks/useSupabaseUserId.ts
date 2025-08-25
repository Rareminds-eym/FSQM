import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseSupabaseUserIdResult {
  userId: string | null;
  email: string | null;
  loading: boolean;
}

// Returns the current Supabase user id and email, updating on auth changes
export function useSupabaseUserId(): UseSupabaseUserIdResult {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          if (isMounted) {
            setUserId(null);
            setEmail(null);
          }
        } else {
          const u = data?.user;
          if (isMounted) {
            setUserId(u?.id ?? null);
            setEmail(u?.email ?? null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      if (isMounted) {
        setUserId(u?.id ?? null);
        setEmail(u?.email ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { userId, email, loading };
}