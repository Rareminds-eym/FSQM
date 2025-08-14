import React, { createContext, useContext, useState, useEffect } from "react";
import { isTrainingEnabled } from "../components/game/levels/levelUnlock";
import { useGameProgress } from "./GameProgressContext";

interface EnhancedGameProgressContextType {
  progress: {
    completedLevels: number[];
    currentLevel: number;
    unlockedClues: Record<number, number[]>;
  };
  completeLevel: (levelId: number) => void;
  resetCompleteLevel: () => void;
  unlockClue: (levelId: number, clueIndex: number) => void;
  getUnlockedClues: (levelId: number) => number[];
  isTrainingActive: boolean;
  isLoading: boolean;
}

const defaultProgress = {
  completedLevels: [],
  currentLevel: 1,
  unlockedClues: {},
};

const EnhancedGameProgressContext = createContext<EnhancedGameProgressContextType | undefined>(
  undefined
);

export const EnhancedGameProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isTrainingActive, setIsTrainingActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Get the original game progress context
  const originalGameProgress = useGameProgress();

  // Check training status on mount and periodically
  useEffect(() => {
    const checkTrainingStatus = async () => {
      try {
        setIsLoading(true);
        const trainingEnabled = await isTrainingEnabled();
        setIsTrainingActive(trainingEnabled);
        console.log('[Enhanced Game Progress] Training status:', trainingEnabled);
      } catch (error) {
        console.error('[Enhanced Game Progress] Error checking training status:', error);
        setIsTrainingActive(false); // Default to disabled on error
      } finally {
        setIsLoading(false);
      }
    };

    checkTrainingStatus();
    
    // Check training status every 2 minutes
    const interval = setInterval(checkTrainingStatus, 120000);
    return () => clearInterval(interval);
  }, []);

  // Create enhanced context value
  const contextValue: EnhancedGameProgressContextType = {
    // If training is disabled, return empty progress for training levels only
    // Hackathon levels (16, 17) are independent and don't use this progress anyway
    progress: isTrainingActive ? originalGameProgress.progress : defaultProgress,

    // If training is disabled, make these functions no-ops for training levels
    // Note: Hackathon levels don't typically use these functions
    completeLevel: isTrainingActive ? originalGameProgress.completeLevel : () => {
      console.log('[Enhanced Game Progress] Training disabled - completeLevel ignored for training levels');
    },

    resetCompleteLevel: isTrainingActive ? originalGameProgress.resetCompleteLevel : () => {
      console.log('[Enhanced Game Progress] Training disabled - resetCompleteLevel ignored');
    },

    unlockClue: isTrainingActive ? originalGameProgress.unlockClue : () => {
      console.log('[Enhanced Game Progress] Training disabled - unlockClue ignored for training levels');
    },

    getUnlockedClues: isTrainingActive ? originalGameProgress.getUnlockedClues : () => {
      console.log('[Enhanced Game Progress] Training disabled - getUnlockedClues returning empty for training levels');
      return [];
    },

    isTrainingActive,
    isLoading,
  };

  return (
    <EnhancedGameProgressContext.Provider value={contextValue}>
      {children}
    </EnhancedGameProgressContext.Provider>
  );
};

export const useEnhancedGameProgress = () => {
  const context = useContext(EnhancedGameProgressContext);
  if (!context) {
    throw new Error(
      "useEnhancedGameProgress must be used within an EnhancedGameProgressProvider"
    );
  }
  return context;
};
