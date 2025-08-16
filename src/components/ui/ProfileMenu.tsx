import { LogOut, User, ChevronDown, Mail, Users, Copy, Edit3, Save, X, Phone, Building } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../home/AuthContext';
import { getUserTeam, getTeamByJoinCode } from '../../services/teamsService';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';
import CollegeCodeDropdown from './CollegeCodeDropdown';


interface TeamInfo {
  id: string;
  team_name: string;
  join_code: string;
  college_code: string;
  is_team_leader: boolean;
  full_name: string;
  phone: string;
}

interface EditFormData {
  full_name: string;
  phone: string;
  team_name: string;
  college_code: string;
  is_team_leader: boolean | null;
  joinCode: string;
}

interface PrefilledTeam {
  teamName: string;
  collegeCode: string;
}

const ProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    full_name: '',
    phone: '',
    team_name: '',
    college_code: '',
    is_team_leader: null,
    joinCode: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [prefilledTeam, setPrefilledTeam] = useState<PrefilledTeam | null>(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [userExistsInTeam, setUserExistsInTeam] = useState<boolean | null>(null);

  // Helper function to check if a field is empty or contains "EMPTY"
  const isFieldEmpty = (value: string | null | undefined): boolean => {
    return !value || value.trim() === '' || value.trim().toUpperCase() === 'EMPTY';
  };

  // Helper function to get clean field value (replace "EMPTY" with empty string)
  const getCleanFieldValue = (value: string | null | undefined): string => {
    if (!value || value.trim().toUpperCase() === 'EMPTY') return '';
    return value.trim();
  };

  // Get user's display name with fix for incorrect "karthik" value
  const getDisplayName = () => {
    console.log('🔍 Getting display name...');
    console.log('User metadata:', user?.user_metadata);
    console.log('Team info:', teamInfo);

    // Priority 1: Try team data full_name (if not "karthik")
    if (teamInfo?.full_name &&
      teamInfo.full_name.trim() !== '' &&
      teamInfo.full_name.toLowerCase() !== 'karthik') {
      console.log('✅ Using team full_name:', teamInfo.full_name);
      return teamInfo.full_name;
    }

    // Priority 2: Try user metadata full_name (if not "karthik")
    if (user?.user_metadata?.full_name &&
      user.user_metadata.full_name.trim() !== '' &&
      user.user_metadata.full_name.toLowerCase() !== 'karthik') {
      console.log('✅ Using user_metadata.full_name:', user.user_metadata.full_name);
      return user.user_metadata.full_name;
    }

    // Priority 3: Use email username (properly formatted)
    if (user?.email) {
      const emailUsername = user.email.split('@')[0]; // "gokul"
      const formattedName = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1); // "Gokul"
      console.log('✅ Using formatted email username:', formattedName);
      return formattedName;
    }

    console.log('❌ Using fallback: Player');
    return 'Player';
  };



  // Load team information when component mounts
  useEffect(() => {
    const loadTeamInfo = async () => {
      if (user?.id && !teamInfo) {
        setLoadingTeam(true);
        try {
          const team = await getUserTeam(user.id);
          console.log('📋 Team data loaded:', team);

          // Check if user exists in team table
          if (team) {
            setUserExistsInTeam(true);
            const teamData = {
              id: team.id,
              team_name: getCleanFieldValue(team.team_name),
              join_code: getCleanFieldValue(team.join_code),
              college_code: getCleanFieldValue(team.college_code),
              is_team_leader: team.is_team_leader,
              full_name: getCleanFieldValue(team.full_name),
              phone: getCleanFieldValue(team.phone)
            };
            setTeamInfo(teamData);

            // Auto-start editing if critical fields are missing (including "EMPTY" values)
            const hasCriticalMissingData = isFieldEmpty(teamData.full_name) ||
              isFieldEmpty(teamData.phone) ||
              isFieldEmpty(teamData.team_name) ||
              isFieldEmpty(teamData.college_code) ||
              teamData.is_team_leader === null ||
              teamData.is_team_leader === undefined;

            if (hasCriticalMissingData) {
              console.log('🚨 Critical data missing (including EMPTY values), auto-starting edit mode');
              console.log('Missing data details:', {
                full_name: isFieldEmpty(teamData.full_name),
                phone: isFieldEmpty(teamData.phone),
                team_name: isFieldEmpty(teamData.team_name),
                college_code: isFieldEmpty(teamData.college_code),
                is_team_leader: teamData.is_team_leader === null || teamData.is_team_leader === undefined
              });
              setEditFormData({
                full_name: teamData.full_name,
                phone: teamData.phone,
                team_name: teamData.team_name,
                college_code: teamData.college_code,
                is_team_leader: teamData.is_team_leader,
                joinCode: ''
              });
              setIsEditing(true);
            }
          } else {
            // User doesn't exist in team table - start editing mode for new registration
            setUserExistsInTeam(false);
            console.log('🚨 User not found in team table, starting registration mode');
            setEditFormData({
              full_name: '',
              phone: '',
              team_name: '',
              college_code: '',
              is_team_leader: null,
              joinCode: ''
            });
            setIsEditing(true);
          }
        } catch (error) {
          console.error('Error loading team info:', error);
          // On error, assume user doesn't exist and start registration
          setUserExistsInTeam(false);
          setEditFormData({
            full_name: '',
            phone: '',
            team_name: '',
            college_code: '',
            is_team_leader: null,
            joinCode: ''
          });
          setIsEditing(true);
        } finally {
          setLoadingTeam(false);
        }
      }
    };

    if (user) {
      loadTeamInfo();
    }
  }, [user, teamInfo]);

  // Handle menu toggle - directly open/close detailed view
  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  // Copy join code to clipboard
  const copyJoinCode = async (joinCode: string) => {
    try {
      await navigator.clipboard.writeText(joinCode);
      toast.success('Join code copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = joinCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Join code copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy join code');
      }
      document.body.removeChild(textArea);
    }
  };

  // Check if any required fields are missing (including "EMPTY" values)
  const hasMissingData = () => {
    if (!teamInfo) return false;
    return isFieldEmpty(teamInfo.full_name) ||
      isFieldEmpty(teamInfo.phone) ||
      isFieldEmpty(teamInfo.team_name) ||
      isFieldEmpty(teamInfo.college_code) ||
      isFieldEmpty(teamInfo.join_code) ||
      teamInfo.is_team_leader === null ||
      teamInfo.is_team_leader === undefined;
  };

  // Get list of empty/null fields that need editing
  const getEmptyFields = () => {
    if (!teamInfo) return [];
    const emptyFields = [];

    if (isFieldEmpty(teamInfo.full_name)) emptyFields.push('full_name');
    if (isFieldEmpty(teamInfo.phone)) emptyFields.push('phone');
    if (isFieldEmpty(teamInfo.team_name)) emptyFields.push('team_name');
    if (isFieldEmpty(teamInfo.college_code)) emptyFields.push('college_code');
    if (teamInfo.is_team_leader === null || teamInfo.is_team_leader === undefined) emptyFields.push('is_team_leader');
    if (isFieldEmpty(teamInfo.join_code) && teamInfo.is_team_leader) emptyFields.push('join_code');

    return emptyFields;
  };

  // Start editing mode - only for empty fields
  const startEditing = () => {
    if (teamInfo) {
      setEditFormData({
        full_name: getCleanFieldValue(teamInfo.full_name),
        phone: getCleanFieldValue(teamInfo.phone),
        team_name: getCleanFieldValue(teamInfo.team_name),
        college_code: getCleanFieldValue(teamInfo.college_code),
        is_team_leader: teamInfo.is_team_leader,
        joinCode: ''
      });
      setPrefilledTeam(null);
      setIsEditing(true);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditFormData({
      full_name: '',
      phone: '',
      team_name: '',
      college_code: '',
      is_team_leader: null,
      joinCode: ''
    });
    setPrefilledTeam(null);
  };

  // Save changes to database (handles both new registration and updates)
  const saveChanges = async () => {
    if (!user?.id) return;

    // Validation
    if (!editFormData.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!editFormData.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    if (editFormData.phone.trim().length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    if (editFormData.is_team_leader === null) {
      toast.error("Please specify if you are a team leader");
      return;
    }

    if (editFormData.is_team_leader && (!editFormData.team_name.trim() || !editFormData.college_code.trim())) {
      toast.error("Team leaders must provide team name and college code");
      return;
    }

    if (!editFormData.is_team_leader && !editFormData.joinCode.trim() && !prefilledTeam) {
      toast.error("Team members must provide a valid join code");
      return;
    }

    setIsSaving(true);
    try {
      if (userExistsInTeam) {
        // UPDATE existing team record
        const updateData: any = {
          full_name: editFormData.full_name.trim(),
          phone: editFormData.phone.trim(),
          is_team_leader: editFormData.is_team_leader,
          team_name: editFormData.is_team_leader
            ? editFormData.team_name.trim()
            : (prefilledTeam ? prefilledTeam.teamName : editFormData.team_name.trim()),
          college_code: editFormData.is_team_leader
            ? editFormData.college_code.trim()
            : (prefilledTeam ? prefilledTeam.collegeCode : editFormData.college_code.trim())
        };

        // Generate join code if team leader and doesn't have one (or has "EMPTY")
        if (editFormData.is_team_leader && (!teamInfo || isFieldEmpty(teamInfo.join_code))) {
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
          let code = '';
          for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          updateData.join_code = code;
          console.log('🔑 Generated new join code:', code);
        }

        const { error } = await supabase
          .from('teams')
          .update(updateData)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating team info:', error);
          toast.error('Failed to update profile information');
          return;
        }

        // Update local state
        setTeamInfo({
          ...teamInfo!,
          full_name: updateData.full_name,
          phone: updateData.phone,
          team_name: updateData.team_name,
          college_code: updateData.college_code,
          is_team_leader: updateData.is_team_leader,
          join_code: updateData.join_code || teamInfo?.join_code || ''
        });

        toast.success('Profile updated successfully!');
      } else {
        // INSERT new team record
        // Generate unique join code for team leaders
        let generatedJoinCode = '';
        if (editFormData.is_team_leader) {
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts) {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
              code += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            try {
              const existingTeam = await getTeamByJoinCode(code);
              if (!existingTeam) {
                generatedJoinCode = code;
                break;
              }
            } catch {
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
          email: user.email || editFormData.full_name.toLowerCase().replace(/\s+/g, '') + '@example.com',
          phone: editFormData.phone.trim(),
          full_name: editFormData.full_name.trim(),
          team_name: editFormData.is_team_leader
            ? editFormData.team_name.trim()
            : (prefilledTeam ? prefilledTeam.teamName : ''),
          college_code: editFormData.is_team_leader
            ? editFormData.college_code.trim().toUpperCase()
            : (prefilledTeam ? prefilledTeam.collegeCode : ''),
          is_team_leader: editFormData.is_team_leader,
          join_code: editFormData.is_team_leader ? generatedJoinCode : editFormData.joinCode.toUpperCase(),
          session_id: editFormData.is_team_leader ? sessionId : (await getTeamByJoinCode(editFormData.joinCode))?.session_id,
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

        // Update local state with new team data
        setTeamInfo({
          id: data.id,
          full_name: data.full_name,
          phone: data.phone,
          team_name: data.team_name,
          college_code: data.college_code,
          is_team_leader: data.is_team_leader,
          join_code: data.join_code
        });

        setUserExistsInTeam(true);

        if (editFormData.is_team_leader) {
          toast.success(`Team created successfully! Your join code is: ${generatedJoinCode}`);
        } else {
          toast.success('Successfully joined the team!');
        }
      }

      setIsEditing(false);
    } catch (error: any) {
      console.error('Error saving changes:', error);
      toast.error(error.message || 'Failed to save team information');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof EditFormData, value: string | boolean) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle join code lookup (same logic as sign-up)
  const handleJoinCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const joinCode = e.target.value.toUpperCase();
    setEditFormData(prev => ({ ...prev, joinCode }));

    if (joinCode.length === 6) {
      setIsLoadingTeam(true);
      try {
        const teamInfo = await getTeamByJoinCode(joinCode);
        setPrefilledTeam({
          teamName: teamInfo.team_name,
          collegeCode: teamInfo.college_code,
        });
        toast.success(`Found team: ${teamInfo.team_name}`);
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

  // Handle team leader selection (same logic as sign-up)
  const handleTeamLeaderChange = (isLeader: boolean) => {
    if (isLeader) {
      // Becoming team leader - clear join code, enable team fields
      setEditFormData(prev => ({
        ...prev,
        is_team_leader: true,
        joinCode: ''
      }));
      setPrefilledTeam(null);
    } else {
      // Becoming team member - clear team fields, enable join code
      setEditFormData(prev => ({
        ...prev,
        is_team_leader: false,
        team_name: '',
        college_code: ''
      }));
    }
  };



  if (!user) return null;

  return (
    <div className="relative">
      {/* Main Profile Button */}
      <button
        onClick={handleMenuClick}
        className="flex items-center gap-2 px-3 py-2 
        bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 z-0 rounded-2xl
         font-semibold  hover:scale-105 active:scale-95 
        border-yellow-300 shadow-xl shadow-yellow-600/30 border-2
          transition-all duration-300 group min-w-[120px]"
      >
        <User className="w-5 h-5 text-fuchsia-500 group-hover:text-black
          transition-colors duration-300" />
        <span className="text-yellow-900/70 text-lg font-medium group-hover:text-white
          transition-colors duration-300">
          {getDisplayName()}
        </span>
        <ChevronDown className={`w-4 h-4 text-yellow-900/70 group-hover:text-white
          transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Profile Information Menu - Yellow Theme */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2
          bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400  
          backdrop-blur-sm rounded-2xl border-2 border-yellow-300
          shadow-xl overflow-hidden z-50 w-[280px] max-h-[80vh] overflow-y-auto">

          {/* Profile Header */}
          <div className="px-4 py-3 border-b border-yellow-400/50 flex justify-between items-center">
            <h3 className="text-yellow-900 font-bold text-lg">
              {isEditing ? 'Complete Missing Fields' : 'Profile Information'}
            </h3>
            {teamInfo && !isEditing && (
              <div className="flex items-center gap-2">
                {hasMissingData() && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    {getEmptyFields().length} Missing
                  </span>
                )}
                <button
                  onClick={startEditing}
                  className="p-1 hover:bg-yellow-500/50 rounded transition-colors border border-yellow-600 hover:border-yellow-700"
                  title="Complete missing fields"
                >
                  <Edit3 className="w-4 h-4 text-yellow-800" />
                </button>
              </div>
            )}
            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="p-1 hover:bg-green-500/50 rounded transition-colors border border-green-600 hover:border-green-700 disabled:opacity-50"
                  title={isSaving ? "Saving..." : "Save changes"}
                >
                  <Save className={`w-4 h-4 text-green-800 ${isSaving ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="p-1 hover:bg-red-500/50 rounded transition-colors border border-red-600 hover:border-red-700 disabled:opacity-50"
                  title="Cancel editing"
                >
                  <X className="w-4 h-4 text-red-800" />
                </button>
              </div>
            )}
          </div>

          {/* Team Registration/Edit Mode */}
          {isEditing && (
            <div className="px-4 py-3 border-b border-yellow-400/30 bg-yellow-100/50">
              <div className="space-y-4">
                <div className="text-xs text-yellow-800 font-semibold mb-3">
                  {userExistsInTeam
                    ? `Please complete the following ${getEmptyFields().length} missing fields:`
                    : 'Complete your team registration:'
                  }
                </div>

                {/* Email - Show for new users */}
                {!userExistsInTeam && (
                  <div>
                    <label className="block text-yellow-800 text-xs font-semibold mb-1">
                      <Mail className="w-3 h-3 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm text-gray-600"
                      disabled
                    />
                  </div>
                )}

                {/* Full Name - Show if empty or new user */}
                {(!userExistsInTeam || getEmptyFields().includes('full_name')) && (
                  <div>
                    <label className="block text-yellow-800 text-xs font-semibold mb-1">
                      <User className="w-3 h-3 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={editFormData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-red-400 rounded text-sm text-gray-900 focus:outline-none focus:border-red-600"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                {/* Phone - Show if empty or new user */}
                {(!userExistsInTeam || getEmptyFields().includes('phone')) && (
                  <div>
                    <label className="block text-yellow-800 text-xs font-semibold mb-1">
                      <Phone className="w-3 h-3 inline mr-1" />
                      Phone Number *
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-700 text-sm mr-1 bg-white px-2 py-1 border border-red-400 rounded-l">+91</span>
                      <input
                        type="tel"
                        value={editFormData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="flex-1 px-2 py-1 bg-white border border-red-400 border-l-0 rounded-r text-sm text-gray-900 focus:outline-none focus:border-red-600"
                        placeholder="10-digit phone number"
                        maxLength={10}
                      />
                    </div>
                  </div>
                )}

                {/* Team Leader Status - Show if missing or new user */}
                {(!userExistsInTeam || getEmptyFields().includes('is_team_leader')) && (
                  <div>
                    <label className="block text-yellow-800 text-xs font-semibold mb-2">
                      <Users className="w-3 h-3 inline mr-1" />
                      Are you the team leader? *
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${editFormData.is_team_leader === true
                          ? 'bg-blue-600 text-white border-blue-700'
                          : 'bg-white text-gray-800 border border-red-400 hover:bg-blue-100'
                          }`}
                        onClick={() => handleTeamLeaderChange(true)}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${editFormData.is_team_leader === false
                          ? 'bg-blue-600 text-white border-blue-700'
                          : 'bg-white text-gray-800 border border-red-400 hover:bg-blue-100'
                          }`}
                        onClick={() => handleTeamLeaderChange(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}

                {/* Team Name - Show ONLY when team leader (Yes clicked) */}
                {editFormData.is_team_leader === true && (
                  !editFormData.team_name ||
                  editFormData.team_name.trim() === '' ||
                  editFormData.team_name.trim().toUpperCase() === 'EMPTY' ||
                  getEmptyFields().includes('team_name')
                ) && (
                    <div>
                      <label className="block text-yellow-800 text-xs font-semibold mb-1">
                        <Users className="w-3 h-3 inline mr-1" />
                        Team Name *
                      </label>
                      <input
                        type="text"
                        value={editFormData.team_name}
                        onChange={(e) => handleInputChange('team_name', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm focus:outline-none bg-white border-red-400 text-gray-900 focus:border-red-600"
                        placeholder="Enter your team name"
                      />
                    </div>
                  )}

                {/* College Code - Show ONLY when team leader (Yes clicked) */}
                {editFormData.is_team_leader === true && (
                  !editFormData.college_code ||
                  editFormData.college_code.trim() === '' ||
                  editFormData.college_code.trim().toUpperCase() === 'EMPTY' ||
                  getEmptyFields().includes('college_code')
                ) && (
                    <div>
                      <label className="block text-yellow-800 text-xs font-semibold mb-1">
                        College Code *
                      </label>
                      <CollegeCodeDropdown
                        value={editFormData.college_code}
                        onChange={(value) => handleInputChange('college_code', value)}
                        placeholder="Select or type college code"
                        className="text-xs"
                      />
                    </div>
                  )}

                {/* Join Code Input - Show ONLY when team member (No clicked) */}
                {editFormData.is_team_leader === false && (
                  <div>
                    <label className="block text-yellow-800 text-xs font-semibold mb-1">
                      <Copy className="w-3 h-3 inline mr-1" />
                      Join Code *
                    </label>
                    <input
                      type="text"
                      value={editFormData.joinCode}
                      onChange={handleJoinCodeChange}
                      className="w-full px-2 py-1 bg-white border border-red-400 rounded text-sm text-gray-900 focus:outline-none focus:border-red-600 uppercase"
                      placeholder="Enter 6-character join code"
                      maxLength={6}
                      style={{ textTransform: 'uppercase' }}
                    />
                    {isLoadingTeam && (
                      <p className="text-xs text-blue-600 mt-1">Looking up team...</p>
                    )}
                    {prefilledTeam && (
                      <div className="text-xs text-green-600 bg-green-50 p-2 rounded mt-1">
                        <p>✓ Team: {prefilledTeam.teamName}</p>
                        <p>✓ College: {prefilledTeam.collegeCode}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}



          {/* Display Name - Only show when not editing */}
          {!isEditing && (
            <div className="px-4 py-3 border-b border-yellow-400/30">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-yellow-800" />
                <span className="text-yellow-800 text-sm font-semibold">Full Name</span>
                {teamInfo && isFieldEmpty(teamInfo.full_name) && (
                  <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded">Missing</span>
                )}
              </div>
              <p className="text-yellow-900 text-sm font-medium">
                {teamInfo && isFieldEmpty(teamInfo.full_name) ? getDisplayName() : teamInfo?.full_name}
              </p>
            </div>
          )}

          {/* Phone Number - Only show when not editing */}
          {!isEditing && (
            <div className="px-4 py-3 border-b border-yellow-400/30">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-yellow-800" />
                <span className="text-yellow-800 text-sm font-semibold">Phone</span>
                {teamInfo && isFieldEmpty(teamInfo.phone) && (
                  <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded">Missing</span>
                )}
              </div>
              <p className="text-yellow-900 text-sm font-medium">
                {teamInfo && isFieldEmpty(teamInfo.phone) ? 'Not provided' : teamInfo?.phone ? `+91 ${teamInfo.phone}` : 'Not provided'}
              </p>
            </div>
          )}

          {/* Email - Always show */}
          <div className="px-4 py-3 border-b border-yellow-400/30">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-yellow-800" />
              <span className="text-yellow-800 text-sm font-semibold">Email</span>
            </div>
            <p className="text-yellow-900 text-sm break-all font-medium">{user.email}</p>
          </div>

          {/* Team Information - Only show when not editing */}
          {!isEditing && (
            <>
              {loadingTeam ? (
                <div className="px-4 py-3 border-b border-yellow-400/30">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-yellow-800 animate-spin" />
                    <span className="text-yellow-800 text-sm font-medium">Loading team info...</span>
                  </div>
                </div>
              ) : teamInfo ? (
                <>
                  {/* Team Name */}
                  <div className="px-4 py-3 border-b border-yellow-400/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-yellow-800" />
                      <span className="text-yellow-800 text-sm font-semibold">Team</span>
                      {(isFieldEmpty(teamInfo.team_name) || isFieldEmpty(teamInfo.college_code)) && (
                        <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded">
                          {isFieldEmpty(teamInfo.team_name) && isFieldEmpty(teamInfo.college_code) ? 'Missing' :
                            isFieldEmpty(teamInfo.team_name) ? 'Name Missing' : 'College Missing'}
                        </span>
                      )}
                    </div>
                    <p className="text-yellow-900 text-sm font-medium">
                      {isFieldEmpty(teamInfo.team_name) ? 'Not provided' : teamInfo.team_name}
                    </p>
                    <p className="text-yellow-700 text-xs font-medium">
                      {teamInfo.is_team_leader !== null && teamInfo.is_team_leader !== undefined
                        ? (teamInfo.is_team_leader ? 'Team Leader' : 'Team Member')
                        : 'Role not set'} • {isFieldEmpty(teamInfo.college_code) ? 'No college code' : teamInfo.college_code}
                    </p>
                  </div>

                  {/* Join Code */}
                  <div className="px-4 py-3 border-b border-yellow-400/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Copy className="w-4 h-4 text-yellow-800" />
                      <span className="text-yellow-800 text-sm font-semibold">Join Code</span>
                      {isFieldEmpty(teamInfo.join_code) && (
                        <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded">Missing</span>
                      )}
                    </div>
                    {teamInfo.join_code ? (
                      <div className="flex items-center gap-2">
                        <code className="bg-yellow-500/60 text-yellow-900 px-2 py-1 rounded text-sm font-mono font-bold border border-yellow-600">
                          {teamInfo.join_code}
                        </code>
                        <button
                          onClick={() => copyJoinCode(teamInfo.join_code)}
                          className="p-1 hover:bg-yellow-500/50 rounded transition-colors border border-yellow-600 hover:border-yellow-700"
                          title="Copy join code"
                        >
                          <Copy className="w-3 h-3 text-yellow-800" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-red-600 text-sm font-medium">No join code available</p>
                    )}
                    <p className="text-yellow-700 text-xs mt-1 font-medium">Share this code with team members</p>
                  </div>
                </>
              ) : (
                <div className="px-4 py-3 border-b border-yellow-400/30">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-yellow-700" />
                    <span className="text-yellow-700 text-sm font-medium">No team information found</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Debug Section (remove in production) */}
          {/* <div className="px-4 py-2 border-b border-yellow-400/20 bg-yellow-100/50">
            <div className="flex gap-2">
              <button
                onClick={debugTeamData}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                Check DB Name
              </button>
              <details className="text-xs">
                <summary className="text-yellow-700 cursor-pointer">Debug Info</summary>
                <div className="mt-1 text-yellow-600">
                  <p>User Metadata Name: {user?.user_metadata?.full_name || 'None'}</p>
                  <p>Team DB Name: {teamInfo?.full_name || 'None'}</p>
                  <p>Email Username: {user?.email?.split('@')[0] || 'None'}</p>
                  <p>Final Display: {getDisplayName()}</p>
                </div>
              </details>
            </div>
          </div> */}

          {/* Logout Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2 px-4 py-3
              text-red-800 hover:text-white hover:bg-red-500/80
              transition-all duration-200 bg-gradient-to-r from-red-400 to-red-500 font-semibold
              border-t-2 border-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}


    </div>
  );
};

export default ProfileMenu;