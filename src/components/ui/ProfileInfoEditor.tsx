import React, { useState, useRef, useEffect } from 'react';
import { collegeCodes } from '../../data/collegeCodes';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';

interface ProfileInfoEditorProps {
  profile: {
    full_name?: string;
    phone?: string;
    team_name?: string;
    join_code?: string;
    college_code?: string;
    is_team_leader?: boolean;
    session_id?: string;
  };
  userId?: string;
  email?: string;
  onProfileUpdate?: (updatedProfile: any) => void;
}

export const ProfileInfoEditor: React.FC<ProfileInfoEditorProps> = ({ 
  profile, 
  userId, 
  email,
  onProfileUpdate 
}) => {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    full_name: profile.full_name || '',
    phone: profile.phone || '',
    team_name: profile.team_name || '',
    join_code: profile.join_code || '',
    college_code: profile.college_code || '',
    is_team_leader: profile.is_team_leader ?? false,
    session_id: profile.session_id || '',
    email: email || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form when profile prop changes
  useEffect(() => {
    setForm({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      team_name: profile.team_name || '',
      join_code: profile.join_code || '',
      college_code: profile.college_code || '',
      is_team_leader: profile.is_team_leader ?? false,
      session_id: profile.session_id || '',
      email: email || '',
    });
  }, [profile, email]);

  const missing =
    !form.full_name.trim() ||
    !form.phone.trim() ||
    !form.email.trim() ||
    (form.is_team_leader ? !form.team_name.trim() : !form.join_code.trim()) ||
    (form.is_team_leader && !form.college_code.trim());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleTeamLeaderChange = (isLeader: boolean) => {
    setForm(prev => ({
      ...prev,
      is_team_leader: isLeader,
      // Clear irrelevant fields when switching roles
      ...(isLeader ? { join_code: '' } : { team_name: '', college_code: '' })
    }));
  };

  const validateForm = () => {
    if (!form.full_name.trim()) {
      setError('Full name is required.');
      return false;
    }
    if (!form.phone.trim()) {
      setError('Phone number is required.');
      return false;
    }
    if (!form.email.trim()) {
      setError('Email is required.');
      return false;
    }
    if (form.is_team_leader) {
      if (!form.team_name.trim()) {
        setError('Team name is required for team leaders.');
        return false;
      }
      if (!form.college_code.trim()) {
        setError('College code is required for team leaders.');
        return false;
      }
    } else {
      if (!form.join_code.trim()) {
        setError('Join code is required.');
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    setError(null);
    
    if (!userId) {
      setError('User not found.');
      toast.error('User not found.');
      setSaving(false);
      return;
    }

    try {
      let sessionId = form.session_id;
      
      if (form.is_team_leader) {
        // Generate session id if leader and not present
        if (!sessionId || sessionId.trim() === '') {
          sessionId = crypto.randomUUID?.() || 
            Math.random().toString(36).substring(2) + Date.now().toString(36);
        }
        
        // Generate join code if leader and not present
        let joinCode = form.join_code;
        if (!joinCode || joinCode.trim() === '') {
          joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        }
        
        setForm(prev => ({ ...prev, join_code: joinCode, session_id: sessionId }));
      } else {
        // Not leader: validate join code and check team size
        // Fetch the full leader record
        const { data: leaderData, error: leaderError } = await supabase
          .from('teams')
          .select('*')
          .eq('join_code', form.join_code.trim())
          .eq('is_team_leader', true)
          .single();

        if (leaderError || !leaderData?.session_id) {
          setError('Invalid join code. Please check with your team leader.');
          toast.error('Invalid join code.');
          setSaving(false);
          return;
        }

        sessionId = leaderData.session_id;

        // Check team size (max 4 including leader)
        const { count, error: countError } = await supabase
          .from('teams')
          .select('id', { count: 'exact', head: true })
          .eq('session_id', sessionId);

        if (countError) {
          setError('Could not verify team size. Please try again.');
          toast.error('Could not verify team size.');
          setSaving(false);
          return;
        }

        if ((count ?? 0) >= 4) {
          setError('Team already has maximum 4 members.');
          toast.error('Team already has 4 members.');
          setSaving(false);
          return;
        }

  // Always use leader's team_name and college_code for non-leader
  setForm(prev => ({ ...prev, team_name: leaderData.team_name || '', college_code: leaderData.college_code || '', session_id: sessionId }));
  form.team_name = leaderData.team_name || '';
  form.college_code = leaderData.college_code || '';
      }

      // Prepare data for upsert
      const upsertData = {
        user_id: userId,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        is_team_leader: form.is_team_leader,
        session_id: sessionId,
        team_name: form.team_name.trim(), // Always set team_name for all
        college_code: form.college_code.trim(), // Always set college_code for all
        ...(form.is_team_leader && {
          join_code: form.join_code || sessionId.substring(0, 6).toUpperCase(),
        }),
        ...(!form.is_team_leader && {
          join_code: form.join_code.trim(),
        }),
      };

      const { error: upsertError } = await supabase
        .from('teams')
        .upsert(upsertData, { onConflict: 'user_id' });

      if (upsertError) {
        setError('Failed to save profile: ' + upsertError.message);
        toast.error('Failed to save: ' + upsertError.message);
      } else {
        setEdit(false);
        toast.success('Profile saved successfully!');
        // Call callback if provided
        onProfileUpdate?.(upsertData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to save profile: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setError(null);
    // Reset form to original values
    setForm({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      team_name: profile.team_name || '',
      join_code: profile.join_code || '',
      college_code: profile.college_code || '',
      is_team_leader: profile.is_team_leader ?? false,
      session_id: profile.session_id || '',
      email: email || '',
    });
  };

  return (
    <div className="space-y-3">
      {edit || missing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-gray-50 cursor-not-allowed"
              placeholder="Email address"
              disabled
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Are you the team leader? *
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="is_team_leader"
                  checked={form.is_team_leader === true}
                  onChange={() => handleTeamLeaderChange(true)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="is_team_leader"
                  checked={form.is_team_leader === false}
                  onChange={() => handleTeamLeaderChange(false)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
          </div>

          {form.is_team_leader && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  name="team_name"
                  value={form.team_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your team name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College Code *
                </label>
                <CollegeCodeDropdown
                  value={form.college_code}
                  onChange={(code: string) => setForm(prev => ({ ...prev, college_code: code }))}
                />
              </div>

              {form.join_code && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Code (Generated)
                  </label>
                  <input
                    type="text"
                    value={form.join_code}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-gray-50 font-mono"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Share this code with your team members</p>
                </div>
              )}
            </>
          )}

          {!form.is_team_leader && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Join Code *
              </label>
              <input
                type="text"
                name="join_code"
                value={form.join_code}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="Enter the join code from your team leader"
                required
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="flex-1 bg-blue-600 text-white rounded-md px-4 py-2 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={handleSave}
              disabled={saving || missing}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            
            {!missing && (
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <span className="block text-sm font-medium text-gray-700">Full Name</span>
            <span className="text-gray-900 font-medium">{form.full_name}</span>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-700">Phone</span>
            <span className="text-gray-900">{form.phone}</span>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-700">Email</span>
            <span className="text-gray-900">{form.email}</span>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-700">Role</span>
            <span className="text-gray-900">
              {form.is_team_leader ? 'Team Leader' : 'Team Member'}
            </span>
          </div>

          {form.team_name && (
            <div>
              <span className="block text-sm font-medium text-gray-700">Team Name</span>
              <span className="text-gray-900">{form.team_name}</span>
            </div>
          )}

          {form.join_code && (
            <div>
              <span className="block text-sm font-medium text-gray-700">
                {form.is_team_leader ? 'Join Code (Share with team)' : 'Join Code'}
              </span>
              <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                {form.join_code}
              </span>
            </div>
          )}

          {form.college_code && (
            <div>
              <span className="block text-sm font-medium text-gray-700">College</span>
              <span className="text-gray-900">{form.college_code}</span>
            </div>
          )}

          {/* <button
            type="button"
            className="w-full bg-gray-100 text-gray-700 rounded-md px-4 py-2 font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={() => setEdit(true)}
          >
            Edit Profile
          </button> */}
        </div>
      )}
    </div>
  );
};

// Improved CollegeCodeDropdown component
type CollegeCodeDropdownProps = {
  value: string;
  onChange: (code: string) => void;
};

const CollegeCodeDropdown: React.FC<CollegeCodeDropdownProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState('');
  const [showList, setShowList] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter colleges based on search
  const filtered = collegeCodes.filter(code =>
    code.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowList(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    onChange(code);
    setSearch('');
    setShowList(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowList(true);
  };

  const handleInputFocus = () => {
    setShowList(true);
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowList(false);
      setSearch('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Search and select college..."
        value={showList ? search : value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
      />
      
      {showList && (
        <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-sm">No colleges found</div>
          ) : (
            filtered.slice(0, 50).map((code) => (
              <div
                key={code}
                className={`px-3 py-2 cursor-pointer text-sm hover:bg-blue-50 transition-colors ${
                  value === code ? 'bg-blue-100 font-medium text-blue-900' : 'text-gray-900'
                }`}
                onClick={() => handleSelect(code)}
              >
                {code}
              </div>
            ))
          )}
          {filtered.length > 50 && (
            <div className="px-3 py-2 text-gray-500 text-xs border-t">
              Showing first 50 results. Continue typing to narrow down...
            </div>
          )}
        </div>
      )}
    </div>
  );
};