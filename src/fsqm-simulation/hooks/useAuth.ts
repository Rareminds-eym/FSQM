import { useEffect, useState } from "react";
import { AuthService } from "../services/authService";
import type { TeamInfo } from "../types";

export const useAuth = () => {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [teamInfoError, setTeamInfoError] = useState<string | null>(null);
  const [isLoadingTeamInfo, setIsLoadingTeamInfo] = useState(true);

  // Enhanced auth handling with JWT refresh
  useEffect(() => {
    const fetchTeamInfo = async () => {
      setIsLoadingTeamInfo(true);
      setTeamInfoError(null);

      try {
        const result = await AuthService.fetchTeamInfo();

        if (result.success && result.data) {
          setTeamInfo(result.data);
          setTeamInfoError(null);
        } else {
          setTeamInfoError(result.error || "Unknown error occurred");
          setTeamInfo(null);
        }
      } catch (err) {
        console.error("Unexpected error in fetchTeamInfo:", err);
        setTeamInfoError("An unexpected error occurred. Please refresh the page and try again.");
        setTeamInfo(null);
      } finally {
        setIsLoadingTeamInfo(false);
      }
    };

    fetchTeamInfo();
  }, []);

  const retryAuth = async () => {
    setTeamInfoError(null);
    setIsLoadingTeamInfo(true);

    try {
      const result = await AuthService.fetchTeamInfo();

      if (result.success && result.data) {
        setTeamInfo(result.data);
        setTeamInfoError(null);
      } else {
        setTeamInfoError(result.error || "Unknown error occurred");
        setTeamInfo(null);
      }
    } catch (err) {
      console.error("Unexpected error in retryAuth:", err);
      setTeamInfoError("An unexpected error occurred. Please refresh the page and try again.");
      setTeamInfo(null);
    } finally {
      setIsLoadingTeamInfo(false);
    }
  };

  const clearError = () => {
    setTeamInfoError(null);
  };

  return {
    teamInfo,
    teamInfoError,
    isLoadingTeamInfo,
    retryAuth,
    clearError,
  };
};
