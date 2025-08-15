import { useCallback, useRef, useState } from "react";
import { hackathonData } from "../HackathonData";
import type { GameState, GameRefs, SavedProgressInfo, TeamInfo } from "../types";
import { DatabaseService } from "../services/databaseService";

export const useGameState = (mode?: string) => {
  // Determine which level to show based on mode
  const initialLevel = mode === "solution" ? 2 : 1;

  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState: GameState = {
      currentLevel: initialLevel as 1 | 2,
      currentQuestion: 0,
      questions: [],
      answers: [],
      score: 0,
      timeRemaining: 600, // 10 minutes
      gameStarted: false,
      gameCompleted: false,
      showLevelModal: false,
      level1CompletionTime: 0,
      showCountdown: false,
      countdownNumber: 3,
      isCountdownForContinue: false,
    };
    return initialState;
  });

  // Progress loading state
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [hasAnyProgress, setHasAnyProgress] = useState(false);
  const [savedProgressInfo, setSavedProgressInfo] = useState<SavedProgressInfo | null>(null);

  // Refs to access current values in intervals without causing re-renders
  const gameStateRef = useRef(gameState);
  const sessionIdRef = useRef<string | null>(null);
  const emailRef = useRef<string | null>(null);

  // Update refs when values change
  const updateRefs = useCallback((newGameState: GameState, sessionId: string | null, email: string | null) => {
    gameStateRef.current = newGameState;
    sessionIdRef.current = sessionId;
    emailRef.current = email;
  }, []);

  // Select 5 random questions for the user
  const selectRandomQuestions = useCallback(() => {
    const shuffled = [...hackathonData].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, []);

  // Calculate score based on answers and questions
  const calculateScore = useCallback((answers: GameState['answers'], questions: GameState['questions']) => {
    return answers.reduce((total, answer, index) => {
      const question = questions[index];
      if (!question || !answer) return total;

      let questionScore = 0;
      if (answer.violation === question.correctViolation) questionScore += 10;
      if (answer.rootCause === question.correctRootCause) questionScore += 10;
      if (answer.solution === question.correctSolution) questionScore += 20;

      return total + questionScore;
    }, 0);
  }, []);

  // Check if hackathon is completed
  const isHackathonCompleted = useCallback(() => {
    if (!gameState.questions.length || !gameState.answers.length) {
      console.log("isHackathonCompleted: No questions or answers", {
        questionsLength: gameState.questions.length,
        answersLength: gameState.answers.length,
      });
      return false;
    }

    const allAnswered = gameState.answers.every((answer, index) => {
      if (index >= gameState.questions.length) return false;
      
      const hasViolation = answer.violation && answer.violation.trim() !== "";
      const hasRootCause = answer.rootCause && answer.rootCause.trim() !== "";
      const hasSolution = answer.solution && answer.solution.trim() !== "";

      return hasViolation && hasRootCause && hasSolution;
    });

    console.log("isHackathonCompleted check:", {
      allAnswered,
      answersCount: gameState.answers.length,
      questionsCount: gameState.questions.length,
      answers: gameState.answers,
    });

    return allAnswered;
  }, [gameState.questions, gameState.answers]);

  // Load saved progress
  const loadSavedProgress = useCallback(async (teamInfo: TeamInfo) => {
    console.log("🔄 loadSavedProgress called with:", {
      session_id: teamInfo.session_id,
      email: teamInfo.email,
      progressLoaded,
      initialLevel
    });

    if (!teamInfo.session_id || !teamInfo.email || progressLoaded) {
      console.log("❌ Skipping loadSavedProgress:", {
        hasSessionId: !!teamInfo.session_id,
        hasEmail: !!teamInfo.email,
        progressLoaded
      });
      return;
    }

    setIsLoadingProgress(true);
    try {
      const moduleNumber = initialLevel === 1 ? 5 : 6;
      console.log("📊 Loading progress for module:", moduleNumber);

      const result = await DatabaseService.loadSavedProgress(
        teamInfo.email,
        teamInfo.session_id,
        moduleNumber
      );

      console.log("📥 Database result:", result);

      if (!result.success || !result.data) {
        console.log("❌ No saved progress found or error loading:", result.error);
        setProgressLoaded(true);
        return;
      }

      const attemptDetails = result.data;

      if (attemptDetails.length > 0) {
        console.log("✅ Found saved progress:", attemptDetails);

        // Set flag that we have any progress at all
        setHasAnyProgress(true);

        // First, get the questions that were saved
        const savedQuestionData = attemptDetails.map(detail => ({
          index: detail.question_index,
          question: detail.question,
          answer: detail.answer
        }));

        console.log("📋 Saved question data:", savedQuestionData);

        // Check if we have a complete set of 5 questions
        if (savedQuestionData.length === 5) {
          console.log("✅ Complete saved data found (5 questions)");
          // Use saved questions and answers
          const savedQuestions = savedQuestionData
            .sort((a, b) => a.index - b.index)
            .map(item => item.question);
          const savedAnswers = savedQuestionData
            .sort((a, b) => a.index - b.index)
            .map(item => item.answer);

          // Get the last saved position
          const lastDetail = attemptDetails[attemptDetails.length - 1];
          const lastQuestionIndex = lastDetail.question_index;
          const timeRemaining = lastDetail.time_remaining || 600;

          // Calculate the next question to continue from
          // If answered questions 0,1 (2 questions), should continue from question 2 (index 2)
          const nextQuestionIndex = Math.max(...attemptDetails.map(d => d.question_index)) + 1;
          const currentQuestionIndex = Math.min(nextQuestionIndex, savedQuestions.length - 1);

          // Determine the correct level based on module number
          const restoredLevel = moduleNumber === 5 ? 1 : 2;

          setGameState(prev => ({
            ...prev,
            currentLevel: restoredLevel as 1 | 2,
            questions: savedQuestions,
            answers: savedAnswers,
            currentQuestion: currentQuestionIndex,
            timeRemaining: timeRemaining,
            gameStarted: true,
          }));

          setHasSavedProgress(true);
          setSavedProgressInfo({
            currentQuestion: lastQuestionIndex + 1,
            totalQuestions: savedQuestions.length,
            answeredQuestions: savedAnswers.filter(a => a.violation && a.rootCause && a.solution).length,
            timeRemaining: timeRemaining,
          });

          console.log("🎮 Game state restored:", {
            currentLevel: restoredLevel,
            lastQuestionIndex: lastQuestionIndex,
            nextQuestionIndex: nextQuestionIndex,
            currentQuestion: currentQuestionIndex,
            timeRemaining,
            questionsCount: savedQuestions.length,
            answersCount: savedAnswers.length,
            moduleNumber,
            answeredQuestions: attemptDetails.length
          });
        } else {
          // Incomplete saved data, but still show continue option
          console.log("Incomplete saved data found, but will show continue option");

          // Generate new questions for now, but user can still continue
          const allQuestions = selectRandomQuestions();
          const allAnswers = allQuestions.map(() => ({
            violation: "",
            rootCause: "",
            solution: "",
          }));

          setGameState(prev => ({
            ...prev,
            questions: allQuestions,
            answers: allAnswers,
          }));

          // Set saved progress info even for incomplete data
          const lastDetail = attemptDetails[attemptDetails.length - 1];
          setSavedProgressInfo({
            currentQuestion: (lastDetail?.question_index || 0) + 1,
            totalQuestions: 5,
            answeredQuestions: attemptDetails.length,
            timeRemaining: lastDetail?.time_remaining || 600,
          });
          setHasSavedProgress(true);
        }
      } else {
        // No progress found
        console.log("❌ No saved progress found");
        setHasAnyProgress(false);
      }

      setProgressLoaded(true);
    } finally {
      setIsLoadingProgress(false);
    }
  }, [initialLevel, progressLoaded, selectRandomQuestions]);

  // Clear saved progress for a fresh start
  const clearSavedProgress = useCallback(async (teamInfo: TeamInfo) => {
    if (!teamInfo.session_id || !teamInfo.email) return;

    try {
      const moduleNumber = initialLevel === 1 ? 5 : 6;
      await DatabaseService.clearSavedProgress(
        teamInfo.email,
        teamInfo.session_id,
        moduleNumber
      );
    } catch (error) {
      console.error("Error clearing saved progress:", error);
    }
  }, [initialLevel]);

  // Start game with countdown
  const startGame = useCallback(async (teamInfo: TeamInfo) => {
    // Clear any existing saved progress for a fresh start
    await clearSavedProgress(teamInfo);

    const questions = selectRandomQuestions();
    const initialAnswers = questions.map(() => ({
      violation: "",
      rootCause: "",
      solution: "",
    }));

    setGameState(prev => ({
      ...prev,
      questions,
      answers: initialAnswers,
      currentQuestion: 0,
      score: 0,
      timeRemaining: 600, // 10 minutes
      gameCompleted: false,
      showLevelModal: false,
      showCountdown: true,
      countdownNumber: 3,
      isCountdownForContinue: false,
    }));

    // Countdown sequence: 3, 2, 1, then start
    const countdown = async () => {
      for (let i = 3; i >= 1; i--) {
        setGameState(prev => ({ ...prev, countdownNumber: i }));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setGameState(prev => ({
        ...prev,
        gameStarted: true,
        showCountdown: false,
      }));
    };

    countdown();
  }, [clearSavedProgress, selectRandomQuestions]);

  return {
    gameState,
    setGameState,
    isLoadingProgress,
    progressLoaded,
    hasSavedProgress,
    hasAnyProgress,
    savedProgressInfo,
    gameStateRef,
    sessionIdRef,
    emailRef,
    updateRefs,
    selectRandomQuestions,
    calculateScore,
    isHackathonCompleted,
    loadSavedProgress,
    clearSavedProgress,
    startGame,
  };
};
