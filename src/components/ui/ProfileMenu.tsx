import { ProfileInfoEditor } from './ProfileInfoEditor';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../home/AuthContext';
// import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';

interface TeamInfo {
  id?: string;
  team_name?: string;
  join_code?: string;
  college_code?: string;
  is_team_leader?: boolean;
  full_name?: string;
  phone?: string;
  email?: string;
  team_leader?: {
    full_name?: string;
    phone?: string;
    email?: string;
    user_id?: string;
  } | null;
}

const ProfileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<TeamInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const auth = useAuth ? useAuth() : undefined;
  const user = auth?.user || null;
  const signOut = auth?.signOut;
  const logout = auth?.logout;

  // Fetch profile info from Supabase teams table
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        // Fetch the user's team record (including is_team_leader)
        const { data: userData, error: userError } = await supabase
          .from('teams')
          .select('full_name, phone, team_name, join_code, college_code, is_team_leader, team_name, user_id')
          .eq('user_id', user.id)
          .single();

        if (userError || !userData) {
          setProfile(null);
          return;
        }

        let teamName = userData.team_name;
        let leaderRecord = null;

        if (!userData.is_team_leader) {
          // Not a leader: fetch the team leader's record for this team
          const { data: leaderData } = await supabase
            .from('teams')
            .select('full_name, phone, email, user_id, team_name')
            .eq('join_code', userData.join_code)
            .eq('is_team_leader', true)
            .single();
          leaderRecord = leaderData || null;
          // If teamName is missing, get it from leader
          if (!teamName && leaderData && leaderData.team_name) {
            teamName = leaderData.team_name;
          }
        }

        setProfile({ ...userData, team_name: teamName, team_leader: leaderRecord });
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (open && user?.id) {
      fetchProfile();
    }
  }, [open, user]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const getInitial = () => {
    const name = profile?.full_name || user?.email || "User";
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    return profile?.full_name || user?.email || "User";
  };

  return (
    <div className="relative inline-block text-left">
      {/* Profile Button */}
      <button
        ref={buttonRef}
        className={`
          group relative flex items-center gap-3 px-3 py-2 rounded-xl 
          transition-all duration-200 ease-in-out
          ${open 
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg ring-2 ring-blue-200' 
            : 'bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 hover:shadow-md'
          }
          border border-gray-200 hover:border-blue-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        title={getDisplayName()}
      >
        {/* Avatar */}
        <div className={`
          relative w-10 h-10 rounded-full transition-all duration-200
          ${open 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg' 
            : 'bg-gradient-to-br from-gray-400 to-gray-600 group-hover:from-blue-500 group-hover:to-indigo-600'
          }
          flex items-center justify-center text-white font-semibold text-sm
        `}>
          {getInitial()}
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        </div>

        {/* User Info (hidden on mobile) */}
        <div className="hidden sm:flex flex-col items-start min-w-0">
          <span className="text-sm font-medium text-gray-900 truncate max-w-32">
            {profile?.full_name || 'User'}
          </span>
          <span className="text-xs text-gray-500 truncate max-w-32">
            {profile?.team_name || 'No team'}
          </span>
        </div>

        {/* Chevron Icon */}
        <svg
          className={`
            w-4 h-4 text-gray-500 transition-transform duration-200 ease-in-out
            ${open ? 'rotate-180 text-blue-500' : 'group-hover:text-blue-500'}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          
          {/* Menu Content */}
          <div
            ref={menuRef}
            className={`
              absolute right-0 mt-3 w-80 origin-top-right
              bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 
              z-50 overflow-hidden border border-gray-100
              transform transition-all duration-200 ease-out
              ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              max-h-[80vh] sm:max-h-[60vh] overflow-y-auto
            `}
            role="menu"
            aria-orientation="vertical"
            aria-label="Profile menu"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg">
                  {getInitial()}
                </div>
                <div className="text-white">
                  <h3 className="font-semibold text-lg">{getDisplayName()}</h3>
                  <p className="text-blue-100 text-sm opacity-90">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  {/* Loading spinner */}
                  <div className="relative">
                    <div className="w-8 h-8 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-500 text-sm mt-3 font-medium">Loading profile...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Quick Stats */}
                  {profile && (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                        <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Team</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {profile.team_name || 'No team'}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                        <p className="text-xs font-medium text-green-600 uppercase tracking-wide">College</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {profile.college_code || 'Not set'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Profile Editor */}
                  <div className="border-t border-gray-100 pt-4">
                    <ProfileInfoEditor 
                      profile={{
                        full_name: profile?.full_name,
                        phone: profile?.phone,
                        team_name: profile?.team_name,
                        join_code: profile?.join_code,
                        college_code: profile?.college_code
                      }} 
                      userId={user?.id} 
                      email={user?.email} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <button
                onClick={async () => {
                  try {
                    if (logout) {
                      logout();
                    } else if (signOut) {
                      await signOut();
                    }
                  } catch (err) {
                    console.error('Sign out error:', err);
                  }
                }}
                className="w-full text-center text-sm text-red-500 hover:text-red-700 transition-colors duration-150 font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;