import { LogOut, User, ChevronDown, Mail, Users, Copy } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
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
  // const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [teamInfo, setTeamInfo] = useState<TeamInfo & { email?: string } | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [saving, setSaving] = useState(false);
  // Save edited field to DB
  const handleSaveField = async (field: string) => {
    if (!teamInfo) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('teams')
        .update({ [field]: editValue })
        .eq('id', teamInfo.id)
        .select()
        .single();
      if (data) {
        setTeamInfo({ ...teamInfo, [field]: editValue });
        setEditField(null);
        setEditValue('');
        toast.success('Updated successfully!');
      } else {
        toast.error('Update failed!');
      }
    } catch (e) {
      toast.error('Update failed!');
    } finally {
      setSaving(false);
    }
  };
  const [loadingTeam, setLoadingTeam] = useState(false);

  // Get user's display name from teamInfo only
  const getDisplayName = () => {
    if (teamInfo?.full_name && teamInfo.full_name.trim() !== '' && teamInfo.full_name.toLowerCase() !== 'karthik') {
      return teamInfo.full_name;
    }
    return 'Player';
  };

  // Debug function to check what's actually in the database
  // (No longer needed, as all data comes from teams table)

  // Load team information when component mounts (fetch by current user from teams table)
  useEffect(() => {
    const loadTeamInfo = async () => {
      setLoadingTeam(true);
      try {
        // Get current user from Supabase auth
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();
        if (userError || !user) {
          setTeamInfo(null);
          setLoadingTeam(false);
          return;
        }
        // Fetch the team row for this user_id
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setTeamInfo(data);
        } else {
          setTeamInfo(null);
        }
      } catch (error) {
        console.error('Error loading team info:', error);
      } finally {
        setLoadingTeam(false);
      }
    };
    loadTeamInfo();
  }, []);

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

  if (!teamInfo) return null;

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
              {(!teamInfo.full_name || teamInfo.full_name.trim() === '') && editField !== 'full_name' && (
                <button className="ml-2 text-blue-600 underline text-xs" onClick={() => { setEditField('full_name'); setEditValue(''); }}>Edit</button>
              )}
            </div>
            {editField === 'full_name' ? (
              <div className="flex gap-2 mt-1">
                <input
                  className="border px-2 py-1 rounded text-sm"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  placeholder="Enter your name"
                  disabled={saving}
                />
                <button className="text-green-700 font-bold" disabled={saving} onClick={() => handleSaveField('full_name')}>Save</button>
              </div>
            ) : (
              <p className="text-yellow-900 text-sm font-medium">{getDisplayName()}</p>
            )}
          </div>

          {/* Email (from teams table) */}
          <div className="px-4 py-3 border-b border-yellow-400/30">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-yellow-800" />
              <span className="text-yellow-800 text-sm font-semibold">Email</span>
              {(!teamInfo.email || teamInfo.email.trim() === '') && editField !== 'email' && (
                <button className="ml-2 text-blue-600 underline text-xs" onClick={() => { setEditField('email'); setEditValue(''); }}>Edit</button>
              )}
            </div>
            {editField === 'email' ? (
              <div className="flex gap-2 mt-1">
                <input
                  className="border px-2 py-1 rounded text-sm"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  placeholder="Enter your email"
                  disabled={saving}
                />
                <button className="text-green-700 font-bold" disabled={saving} onClick={() => handleSaveField('email')}>Save</button>
              </div>
            ) : (
              <p className="text-yellow-900 text-sm break-all font-medium">{teamInfo.email || 'N/A'}</p>
            )}
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


              {/* Team Name (separate section) */}
              <div className="px-4 py-3 border-b border-yellow-400/30">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-yellow-800" />
                  <span className="text-yellow-800 text-sm font-semibold">Team Name</span>
                  {(!teamInfo.team_name || teamInfo.team_name.trim() === '') && editField !== 'team_name' && (
                    <button className="ml-2 text-blue-600 underline text-xs" onClick={() => { setEditField('team_name'); setEditValue(''); }}>Edit</button>
                  )}
                </div>
                {editField === 'team_name' ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      className="border px-2 py-1 rounded text-sm"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      placeholder="Enter team name"
                      disabled={saving}
                    />
                    <button className="text-green-700 font-bold" disabled={saving} onClick={() => handleSaveField('team_name')}>Save</button>
                  </div>
                ) : (
                  <p className="text-yellow-900 text-sm font-medium">{teamInfo.team_name}</p>
                )}
              </div>

              {/* Team Role */}
              <div className="px-4 py-3 border-b border-yellow-400/30">
                <span className="text-yellow-800 text-sm font-semibold">Role</span>
                <p className="text-yellow-700 text-sm font-medium">
                  {teamInfo.is_team_leader ? 'Team Leader' : 'Team Member'}
                </p>
              </div>


              {/* College Code */}
              <div className="px-4 py-3 border-b border-yellow-400/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-800 text-sm font-semibold">College Code</span>
                  {(!teamInfo.college_code || teamInfo.college_code.trim() === '') && editField !== 'college_code' && (
                    <button className="ml-2 text-blue-600 underline text-xs" onClick={() => { setEditField('college_code'); setEditValue(''); }}>Edit</button>
                  )}
                </div>
                {editField === 'college_code' ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      className="border px-2 py-1 rounded text-sm"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      placeholder="Enter college code"
                      disabled={saving}
                    />
                    <button className="text-green-700 font-bold" disabled={saving} onClick={() => handleSaveField('college_code')}>Save</button>
                  </div>
                ) : (
                  <p className="text-yellow-900 text-sm font-medium">{teamInfo.college_code}</p>
                )}
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

          {/* Logout Button (disabled, since no auth context) */}
          <button
            disabled
            className="w-full flex items-center gap-2 px-4 py-3
              text-red-800 bg-red-200 cursor-not-allowed
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