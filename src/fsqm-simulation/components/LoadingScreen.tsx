import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface LoadingScreenProps {
  isLoadingTeamInfo: boolean;
  teamInfoError: string | null;
  onRetry: () => void;
  onClearError: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoadingTeamInfo,
  teamInfoError,
  onRetry,
  onClearError,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 relative p-2">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
      <div className="pixel-border bg-gradient-to-r from-cyan-600 to-blue-600 p-4 max-w-md w-full text-center relative z-10">
        <h2 className="text-lg font-black mb-3 text-cyan-100 pixel-text">
          LOADING TEAM INFO...
        </h2>
        {teamInfoError ? (
          <>
            <p className="text-red-300 mb-4 font-bold text-sm">{teamInfoError}</p>
            <div className="flex flex-col gap-2">
              {teamInfoError.includes("expired") || teamInfoError.includes("JWT") ? (
                <>
                  <button
                    className="pixel-border bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black py-2 px-4 pixel-text transition-all text-sm"
                    onClick={() => {
                      navigate('/login');
                    }}
                  >
                    GO TO LOGIN
                  </button>
                  <button
                    className="pixel-border bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-1 px-3 pixel-text transition-all text-sm"
                    onClick={async () => {
                      onClearError();
                      // Try to sign out and clear any cached tokens
                      try {
                        await supabase.auth.signOut();
                      } catch (err) {
                        console.warn("Sign out error:", err);
                      }
                      onRetry();
                    }}
                  >
                    RETRY
                  </button>
                </>
              ) : teamInfoError.includes("No team registration found") ? (
                <button
                  className="pixel-border bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-black py-1 px-3 pixel-text transition-all text-sm"
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  BACK TO HOME
                </button>
              ) : (
                <button
                  className="pixel-border bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-1 px-3 pixel-text transition-all text-sm"
                  onClick={() => {
                    onClearError();
                    onRetry();
                  }}
                >
                  RETRY
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-cyan-200 mb-4 font-medium text-sm">
              Please wait while we load your team session and check for saved progress.
            </p>
            <div className="animate-pulse text-cyan-300 font-black pixel-text text-sm">
              {isLoadingTeamInfo ? "LOADING PROGRESS..." : "LOADING..."}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
