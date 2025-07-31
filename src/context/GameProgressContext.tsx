import React, { createContext, useContext, useState } from "react";

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

const GameProgressContext = createContext<GameProgressContextType | undefined>(
  undefined
);

export const GameProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [progress, setProgress] = useState<GameProgress>({
    completedLevels: [],
    currentLevel: 1,
    unlockedClues: {},
  });

  const completeLevel = (levelId: number) => {
    setProgress((prev) => ({
      ...prev,
      completedLevels: [...new Set([...prev.completedLevels, levelId])],
      currentLevel: levelId + 1,
    }));
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
