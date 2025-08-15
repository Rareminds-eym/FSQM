import { useCallback, useEffect, useState } from "react";
import { DatabaseService } from "../services/databaseService";
import type { GameRefs, GameState, TeamInfo } from "../types";

export const useGameTimer = (
  gameState: GameState,
  teamInfo: TeamInfo | null,
  gameRefs: GameRefs,
  onTimeUp: () => void
) => {
  const [timerSaveInterval, setTimerSaveInterval] = useState<NodeJS.Timeout | null>(null);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  // Periodic timer save - save timer every 30 seconds during active gameplay
  useEffect(() => {
    if (!gameState.gameStarted || gameState.gameCompleted || gameState.showLevelModal || !teamInfo?.session_id || !teamInfo?.email) {
      // Clear any existing interval if game is not active or level modal is shown
      if (timerSaveInterval) {
        clearInterval(timerSaveInterval);
        setTimerSaveInterval(null);
      }
      return;
    }

    if (!timerSaveInterval) {
      const interval = setInterval(async () => {
        try {
          const currentState = gameRefs.gameStateRef.current;
          const currentSession = gameRefs.sessionIdRef.current;
          const currentEmailValue = gameRefs.emailRef.current;

          console.log("⏰ Timer-based auto-save triggered:", {
            hasSession: !!currentSession,
            hasEmail: !!currentEmailValue,
            gameStarted: currentState.gameStarted,
            gameCompleted: currentState.gameCompleted,
            currentQuestion: currentState.currentQuestion,
            timeRemaining: currentState.timeRemaining
          });

          if (!currentSession || !currentEmailValue || !currentState.gameStarted || currentState.gameCompleted) {
            console.log("❌ Timer auto-save skipped - invalid state");
            return;
          }

          console.log("💾 Timer auto-save executing...");

          // Save current position to database
          const result = await DatabaseService.saveCurrentPosition(
            currentEmailValue,
            currentSession,
            currentState.currentLevel === 1 ? 5 : 6,
            currentState.currentQuestion,
            currentState.questions[currentState.currentQuestion] || null,
            currentState.answers[currentState.currentQuestion] || null,
            currentState.timeRemaining
          );

          console.log("⏰ Timer auto-save result:", result);

          if (result.success) {
            // Update save indicator
            setShowSaveIndicator(true);
            setTimeout(() => setShowSaveIndicator(false), 2000);
            console.log("✅ Timer auto-save successful");
          } else {
            console.error("❌ Timer auto-save failed:", result.error);
          }
        } catch (error) {
          console.error("💥 Error during periodic timer save:", error);
        }
      }, 30000); // Save every 30 seconds

      setTimerSaveInterval(interval);
      console.log("⏰ Timer auto-save interval started (30s)");
    }
  }, [gameState.gameStarted, gameState.gameCompleted, gameState.showLevelModal, teamInfo?.session_id, teamInfo?.email, timerSaveInterval, gameRefs]);

  // Cleanup timer save interval on component unmount
  useEffect(() => {
    return () => {
      if (timerSaveInterval) {
        clearInterval(timerSaveInterval);
      }
    };
  }, [timerSaveInterval]);

  // Handle time updates
  const handleSetTimeRemaining = useCallback((timeOrUpdater: number | ((prev: number) => number)) => {
    if (typeof timeOrUpdater === 'function') {
      // Handle functional update
      const updater = timeOrUpdater;
      return (prevGameState: GameState) => {
        const newTime = updater(prevGameState.timeRemaining);
        if (newTime <= 0) {
          onTimeUp();
          return { ...prevGameState, timeRemaining: 0 };
        }
        return { ...prevGameState, timeRemaining: newTime };
      };
    } else {
      // Handle direct value
      const newTime = timeOrUpdater;
      if (newTime <= 0) {
        onTimeUp();
        return 0;
      }
      return newTime;
    }
  }, [onTimeUp]);

  return {
    showSaveIndicator,
    handleSetTimeRemaining,
  };
};
