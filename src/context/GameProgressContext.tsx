import React, { createContext, useContext, useState, useEffect } from "react";

interface GameProgress {
  completedLevels: number[];
  currentLevel: number;
  unlockedClues: Record<number, number[]>; // Track unlocked clues per level
}

interface GameProgressContextType {
  progress: GameProgress;
  completeLevel: (levelId: number) => void;
  resetCompleteLevel: () => void;
  unlockClue: (levelId: number, clueIndex: number) => void;
  getUnlockedClues: (levelId: number) => number[];
}

const STORAGE_KEY = 'fsqm_game_progress';

const defaultProgress: GameProgress = {
  completedLevels: [],
  currentLevel: 1,
  unlockedClues: {},
};

const GameProgressContext = createContext<GameProgressContextType | undefined>(
  undefined
);

export const GameProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [progress, setProgress] = useState<GameProgress>(() => {
    // Try to load saved progress from localStorage on initialization
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        return JSON.parse(savedProgress);
      } catch (error) {
        console.error("Failed to parse saved game progress:", error);
        return defaultProgress;
      }
    }
    return defaultProgress;
  });

  const completeLevel = (levelId: number) => {
    console.log(`Completing level ${levelId}`);
    setProgress((prev) => {
      const updatedProgress = {
        ...prev,
        completedLevels: [...new Set([...prev.completedLevels, levelId])],
        currentLevel: Math.max(prev.currentLevel, levelId + 1),
      };
      console.log("Updated progress:", updatedProgress);
      return updatedProgress;
    });
  };

  const resetCompleteLevel = () => {
    setProgress({
      completedLevels: [],
      currentLevel: 1,
      unlockedClues: {},
    });
  };

  const unlockClue = (levelId: number, clueIndex: number) => {
    setProgress((prev) => ({
      ...prev,
      unlockedClues: {
        ...prev.unlockedClues,
        [levelId]: [...(prev.unlockedClues[levelId] || []), clueIndex],
      },
    }));
  };

  const getUnlockedClues = (levelId: number) => {
    return progress.unlockedClues[levelId] || [];
  };

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  return (
    <GameProgressContext.Provider
      value={{
        progress,
        completeLevel,
        unlockClue,
        getUnlockedClues,
        resetCompleteLevel,
      }}
    >
      {children}
    </GameProgressContext.Provider>
  );
};

export const useGameProgress = () => {
  const context = useContext(GameProgressContext);
  if (!context) {
    throw new Error(
      "useGameProgress must be used within a GameProgressProvider"
    );
  }
  return context;
};
