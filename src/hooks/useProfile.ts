import { useState, useEffect } from 'react';
import { useAuth } from '../components/home/AuthContext';
import { getUserProfile, getTeamMembersProfile, UserProfile } from '../services/profileService';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadProfile = async () => {
    if (!user) {
      setProfile(null);
      setTeamMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load user profile from teams table
      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);

      // Load team members
      const members = await getTeamMembersProfile(user.id);
      setTeamMembers(members);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  return {
    profile,
    teamMembers,
    loading,
    error,
    refetch: loadProfile,
  };
};

export default useProfile;