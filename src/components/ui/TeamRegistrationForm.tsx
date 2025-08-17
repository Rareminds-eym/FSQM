import React, { useState, useEffect } from 'react';
import { User, Phone, Users, Mail, Building, Copy } from 'lucide-react';
import { useAuth } from '../home/AuthContext';
import { getUserTeam, getTeamByJoinCode } from '../../services/teamsService';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import CollegeCodeDropdown from './CollegeCodeDropdown';

interface TeamFormData {
  email: string;
  phone: string;
  fullName: string;
  teamName: string;
  collegeCode: string;
  isTeamLeader: boolean | null;
  joinCode: string;
}

interface PrefilledTeam {
  teamName: string;
  collegeCode: string;
}

interface TeamRegistrationFormProps {
  onSuccess?: () => void;
}

const TeamRegistrationForm: React.FC<TeamRegistrationFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [userExistsInTeam, setUserExistsInTeam] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<TeamFormData>({
    email: '',
    phone: '',
    fullName: '',
    teamName: '',
    collegeCode: '',
    isTeamLeader: null,
    joinCode: ''
  });
  const [prefilledTeam, setPrefilledTeam] = useState<PrefilledTeam | null>(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user exists in team table
  useEffect(() => {
    const checkUserInTeam = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const team = await getUserTeam(user.id);
        setUserExistsInTeam(!!team);
        
        if (!team) {
          // Pre-fill email from user data
          setFormData(prev => ({
            ...prev,
            email: user.email || ''
          }));
        }
      } catch (error) {
        console.error('Error checking user in team:', error);
        setUserExistsInTeam(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserInTeam();
  }, [user]);

  // Handle form input changes
  const handleInputChange = (field: keyof TeamFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Specific handler for team name to prevent issues
  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      teamName: value
    }));
  };

  // Handle team leader selection
  const handleTeamLeaderChange = (isLeader: boolean) => {
    if (isLeader) {
      // Becoming team leader - clear join code, enable team fields
      setFormData(prev => ({
        ...prev,
        isTeamLeader: true,
        joinCode: ''
      }));
      setPrefilledTeam(null);
    } else {
      // Becoming team member - clear team fields, enable join code
      setFormData(prev => ({
        ...prev,
        isTeamLeader: false,
        teamName: '',
        collegeCode: ''
      }));
    }
  };

  // Handle join code lookup
  const handleJoinCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const joinCode = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, joinCode }));

    if (joinCode.length === 6) {
      setIsLoadingTeam(true);
      try {
        const teamInfo = await getTeamByJoinCode(joinCode);
        if (teamInfo) {
          setPrefilledTeam({
            teamName: teamInfo.team_name,
            collegeCode: teamInfo.college_code,
          });
          toast.success(`Found team: ${teamInfo.team_name}`);
        }
      } catch (error: any) {
        setPrefilledTeam(null);
        toast.error("Invalid join code or team not found");
      } finally {
        setIsLoadingTeam(false);
      }
    } else {
      setPrefilledTeam(null);
    }
  };

  // Generate unique join code
  const generateJoinCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    // Validation
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    if (formData.phone.trim().length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (formData.isTeamLeader === null) {
      toast.error('Please specify if you are a team leader');
      return;
    }

    if (formData.isTeamLeader) {
      if (!formData.teamName.trim()) {
        toast.error('Team name is required for team leaders');
        return;
      }
      if (!formData.collegeCode.trim()) {
        toast.error('College code is required for team leaders');
        return;
      }
    } else {
      if (!formData.joinCode.trim()) {
        toast.error('Join code is required for team members');
        return;
      }
      if (!prefilledTeam) {
        toast.error('Please enter a valid join code');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Generate unique join code for team leaders
      let generatedJoinCode = '';
      if (formData.isTeamLeader) {
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
          const code = generateJoinCode();
          const existingTeam = await getTeamByJoinCode(code);
          if (!existingTeam) {
            generatedJoinCode = code;
            break;
          }
          attempts++;
        }
        
        if (!generatedJoinCode) {
          throw new Error('Failed to generate unique join code');
        }
      }

      // Generate session ID
      const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);

      // Prepare team record
      const teamRecord = {
        user_id: user.id,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        full_name: formData.fullName.trim(),
        team_name: formData.isTeamLeader 
          ? formData.teamName.trim() 
          : (prefilledTeam ? prefilledTeam.teamName : ''),
        college_code: formData.isTeamLeader 
          ? formData.collegeCode.trim().toUpperCase() 
          : (prefilledTeam ? prefilledTeam.collegeCode : ''),
        is_team_leader: formData.isTeamLeader,
        join_code: formData.isTeamLeader ? generatedJoinCode : formData.joinCode.toUpperCase(),
        session_id: formData.isTeamLeader ? sessionId : (await getTeamByJoinCode(formData.joinCode))?.session_id,
        created_at: new Date().toISOString(),
      };

      console.log('📝 Creating team record:', teamRecord);

      const { data, error } = await supabase
        .from('teams')
        .insert(teamRecord)
        .select()
        .single();

      if (error) {
        console.error('❌ Team creation failed:', error);
        
        if (error.code === '23505') {
          throw new Error('A team with this information already exists');
        } else if (error.code === '42501') {
          throw new Error('Database permission denied - please contact support');
        } else if (error.code === '23503') {
          throw new Error('User authentication issue - please log in again');
        } else {
          throw new Error(`Team creation failed: ${error.message}`);
        }
      }

      console.log('🎉 Team created successfully:', data);
      
      if (formData.isTeamLeader) {
        toast.success(`Team created successfully! Your join code is: ${generatedJoinCode}`);
      } else {
        toast.success('Successfully joined the team!');
      }

      // Refresh the page or update state to show the user now exists in team
      setUserExistsInTeam(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('❌ Error in team creation:', error);
      toast.error(error.message || 'Failed to create/join team');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Checking team status...</span>
      </div>
    );
  }

  if (userExistsInTeam) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 mb-2">
          <Users className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Team Registration Complete
        </h3>
        <p className="text-green-700">
          You are already registered in the teams table. You can view your team information in your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <Users className="w-12 h-12 mx-auto text-blue-600 mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Team Registration</h2>
        <p className="text-gray-600">Complete your team information to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number *
          </label>
          <div className="flex items-center">
            <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg text-gray-700">
              +91
            </span>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:border-blue-500"
              placeholder="10-digit phone number"
              maxLength={10}
              required
            />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Team Leader Selection */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Are you the team leader? *
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                formData.isTeamLeader === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTeamLeaderChange(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                formData.isTeamLeader === false
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTeamLeaderChange(false)}
            >
              No
            </button>
          </div>
        </div>

        {/* Team Name - Show for team leaders */}
        {formData.isTeamLeader === true && (
          <div key="team-name-field">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Team Name *
            </label>
            <input
              type="text"
              value={formData.teamName}
              onChange={handleTeamNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your team name"
              required
              autoComplete="off"
            />
          </div>
        )}

        {/* College Code - Show for team leaders */}
        {formData.isTeamLeader === true && (
          <div key="college-code-field">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              <Building className="w-4 h-4 inline mr-1" />
              College Code *
            </label>
            <CollegeCodeDropdown
              value={formData.collegeCode}
              onChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  collegeCode: value
                }));
              }}
              placeholder="Select or type college code"
              className="w-full"
            />
          </div>
        )}

        {/* Join Code - Show for team members */}
        {formData.isTeamLeader === false && (
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              <Copy className="w-4 h-4 inline mr-1" />
              Join Code *
            </label>
            <input
              type="text"
              value={formData.joinCode}
              onChange={handleJoinCodeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 uppercase"
              placeholder="Enter 6-character join code"
              maxLength={6}
              style={{ textTransform: 'uppercase' }}
              required
            />
            {isLoadingTeam && (
              <p className="text-sm text-blue-600 mt-1">Looking up team...</p>
            )}
            {prefilledTeam && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded mt-2">
                <p>✓ Team: {prefilledTeam.teamName}</p>
                <p>✓ College: {prefilledTeam.collegeCode}</p>
              </div>
            )}
          </div>
        )}

        {/* Team Name - Show for team members (read-only) */}
        {formData.isTeamLeader === false && prefilledTeam && (
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Team Name
            </label>
            <input
              type="text"
              value={prefilledTeam.teamName}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              disabled
            />
          </div>
        )}

        {/* College Code - Show for team members (read-only) */}
        {formData.isTeamLeader === false && prefilledTeam && (
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              <Building className="w-4 h-4 inline mr-1" />
              College Code
            </label>
            <input
              type="text"
              value={prefilledTeam.collegeCode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              disabled
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || (formData.isTeamLeader === false && !prefilledTeam)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {formData.isTeamLeader ? 'Creating Team...' : 'Joining Team...'}
            </div>
          ) : (
            formData.isTeamLeader ? 'Create Team' : 'Join Team'
          )}
        </button>
      </form>
    </div>
  );
};

export default TeamRegistrationForm;