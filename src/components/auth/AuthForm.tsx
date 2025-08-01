import React, { useState, useEffect } from "react";
import { FormData } from "../../types/auth";
import { getTeamByJoinCode } from "../../services/teamsService";
import { toast } from "react-toastify";
import InputField from "../ui/InputField";
import AuthButton from "./AuthButton";

interface AuthFormProps {
  isLogin: boolean;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  formData,
  setFormData,
  onSubmit,
  loading = false,
}) => {
  const [prefilledTeam, setPrefilledTeam] = useState<{ teamName: string; collegeCode: string } | null>(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle join code lookup
  const handleJoinCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const joinCode = e.target.value.toUpperCase();
    setFormData({ ...formData, joinCode });

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

  if (isLogin) {
    return (
      <form onSubmit={onSubmit} className="space-y-6">
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <AuthButton type="submit" isLogin={isLogin} disabled={loading} />
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Column 1 */}
      <div className="flex flex-col gap-4">
        {/* Full Name */}
        <InputField
          label="Full Name"
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleInputChange}
        />

        {/* College Code (only for team leader or prefilled for member) */}
        {(formData.isTeamLeader || (prefilledTeam && !formData.isTeamLeader)) && (
          <InputField
            label="College Code"
            name="collegeCode"
            type="text"
            placeholder="Enter college code"
            value={formData.isTeamLeader ? formData.collegeCode : (prefilledTeam ? prefilledTeam.collegeCode : '')}
            onChange={formData.isTeamLeader ? handleInputChange : undefined}
            disabled={!formData.isTeamLeader && prefilledTeam ? true : false}
          />
        )}

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-black/60 mb-1">Phone Number</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-black/60">+91</span>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 z-0 shadow-lg rounded-xl border-2 border-yellow-200 placeholder-black/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-all duration-300 pl-10"
              placeholder="Enter 10-digit phone number"
              maxLength={10}
            />
          </div>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-4">
        {/* Team Name (only for team leader or prefilled for member) */}
        {formData.isTeamLeader || (prefilledTeam && !formData.isTeamLeader) ? (
          <InputField
            label="Team Name"
            name="teamName"
            type="text"
            placeholder="Enter team name"
            value={formData.isTeamLeader ? formData.teamName : (prefilledTeam ? prefilledTeam.teamName : '')}
            onChange={formData.isTeamLeader ? handleInputChange : undefined}
            disabled={!formData.isTeamLeader && prefilledTeam ? true : false}
          />
        ) : (
          <div className="space-y-2">
            <InputField
              label="Join Code"
              name="joinCode"
              type="text"
              placeholder="Enter join code from team leader"
              value={formData.joinCode}
              onChange={handleJoinCodeChange}
              maxLength={6}
              style={{ textTransform: 'uppercase' }}
            />
            {isLoadingTeam && (
              <p className="text-sm text-blue-600">Looking up team...</p>
            )}
            {prefilledTeam && (
              <div className="text-sm text-green-600">
                <p>Team: {prefilledTeam.teamName}</p>
                <p>College: {prefilledTeam.collegeCode}</p>
              </div>
            )}
          </div>
        )}

        {/* Are you the team leader? Yes/No */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-black/60 mb-1">Are you the team leader?</label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md border font-medium focus:outline-none transition-colors duration-150 ${
                formData.isTeamLeader === true
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white/10 text-black border-gray-300 hover:bg-blue-100'
              }`}
              onClick={() => setFormData({ ...formData, isTeamLeader: true, joinCode: '' })}
            >
              Yes
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md border font-medium focus:outline-none transition-colors duration-150 ${
                formData.isTeamLeader === false
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white/10 text-black border-gray-300 hover:bg-blue-100'
              }`}
              onClick={() => setFormData({ ...formData, isTeamLeader: false, teamName: '', collegeCode: '' })}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col gap-4">
        {/* Email */}
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
        />

        {/* Password */}
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleInputChange}
        />

        {/* Confirm Password */}
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
      </div>

      {/* Submit Button */}
      <div className="col-span-1 md:col-span-3 flex justify-center mt-6">
        <AuthButton type="submit" isLogin={isLogin} disabled={loading} />
      </div>
    </form>
  );
};

export default AuthForm;
