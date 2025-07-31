export interface DifficultyBadge {
  colors: string;
}

export interface DiagnosticQuestion {
  text: string;
  answer: "Yes" | "No";
  isRelevant: boolean;
  explanation?: string;
  hint?: string;
}

export interface ResolutionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Level {
  difficulty: string;
  id: number;
  title: string;
  symptoms: string;
  img: string;
}

export interface DiagnosticScenario {
  id: number;
  title: string;
  symptoms: string;
  clues: string[];
  description: string;
  questions: DiagnosticQuestion[];
  difficulty: string;
  img: string;
  resolutionQuestion: {
    text: string;
    options: ResolutionOption[];
  };
}

export interface PlayerScore {
  username: string;
  totalScore: number;
  accuracy: number;
  completedLevels: number;
}

// export interface LevelsData {
//   id: number;
//   revealedQuestionsIds: string[];
//   attemptedAnswersIds: string[];
// }

// export interface SaveData {
//   currentLevel: LevelsData;
//   score: number;
//   completed: LevelsData[];
// }
