import { LogOut, User, ChevronDown, Mail, Users, Copy } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../home/AuthContext';
import { getUserTeam } from '../../services/teamsService';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';

interface TeamInfo {
  id: string;
  team_name: string;
  join_code: string;
  college_code: string;
  is_team_leader: boolean;
  full_name: string;
}

const ProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [loadingTeam, setLoadingTeam] = useState(false);

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

  // Debug function to check what's actually in the database
  const debugTeamData = async () => {
    if (user?.id) {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      console.log('🔍 Raw team data from database:', data);
      console.log('�� Full name in database:', data?.full_name);
      
      if (data?.full_name) {
        toast.info(`Database name: ${data.full_name}`);
      } else {
        toast.warning('No full_name found in teams table');
      }
    }
  };

  // Load team information when component mounts
  useEffect(() => {
    const loadTeamInfo = async () => {
      if (user?.id && !teamInfo) {
        setLoadingTeam(true);
        try {
          const team = await getUserTeam(user.id);
          console.log('📋 Team data loaded:', team);
          if (team) {
            setTeamInfo({
              id: team.id,
              team_name: team.team_name,
              join_code: team.join_code,
              college_code: team.college_code,
              is_team_leader: team.is_team_leader,
              full_name: team.full_name || '' // Get the full name from team data
            });
          }
        } catch (error) {
          console.error('Error loading team info:', error);
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
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Join code copied to clipboard!');
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
          shadow-xl overflow-hidden z-50 w-[280px]">
          
          {/* Profile Header */}
          <div className="px-4 py-3 border-b border-yellow-400/50">
            <h3 className="text-yellow-900 font-bold text-lg">Profile Information</h3>
          </div>

          {/* Display Name */}
          <div className="px-4 py-3 border-b border-yellow-400/30">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-yellow-800" />
              <span className="text-yellow-800 text-sm font-semibold">Name</span>
            </div>
            <p className="text-yellow-900 text-sm font-medium">{getDisplayName()}</p>
          </div>

          {/* Email */}
          <div className="px-4 py-3 border-b border-yellow-400/30">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-yellow-800" />
              <span className="text-yellow-800 text-sm font-semibold">Email</span>
            </div>
            <p className="text-yellow-900 text-sm break-all font-medium">{user.email}</p>
          </div>

          {/* Team Information */}
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
                </div>
                <p className="text-yellow-900 text-sm font-medium">{teamInfo.team_name}</p>
                <p className="text-yellow-700 text-xs font-medium">
                  {teamInfo.is_team_leader ? 'Team Leader' : 'Team Member'} • {teamInfo.college_code}
                </p>
              </div>

              {/* Join Code */}
              <div className="px-4 py-3 border-b border-yellow-400/30">
                <div className="flex items-center gap-2 mb-1">
                  <Copy className="w-4 h-4 text-yellow-800" />
                  <span className="text-yellow-800 text-sm font-semibold">Join Code</span>
                </div>
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