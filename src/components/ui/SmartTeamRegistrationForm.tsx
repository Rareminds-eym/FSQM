import React, { useState, useEffect } from 'react';
import { User, Phone, Users, Mail, Building, Copy, Save } from 'lucide-react';
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

interface SmartTeamRegistrationFormProps {
  onSuccess?: () => void;
}

const SmartTeamRegistrationForm: React.FC<SmartTeamRegistrationFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [userExistsInTeam, setUserExistsInTeam] = useState<boolean | null>(null);
  const [existingTeamData, setExistingTeamData] = useState<any>(null);
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
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Helper function to check if a field is empty or contains "EMPTY"
  const isFieldEmpty = (value: string | null | undefined): boolean => {
    return !value || value.trim() === '' || value.trim().toUpperCase() === 'EMPTY';
  };

  // Helper function to get clean field value
  const getCleanFieldValue = (value: string | null | undefined): string => {
    if (!value || value.trim().toUpperCase() === 'EMPTY') return '';
    return value.trim();
  };

  // Check if user exists in team table and get their data
  useEffect(() => {
    const checkUserInTeam = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const team = await getUserTeam(user.id);
        
        if (team) {
          // User exists in team table
          setUserExistsInTeam(true);
          setExistingTeamData(team);
          
          // Check for missing fields
          const missing = [];
          if (isFieldEmpty(team.email)) missing.push('email');
          if (isFieldEmpty(team.phone)) missing.push('phone');
          if (isFieldEmpty(team.full_name)) missing.push('fullName');
          if (isFieldEmpty(team.team_name)) missing.push('teamName');
          if (isFieldEmpty(team.college_code)) missing.push('collegeCode');
          if (team.is_team_leader === null || team.is_team_leader === undefined) missing.push('isTeamLeader');
          if (team.is_team_leader && isFieldEmpty(team.join_code)) missing.push('joinCode');
          
          setMissingFields(missing);
          
          // Pre-fill form with existing data
          setFormData({
            email: getCleanFieldValue(team.email) || user.email || '',
            phone: getCleanFieldValue(team.phone),
            fullName: getCleanFieldValue(team.full_name),
            teamName: getCleanFieldValue(team.team_name),
            collegeCode: getCleanFieldValue(team.college_code),
            isTeamLeader: team.is_team_leader,
            joinCode: ''
          });
        } else {
          // User doesn't exist in team table
          setUserExistsInTeam(false);
          setMissingFields(['email', 'phone', 'fullName', 'teamName', 'collegeCode', 'isTeamLeader']);
          
          // Pre-fill email from user data
          setFormData(prev => ({
            ...prev,
            email: user.email || ''
          }));
        }
      } catch (error) {
        console.error('Error checking user in team:', error);
        setUserExistsInTeam(false);
        setMissingFields(['email', 'phone', 'fullName', 'teamName', 'collegeCode', 'isTeamLeader']);
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
        teamName: userExistsInTeam ? formData.teamName : '',
        collegeCode: userExistsInTeam ? formData.collegeCode : ''
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
      if (!userExistsInTeam && !formData.joinCode.trim()) {
        toast.error('Join code is required for team members');
        return;
      }
      if (!userExistsInTeam && !prefilledTeam) {
        toast.error('Please enter a valid join code');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (userExistsInTeam) {
        // Update existing team record
        const updateData: any = {
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          full_name: formData.fullName.trim(),
          is_team_leader: formData.isTeamLeader,
        };

        // Only update team fields if user is team leader or if they're changing role
        if (formData.isTeamLeader) {
          updateData.team_name = formData.teamName.trim();
          updateData.college_code = formData.collegeCode.trim().toUpperCase();
          
          // Generate join code if team leader and doesn't have one
          if (isFieldEmpty(existingTeamData?.join_code)) {
            let attempts = 0;
            const maxAttempts = 10;
            let generatedJoinCode = '';
            
            while (attempts < maxAttempts) {
              const code = generateJoinCode();
              const existingTeam = await getTeamByJoinCode(code);
              if (!existingTeam) {
                generatedJoinCode = code;
                break;
              }
              attempts++;
            }
            
            if (generatedJoinCode) {
              updateData.join_code = generatedJoinCode;
            }
          }
        } else if (prefilledTeam) {
          // Team member joining existing team
          updateData.team_name = prefilledTeam.teamName;
          updateData.college_code = prefilledTeam.collegeCode;
          
          // Get the session_id from the existing team
          const existingTeam = await getTeamByJoinCode(formData.joinCode);
          if (existingTeam) {
            updateData.session_id = existingTeam.session_id;
            updateData.join_code = formData.joinCode.toUpperCase();
          }
        }

        const { error } = await supabase
          .from('teams')
          .update(updateData)
          .eq('user_id', user.id);

        if (error) {
          console.error('❌ Team update failed:', error);
          throw new Error(`Failed to update team: ${error.message}`);
        }

        toast.success('Team information updated successfully!');
      } else {
        // Create new team record
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

        if (formData.isTeamLeader) {
          toast.success(`Team created successfully! Your join code is: ${generatedJoinCode}`);
        } else {
          toast.success('Successfully joined the team!');
        }
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('❌ Error in team operation:', error);
      toast.error(error.message || 'Failed to save team information');
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

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <Users className="w-12 h-12 mx-auto text-blue-600 mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">
          {userExistsInTeam ? 'Complete Team Information' : 'Team Registration'}
        </h2>
        <p className="text-gray-600">
          {userExistsInTeam 
            ? `Please complete the following ${missingFields.length} missing fields`
            : 'Complete your team information to continue'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email - Show if missing or if new user */}
        {(!userExistsInTeam || missingFields.includes('email')) && (
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
        )}

        {/* Phone - Show if missing or if new user */}
        {(!userExistsInTeam || missingFields.includes('phone')) && (
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
        )}

        {/* Full Name - Show if missing or if new user */}
        {(!userExistsInTeam || missingFields.includes('fullName')) && (
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
        )}

        {/* Team Leader Selection - Show if missing or if new user */}
        {(!userExistsInTeam || missingFields.includes('isTeamLeader')) && (
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
        )}

        {/* Team Name - Show for team leaders or if missing */}
        {(formData.isTeamLeader === true || (!userExistsInTeam && formData.isTeamLeader !== false) || missingFields.includes('teamName')) && (
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Team Name *
            </label>
            <input
              type="text"
              value={formData.isTeamLeader === false && prefilledTeam ? prefilledTeam.teamName : formData.teamName}
              onChange={(e) => handleInputChange('teamName', e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${
                formData.isTeamLeader === false && prefilledTeam ? 'bg-gray-100 text-gray-600' : ''
              }`}
              placeholder="Enter your team name"
              disabled={formData.isTeamLeader === false && !!prefilledTeam}
              required
            />
          </div>
        )}

        {/* College Code - Show for team leaders or if missing */}
        {(formData.isTeamLeader === true || (!userExistsInTeam && formData.isTeamLeader !== false) || missingFields.includes('collegeCode')) && (
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              <Building className="w-4 h-4 inline mr-1" />
              College Code *
            </label>
            <CollegeCodeDropdown
              value={formData.isTeamLeader === false && prefilledTeam ? prefilledTeam.collegeCode : formData.collegeCode}
              onChange={(value) => handleInputChange('collegeCode', value)}
              placeholder="Select or type college code"
              className="w-full"
              disabled={formData.isTeamLeader === false && !!prefilledTeam}
            />
          </div>
        )}

        {/* Join Code - Show for team members (new users only) */}
        {!userExistsInTeam && formData.isTeamLeader === false && (
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || (!userExistsInTeam && formData.isTeamLeader === false && !prefilledTeam)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {userExistsInTeam ? 'Updating...' : (formData.isTeamLeader ? 'Creating Team...' : 'Joining Team...')}
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              {userExistsInTeam ? 'Update Information' : (formData.isTeamLeader ? 'Create Team' : 'Join Team')}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SmartTeamRegistrationForm;