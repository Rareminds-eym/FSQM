import type { Question } from "../HackathonData";

export interface GameState {
  currentLevel: 1 | 2;
  currentQuestion: number;
  questions: Question[];
  answers: Array<{
    violation: string;
    rootCause: string;
    solution: string;
  }>;
  score: number;
  timeRemaining: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  showLevelModal: boolean;
  level1CompletionTime: number;
  showCountdown: boolean;
  countdownNumber: number;
  isCountdownForContinue: boolean;
}

export interface GmpSimulationProps {
  mode?: string;
  onProceedToLevel2?: () => void;
}

export interface SavedProgressInfo {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
  timeRemaining: number;
}

export interface TeamInfo {
  session_id: string;
  email: string;
  teamName?: string;
  collegeCode?: string;
  fullName?: string;
}

export interface AttemptDetail {
  question_index: number;
  question: Question;
  answer: {
    violation: string;
    rootCause: string;
    solution: string;
  };
  time_remaining: number;
}

export interface GameAnswer {
  violation: string;
  rootCause: string;
  solution: string;
}

export interface GameRefs {
  gameStateRef: React.MutableRefObject<GameState>;
  sessionIdRef: React.MutableRefObject<string | null>;
  emailRef: React.MutableRefObject<string | null>;
}
