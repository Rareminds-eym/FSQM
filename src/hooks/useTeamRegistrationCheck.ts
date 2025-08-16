import { useState, useEffect } from 'react';
import { useAuth } from '../components/home/AuthContext';
import { getUserTeam } from '../services/teamsService';

interface TeamRegistrationStatus {
  isLoading: boolean;
  needsRegistration: boolean;
  hasTeam: boolean;
  error: string | null;
}

export const useTeamRegistrationCheck = (): TeamRegistrationStatus => {
  const { user } = useAuth();
  const [status, setStatus] = useState<TeamRegistrationStatus>({
    isLoading: true,
    needsRegistration: false,
    hasTeam: false,
    error: null
  });

  useEffect(() => {
    const checkTeamRegistration = async () => {
      if (!user?.id) {
        setStatus({
          isLoading: false,
          needsRegistration: false,
          hasTeam: false,
          error: 'User not authenticated'
        });
        return;
      }

      try {
        setStatus(prev => ({ ...prev, isLoading: true, error: null }));
        
        const team = await getUserTeam(user.id);
        
        setStatus({
          isLoading: false,
          needsRegistration: !team,
          hasTeam: !!team,
          error: null
        });
      } catch (error: any) {
        console.error('Error checking team registration:', error);
        setStatus({
          isLoading: false,
          needsRegistration: true, // Assume needs registration on error
          hasTeam: false,
          error: error.message || 'Failed to check team registration'
        });
      }
    };

    checkTeamRegistration();
  }, [user?.id]);

  return status;
};