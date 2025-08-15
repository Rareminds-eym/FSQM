import { AlertTriangle, Clock, Eye, Factory, Play, RotateCcw, Trophy } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeviceLayout } from "../hooks/useOrientation";
import { supabase } from "../lib/supabase";
import "./styles/landscape-prompt.css";

// Import our modular components and hooks
import { LoadingScreen } from "./components/LoadingScreen";
import { SavedProgressModal } from "./components/SavedProgressModal";
import { TeamScoreModal } from "./components/TeamScoreModal";
import { useAuth } from "./hooks/useAuth";
import { useGameState } from "./hooks/useGameState";
import { useGameTimer } from "./hooks/useGameTimer";
import { DatabaseService } from "./services/databaseService";
import { AuthService } from "./services/authService";
import type { GmpSimulationProps } from "./types";

// Import existing components that we're keeping
import { QuestionCard } from "./QuestionCard";
import { Timer } from "./Timer";

const GmpSimulation: React.FC<GmpSimulationProps> = ({
  mode,
  onProceedToLevel2,
}) => {
  const navigate = useNavigate();
  const { isMobile, isHorizontal } = useDeviceLayout();
  const isMobileHorizontal = isMobile && isHorizontal;

  // Authentication and team info
  const { teamInfo, teamInfoError, isLoadingTeamInfo, retryAuth, clearError } = useAuth();

  // Game state management
  const {
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
    startGame,
  } = useGameState(mode);

  // Local UI state
  const [showTeamScoreModal, setShowTeamScoreModal] = useState(false);
  const [showCaseBrief, setShowCaseBrief] = useState(false);
  const [showCaseChangeIndicator, setShowCaseChangeIndicator] = useState(false);
  const [previousQuestionId, setPreviousQuestionId] = useState<string | null>(null);

  const [showLandscapePrompt, setShowLandscapePrompt] = useState(false);
  const [hasUserDismissedPrompt, setHasUserDismissedPrompt] = useState(false);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    const currentGameState = gameStateRef.current;
    const finalScore = calculateScore(currentGameState.answers, currentGameState.questions);
    setGameState((prev) => ({
      ...prev,
      gameCompleted: true,
      score: finalScore,
      timeRemaining: 0,
    }));
  }, [calculateScore, gameStateRef, setGameState]);

  // Timer and auto-save
  const { showSaveIndicator } = useGameTimer(
    gameState,
    teamInfo,
    { gameStateRef, sessionIdRef, emailRef },
    handleTimeUp
  );

  // Update refs when values change
  useEffect(() => {
    updateRefs(gameState, teamInfo?.session_id || null, teamInfo?.email || null);
  }, [gameState, teamInfo, updateRefs]);

  // Load saved progress when team info is available
  useEffect(() => {
    console.log("🔍 Checking if should load saved progress:", {
      hasTeamInfo: !!teamInfo,
      progressLoaded,
      isLoadingProgress,
      teamInfo: teamInfo ? { session_id: teamInfo.session_id, email: teamInfo.email } : null
    });

    if (teamInfo && !progressLoaded && !isLoadingProgress) {
      console.log("🚀 Loading saved progress...");
      loadSavedProgress(teamInfo);
    }
  }, [teamInfo, progressLoaded, isLoadingProgress, loadSavedProgress]);

  // Debug effect to monitor progress state changes
  useEffect(() => {
    console.log("📊 Progress state changed:", {
      progressLoaded,
      isLoadingProgress,
      hasSavedProgress,
      hasAnyProgress,
      savedProgressInfo: !!savedProgressInfo
    });
  }, [progressLoaded, isLoadingProgress, hasSavedProgress, hasAnyProgress, savedProgressInfo]);

  // Module 6 polling removed - no longer needed since Results screen is removed

  // Force landscape orientation for better gameplay experience
  useEffect(() => {
    const checkOrientation = () => {
      // Check if device is mobile and in portrait mode
      const isMobilePortrait = isMobile && !isHorizontal;

      if (isMobilePortrait && !hasUserDismissedPrompt) {
        setShowLandscapePrompt(true);
      } else {
        setShowLandscapePrompt(false);
      }
    };

    // Check orientation on mount and when orientation changes
    checkOrientation();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      setTimeout(checkOrientation, 100); // Small delay to ensure orientation is updated
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [isMobile, isHorizontal, hasUserDismissedPrompt]);

  // Show landscape prompt immediately when game starts on mobile portrait
  useEffect(() => {
    if (gameState.gameStarted && isMobile && !isHorizontal && !hasUserDismissedPrompt) {
      setShowLandscapePrompt(true);
    }
  }, [gameState.gameStarted, isMobile, isHorizontal, hasUserDismissedPrompt]);

  // Show case brief for mobile horizontal (legacy behavior)
  useEffect(() => {
    if (gameState.gameStarted && gameState.currentLevel === 1 && isMobileHorizontal) {
      setTimeout(() => setShowCaseBrief(true), 100);
    }
  }, [gameState.gameStarted, gameState.currentLevel, isMobileHorizontal]);

  // Detect case changes and show indicator
  useEffect(() => {
    const currentQuestion = gameState.questions[gameState.currentQuestion];

    if (currentQuestion && previousQuestionId && previousQuestionId !== String(currentQuestion.id)) {
      // Case has changed, show the indicator
      setShowCaseChangeIndicator(true);

      // Hide the indicator after 3 seconds
      const timer = setTimeout(() => {
        setShowCaseChangeIndicator(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    // Update the previous question ID
    if (currentQuestion) {
      setPreviousQuestionId(String(currentQuestion.id));
    }
  }, [gameState.questions, gameState.currentQuestion, previousQuestionId]);

  // Handle answer submission
  const handleAnswer = useCallback(async (answer: Partial<{ violation: string; rootCause: string; solution: string }>) => {
    setGameState((prev) => {
      const newAnswers = [...prev.answers];
      const currentAnswer = prev.answers[prev.currentQuestion] || { violation: "", rootCause: "", solution: "" };

      // Merge the partial answer with the current answer
      const updatedAnswer = {
        violation: answer.violation ?? currentAnswer.violation,
        rootCause: answer.rootCause ?? currentAnswer.rootCause,
        solution: answer.solution ?? currentAnswer.solution,
      };

      newAnswers[prev.currentQuestion] = updatedAnswer;

      // Auto-save answers and questions to database after every answer
      const saveAttemptDetails = async () => {
        if (!teamInfo?.session_id || !teamInfo?.email) {
          console.log("❌ Auto-save skipped - missing team info:", {
            hasSessionId: !!teamInfo?.session_id,
            hasEmail: !!teamInfo?.email
          });
          return;
        }

        console.log("💾 Auto-saving attempt details:", {
          email: teamInfo.email,
          sessionId: teamInfo.session_id,
          moduleNumber: prev.currentLevel === 1 ? 5 : 6,
          questionIndex: prev.currentQuestion,
          hasQuestion: !!prev.questions[prev.currentQuestion],
          answer: updatedAnswer,
          timeRemaining: prev.timeRemaining
        });

        try {
          const result = await DatabaseService.saveCurrentPosition(
            teamInfo.email,
            teamInfo.session_id,
            prev.currentLevel === 1 ? 5 : 6,
            prev.currentQuestion,
            prev.questions[prev.currentQuestion],
            updatedAnswer,
            prev.timeRemaining
          );

          console.log("💾 Auto-save result:", result);

          if (!result.success) {
            console.error("❌ Auto-save failed:", result.error);
          } else {
            console.log("✅ Auto-save successful");
          }
        } catch (error) {
          console.error("💥 Error auto-saving attempt details:", error);
        }
      };

      saveAttemptDetails();

      return {
        ...prev,
        answers: newAnswers,
      };
    });
  }, [setGameState, teamInfo]);

  // Handle next question
  const nextQuestion = useCallback(() => {
    setGameState((prev) => {
      const nextQuestionIndex = prev.currentQuestion + 1;

      if (nextQuestionIndex >= prev.questions.length) {
        // All questions completed
        const finalScore = calculateScore(prev.answers, prev.questions);
        
        // Save individual attempt
        if (teamInfo?.session_id && teamInfo?.email) {
          const finalTime = 600 - prev.timeRemaining;
          const moduleNumber = prev.currentLevel === 1 ? 5 : 6;
          
          DatabaseService.saveIndividualAttempt(
            teamInfo.email,
            teamInfo.session_id,
            moduleNumber,
            finalScore,
            finalTime
          ).then(() => {
            setShowTeamScoreModal(true);

            // Check if team is complete and save team attempt
            DatabaseService.checkTeamComplete(teamInfo.session_id, moduleNumber).then((result) => {
              if (result.success && result.isComplete) {
                DatabaseService.saveTeamAttempt(teamInfo.session_id, moduleNumber);
              }
            });

            // If this is level 1 and we have a callback to proceed to level 2, call it after a short delay
            if (prev.currentLevel === 1 && onProceedToLevel2) {
              setTimeout(() => {
                onProceedToLevel2();
              }, 2000); // 2 second delay to allow the team score modal to be seen
            }
          });
        }

        return {
          ...prev,
          gameCompleted: true,
          score: finalScore,
          showLevelModal: false, // Removed completion time modal
        };
      } else {
        // Save current position to database
        if (teamInfo?.session_id && teamInfo?.email) {
          DatabaseService.saveCurrentPosition(
            teamInfo.email,
            teamInfo.session_id,
            prev.currentLevel === 1 ? 5 : 6,
            nextQuestionIndex,
            prev.questions[nextQuestionIndex] || null,
            prev.answers[nextQuestionIndex] || null,
            prev.timeRemaining
          );
        }

        return {
          ...prev,
          currentQuestion: nextQuestionIndex,
        };
      }
    });
  }, [setGameState, calculateScore, teamInfo]);

  // Continue game from saved progress
  const continueGame = useCallback(async () => {
    console.log("🎮 Continue button clicked!");
    console.log("🔍 Continue game state:", {
      hasTeamInfo: !!teamInfo,
      hasSavedProgress,
      hasAnyProgress,
      savedProgressInfo: !!savedProgressInfo,
      mode
    });

    if (!teamInfo) {
      console.error("❌ No team info available for continue");
      return;
    }

    try {
      const moduleNumber = mode === "solution" ? 6 : 5;
      console.log("📊 Loading progress for module:", moduleNumber);

      const result = await DatabaseService.loadSavedProgress(
        teamInfo.email,
        teamInfo.session_id,
        moduleNumber
      );

      console.log("📥 Load progress result:", result);

      if (result.success && result.data && result.data.length > 0) {
        const attemptDetails = result.data;
        console.log("✅ Found attempt details:", attemptDetails);

        // Get the last saved position
        const lastDetail = attemptDetails[attemptDetails.length - 1];
        const lastQuestionIndex = lastDetail.question_index;
        const timeRemaining = lastDetail.time_remaining || 600;

        console.log("📍 Last saved position:", {
          lastQuestionIndex,
          timeRemaining,
          totalSavedQuestions: attemptDetails.length
        });

        // Create questions and answers arrays from saved data
        const savedQuestions: any[] = [];
        const savedAnswers: any[] = [];

        // Sort attempt details by question_index to ensure correct order
        const sortedDetails = attemptDetails.sort((a, b) => a.question_index - b.question_index);

        for (const detail of sortedDetails) {
          savedQuestions[detail.question_index] = detail.question;
          savedAnswers[detail.question_index] = detail.answer;
        }

        // Fill any missing slots with new questions
        const allQuestions = selectRandomQuestions();
        for (let i = 0; i < 5; i++) {
          if (!savedQuestions[i]) {
            savedQuestions[i] = allQuestions[i];
            savedAnswers[i] = { violation: "", rootCause: "", solution: "" };
          }
        }

        // Calculate the next question to continue from
        // If answered questions 0,1 (2 questions), should continue from question 2 (index 2)
        const nextQuestionIndex = Math.max(...attemptDetails.map(d => d.question_index)) + 1;
        const currentQuestionIndex = Math.min(nextQuestionIndex, savedQuestions.length - 1);

        // Determine the correct level based on module number
        const restoredLevel = moduleNumber === 5 ? 1 : 2;

        console.log("🎯 Setting game state:", {
          questionsLength: savedQuestions.length,
          answersLength: savedAnswers.length,
          lastQuestionIndex: lastQuestionIndex,
          nextQuestionIndex: nextQuestionIndex,
          currentQuestion: currentQuestionIndex,
          timeRemaining,
          moduleNumber,
          restoredLevel,
          answeredQuestions: attemptDetails.length
        });

        setGameState(prev => ({
          ...prev,
          currentLevel: restoredLevel as 1 | 2,
          questions: savedQuestions,
          answers: savedAnswers,
          currentQuestion: currentQuestionIndex,
          timeRemaining: timeRemaining,
          gameStarted: true,
          showCountdown: false,
        }));

        console.log("✅ Game continued from saved progress successfully!");
      } else {
        // No saved progress found, start new game
        console.log("⚠️ No saved progress found, starting new game");
        if (teamInfo) {
          startGame(teamInfo);
        }
      }
    } catch (error) {
      console.error("❌ Error continuing game:", error);
      // Fallback to new game
      console.log("🔄 Falling back to new game");
      if (teamInfo) {
        startGame(teamInfo);
      }
    }
  }, [teamInfo, hasSavedProgress, hasAnyProgress, savedProgressInfo, mode, startGame, selectRandomQuestions, setGameState]);

  // Debug function to test continue functionality
  const testContinue = useCallback(() => {
    console.log("🧪 Test continue function called");
    console.log("🔍 Current state:", {
      hasTeamInfo: !!teamInfo,
      teamInfo: teamInfo ? { email: teamInfo.email, session_id: teamInfo.session_id } : null,
      hasAnyProgress,
      hasSavedProgress,
      gameStarted: gameState.gameStarted,
      mode
    });

    // Force start the game for testing
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      showCountdown: false,
    }));
  }, [teamInfo, hasAnyProgress, hasSavedProgress, gameState.gameStarted, mode, setGameState]);

  // Debug function to manually trigger progress loading
  const testLoadProgress = useCallback(() => {
    console.log("🔄 Manually triggering progress load...");
    if (teamInfo) {
      loadSavedProgress(teamInfo);
    } else {
      console.log("❌ No team info available for manual load");
    }
  }, [teamInfo, loadSavedProgress]);

  // Debug function to test database directly
  const testDatabase = useCallback(async () => {
    console.log("🗄️ Testing database connection...");
    if (!teamInfo) {
      console.log("❌ No team info for database test");
      return;
    }

    try {
      const moduleNumber = mode === "solution" ? 6 : 5;
      console.log("📊 Testing database query:", {
        email: teamInfo.email,
        session_id: teamInfo.session_id,
        moduleNumber
      });

      const result = await DatabaseService.loadSavedProgress(
        teamInfo.email,
        teamInfo.session_id,
        moduleNumber
      );

      console.log("📥 Direct database result:", result);

      // Additional comprehensive check
      console.log("🔍 Comprehensive database check:");
      console.log("- Email:", teamInfo.email);
      console.log("- Session ID:", teamInfo.session_id);
      console.log("- Module Number:", moduleNumber);
      console.log("- Mode:", mode);

      // Check if there's any data at all in the table
      const { data: anyData, error: anyError } = await supabase
        .from("attempt_details")
        .select("count", { count: 'exact' });

      console.log("📊 Total records in attempt_details:", { count: anyData, error: anyError });

      // Show a sample of recent records to understand the data structure
      const { data: recentRecords, error: recentError } = await supabase
        .from("attempt_details")
        .select("email, session_id, module_number, question_index, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      console.log("📋 Recent records (last 10):", { recentRecords, recentError });

      // Show records grouped by user to see the pattern
      const { data: groupedRecords, error: groupedError } = await supabase
        .from("attempt_details")
        .select("email, session_id, module_number, count(*)")
        .order("created_at", { ascending: false });

      console.log("👥 All users with progress:", { groupedRecords, groupedError });

    } catch (error) {
      console.error("💥 Database test error:", error);
    }
  }, [teamInfo, mode]);

  // Debug function to test saving progress manually
  const testSaveProgress = useCallback(async () => {
    console.log("💾 Testing manual save progress...");
    if (!teamInfo) {
      console.log("❌ No team info for save test");
      return;
    }

    try {
      const moduleNumber = mode === "solution" ? 6 : 5;
      // Use a proper question structure from the game state or create a minimal valid one
      const testQuestion = gameState.questions.length > 0 ? gameState.questions[0] : null;
      const testAnswer = {
        violation: "Test violation answer",
        rootCause: "Test root cause answer",
        solution: "Test solution answer"
      };

      console.log("🧪 Attempting to save test data:", {
        email: teamInfo.email,
        sessionId: teamInfo.session_id,
        moduleNumber,
        questionIndex: 0,
        question: testQuestion ? "Valid question object" : "No question available",
        answer: testAnswer,
        timeRemaining: gameState.timeRemaining
      });

      const result = await DatabaseService.saveCurrentPosition(
        teamInfo.email,
        teamInfo.session_id,
        moduleNumber,
        0,
        testQuestion,
        testAnswer,
        gameState.timeRemaining
      );

      console.log("💾 Save test result:", result);

      if (result.success) {
        console.log("✅ Manual save successful! Now testing load...");

        // Test loading the saved data
        const loadResult = await DatabaseService.loadSavedProgress(
          teamInfo.email,
          teamInfo.session_id,
          moduleNumber
        );

        console.log("📥 Load test result:", loadResult);
      } else {
        console.error("❌ Manual save failed:", result.error);
      }

    } catch (error) {
      console.error("💥 Save test error:", error);
    }
  }, [teamInfo, mode, gameState.timeRemaining, gameState.questions]);

  // Debug function to check session status
  const testSession = useCallback(async () => {
    console.log("🔐 Testing session status...");

    try {
      // Check current session
      const { data: { session }, error } = await supabase.auth.getSession();

      console.log("🔐 Current session:", {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        sessionError: error?.message
      });

      // Test session validation
      const sessionValid = await AuthService.ensureValidSession();
      console.log("🔐 Session validation result:", sessionValid);

      // Test team info fetch
      const teamResult = await AuthService.fetchTeamInfo();
      console.log("👥 Team info fetch result:", teamResult);

    } catch (error) {
      console.error("💥 Session test error:", error);
    }
  }, []);

  // Comprehensive diagnostic function
  const runDiagnostics = useCallback(async () => {
    console.log("🔬 Running comprehensive diagnostics...");

    try {
      // 1. Check team info
      console.log("1️⃣ Team Info Check:");
      console.log("- Has team info:", !!teamInfo);
      if (teamInfo) {
        console.log("- Email:", teamInfo.email);
        console.log("- Session ID:", teamInfo.session_id);
        console.log("- Team Name:", teamInfo.teamName);
      }

      // 2. Check session
      console.log("2️⃣ Session Check:");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log("- Has session:", !!session);
      console.log("- Session error:", sessionError?.message);
      if (session?.user) {
        console.log("- User email:", session.user.email);
      }

      // 3. Check database connectivity
      console.log("3️⃣ Database Connectivity Check:");
      const { data: testData, error: testError } = await supabase
        .from("attempt_details")
        .select("count", { count: 'exact' })
        .limit(1);

      console.log("- Database accessible:", !testError);
      console.log("- Database error:", testError?.message);
      console.log("- Total records:", testData);

      // 4. Check table structure
      console.log("4️⃣ Table Structure Check:");
      const { data: sampleRecord, error: structureError } = await supabase
        .from("attempt_details")
        .select("*")
        .limit(1);

      console.log("- Structure accessible:", !structureError);
      console.log("- Structure error:", structureError?.message);
      if (sampleRecord && sampleRecord.length > 0) {
        console.log("- Sample record keys:", Object.keys(sampleRecord[0]));
      }

      // 5. Test session validation
      console.log("5️⃣ Session Validation Check:");
      const sessionValid = await AuthService.ensureValidSession();
      console.log("- Session valid:", sessionValid);

      // 6. Check for existing progress
      if (teamInfo) {
        console.log("6️⃣ Existing Progress Check:");
        const moduleNumber = mode === "solution" ? 6 : 5;
        const { data: existingProgress, error: progressError } = await supabase
          .from("attempt_details")
          .select("*")
          .eq("email", teamInfo.email)
          .eq("session_id", teamInfo.session_id)
          .eq("module_number", moduleNumber);

        console.log("- Progress query error:", progressError?.message);
        console.log("- Existing progress count:", existingProgress?.length || 0);
        if (existingProgress && existingProgress.length > 0) {
          console.log("- Progress details:", existingProgress);
        }
      }

      console.log("🔬 Diagnostics complete!");

    } catch (error) {
      console.error("💥 Diagnostics error:", error);
    }
  }, [teamInfo, mode]);

  // Show walkthrough video
  const showWalkthroughVideo = useCallback(() => {
    const videoUrl = "https://www.youtube.com/watch?v=7CemV2XIaXo";
    window.open(videoUrl, '_blank');
  }, []);

  // Attempt to request landscape orientation
  const requestLandscapeOrientation = useCallback(async () => {
    try {
      // Check if the Screen Orientation API is available
      if ('screen' in window && 'orientation' in window.screen && 'lock' in window.screen.orientation) {
        await (window.screen.orientation as any).lock('landscape');
        console.log('Successfully locked to landscape orientation');
      } else if ('orientation' in window.screen) {
        // Fallback for older browsers
        console.log('Screen Orientation API not fully supported, showing prompt only');
      }
    } catch (error) {
      console.log('Could not lock orientation:', error);
      // This is expected on many browsers/devices, so we just show the prompt
    }

    // Hide the prompt after attempting to rotate
    setShowLandscapePrompt(false);
    setHasUserDismissedPrompt(true);
  }, []);

  // Loading state
  const loadingIds = !teamInfo?.session_id || !teamInfo?.email || isLoadingProgress;

  // Determine what to render
  const shouldShowLoading = !gameState.gameStarted && !gameState.showCountdown && (loadingIds || teamInfoError);
  const shouldShowSavedProgressModal = !gameState.gameStarted && !gameState.showCountdown && !shouldShowLoading && hasSavedProgress && savedProgressInfo && teamInfo;
  const shouldShowStartScreen = !gameState.gameStarted && !gameState.showCountdown && !shouldShowLoading && !shouldShowSavedProgressModal;

  // Debug logging
  console.log("🎯 Render decision:", {
    shouldShowLoading,
    shouldShowSavedProgressModal,
    shouldShowStartScreen,
    hasSavedProgress,
    hasAnyProgress,
    hasSavedProgressInfo: !!savedProgressInfo,
    hasTeamInfo: !!teamInfo,
    gameStarted: gameState.gameStarted,
    showCountdown: gameState.showCountdown
  });

  // Render loading screen
  if (shouldShowLoading) {
    return (
      <LoadingScreen
        isLoadingTeamInfo={isLoadingProgress}
        teamInfoError={teamInfoError}
        onRetry={retryAuth}
        onClearError={clearError}
      />
    );
  }

  // Render saved progress modal
  if (shouldShowSavedProgressModal) {
    console.log("📱 Showing SavedProgressModal");
    return (
      <SavedProgressModal
        show={true}
        progressInfo={savedProgressInfo}
        onContinue={continueGame}
        onStartFresh={() => startGame(teamInfo)}
      />
    );
  }

  // Render start screen
  if (shouldShowStartScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 relative p-2">
        <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
        <div className="pixel-border bg-gradient-to-r from-cyan-600 to-blue-600 p-6 max-w-lg w-full text-center relative z-10">
          <h1 className="text-2xl font-black mb-4 text-cyan-100 pixel-text">
            {mode === "solution" ? "LEVEL 2: SOLUTION PHASE" : "LEVEL 1: DIAGNOSTIC PHASE"}
          </h1>
          <p className="text-cyan-200 mb-6 font-medium">
            {mode === "solution"
              ? "Implement corrective actions for the identified violations."
              : "Analyze food safety violations and identify root causes."
            }
          </p>

          {/* Show progress status if any progress exists */}
          {hasAnyProgress && (
            <div className="mb-4 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded pixel-border">
              <p className="text-yellow-200 text-sm font-medium">
                📋 Previous progress detected
              </p>
              <p className="text-yellow-300 text-xs mt-1">
                You can continue from where you left off or start fresh
              </p>
              <p className="text-yellow-400 text-xs mt-2">
                Current Level: {gameState.currentLevel} | Mode: {mode || "diagnostic"} | Module: {mode === "solution" ? 6 : 5}
              </p>
            </div>
          )}

          {/* Debug information */}
          <div className="mb-4 p-2 bg-gray-700/50 border border-gray-600 rounded text-xs">
            <p className="text-gray-300 mb-1">🔧 Debug Info:</p>
            <p className="text-gray-400">Progress Loaded: {progressLoaded ? "✅" : "❌"}</p>
            <p className="text-gray-400">Loading Progress: {isLoadingProgress ? "🔄" : "❌"}</p>
            <p className="text-gray-400">Has Any Progress: {hasAnyProgress ? "✅" : "❌"}</p>
            <p className="text-gray-400">Has Saved Progress: {hasSavedProgress ? "✅" : "❌"}</p>
            <p className="text-gray-400">Team Info: {teamInfo ? "✅" : "❌"}</p>
            {teamInfo && (
              <div className="mt-2 text-xs">
                <p className="text-gray-500">Email: {teamInfo.email}</p>
                <p className="text-gray-500">Session: {teamInfo.session_id}</p>
                <p className="text-gray-500">Module: {mode === "solution" ? 6 : 5}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {hasAnyProgress ? (
              <>
                <button
                  className="pixel-border bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-3 px-6 pixel-text transition-all flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("🖱️ Continue button clicked!");
                    continueGame();
                  }}
                >
                  <Play className="w-5 h-5" />
                  CONTINUE GAME
                </button>
                <button
                  className="pixel-border bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-black py-2 px-4 pixel-text transition-all text-sm flex items-center justify-center gap-2"
                  onClick={testContinue}
                >
                  🧪 TEST CONTINUE
                </button>
                <button
                  className="pixel-border bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black py-2 px-4 pixel-text transition-all text-sm flex items-center justify-center gap-2"
                  onClick={testLoadProgress}
                >
                  🔄 LOAD PROGRESS
                </button>
                <button
                  className="pixel-border bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black py-2 px-4 pixel-text transition-all text-sm flex items-center justify-center gap-2"
                  onClick={testDatabase}
                >
                  🗄️ TEST DB
                </button>
                <button
                  className="pixel-border bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-white font-black py-2 px-4 pixel-text transition-all text-sm flex items-center justify-center gap-2"
                  onClick={testSaveProgress}
                >
                  💾 TEST SAVE
                </button>
                <button
                  className="pixel-border bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-black py-2 px-4 pixel-text transition-all text-sm flex items-center justify-center gap-2"
                  onClick={testSession}
                >
                  🔐 TEST SESSION
                </button>
                <button
                  className="pixel-border bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-black py-2 px-4 pixel-text transition-all text-sm flex items-center justify-center gap-2"
                  onClick={runDiagnostics}
                >
                  🔬 RUN DIAGNOSTICS
                </button>
                <button
                  className="pixel-border bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-black py-2 px-4 pixel-text transition-all text-sm flex items-center justify-center gap-2"
                  onClick={() => teamInfo && startGame(teamInfo)}
                >
                  <RotateCcw className="w-4 h-4" />
                  START FRESH
                </button>
              </>
            ) : (
              <button
                className="pixel-border bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-3 px-6 pixel-text transition-all flex items-center justify-center gap-2"
                onClick={() => teamInfo && startGame(teamInfo)}
              >
                <Play className="w-5 h-5" />
                START GAME
              </button>
            )}

            <button
              className="pixel-border bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black py-2 px-4 pixel-text transition-all text-sm flex items-center justify-center gap-2"
              onClick={showWalkthroughVideo}
            >
              <Eye className="w-4 h-4" />
              WATCH TUTORIAL
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Countdown screen
  if (gameState.showCountdown) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 relative">
        <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
        <div className="text-center relative z-10">
          <div className="text-8xl font-black text-cyan-400 pixel-text animate-pulse mb-4">
            {gameState.countdownNumber}
          </div>
          <div className="text-xl font-bold text-cyan-200 pixel-text">
            {gameState.isCountdownForContinue ? "CONTINUING..." : "GET READY!"}
          </div>
        </div>
      </div>
    );
  }

  // Game completed - skip results screen, team score modal handles everything
  if (gameState.gameCompleted && !gameState.showLevelModal) {
    // Ensure the team score modal is shown
    if (!showTeamScoreModal) {
      setShowTeamScoreModal(true);
    }

    // Return a minimal background while the modal is displayed
    return (
      <div className="min-h-screen bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-20"></div>

        {/* TeamScoreModal will be rendered by the modal section below */}
        <TeamScoreModal
          show={showTeamScoreModal}
          level={gameState.currentLevel}
          onClose={() => setShowTeamScoreModal(false)}
          onDownload={() => {
            console.log("Download attempted scenarios");
          }}
          onHome={() => {
            console.log("Navigate to home");
            setShowTeamScoreModal(false);
            window.location.href = '/';
          }}
        />
      </div>
    );
  }

  // Main game UI
  return (
    <div className="min-h-screen bg-gray-800 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-scan-lines opacity-20"></div>

      {/* Header with timer and progress */}
      <div className="relative z-10 p-4 border-b border-cyan-600/30 bg-gray-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Factory className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-xl font-black text-cyan-100 pixel-text">
                {mode === "solution" ? "SOLUTION PHASE" : "DIAGNOSTIC PHASE"}
              </h1>
              <p className="text-cyan-300 text-sm">
                Question {gameState.currentQuestion + 1} of {gameState.questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Save indicator */}
            {showSaveIndicator && (
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                SAVED
              </div>
            )}

            {/* Score */}
            <div className="flex items-center gap-2 text-yellow-400">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">{gameState.score}</span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              <Timer
                timeRemaining={gameState.timeRemaining}
                initialTime={600}
                onTimeUp={handleTimeUp}
                setTimeRemaining={(timeOrUpdater) => {
                  if (typeof timeOrUpdater === 'function') {
                    setGameState(prev => {
                      const newTime = timeOrUpdater(prev.timeRemaining);
                      if (newTime <= 0) {
                        handleTimeUp();
                        return { ...prev, timeRemaining: 0 };
                      }
                      return { ...prev, timeRemaining: newTime };
                    });
                  } else {
                    const newTime = timeOrUpdater;
                    if (newTime <= 0) {
                      handleTimeUp();
                      setGameState(prev => ({ ...prev, timeRemaining: 0 }));
                    } else {
                      setGameState(prev => ({ ...prev, timeRemaining: newTime }));
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Case change indicator */}
      {showCaseChangeIndicator && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="pixel-border bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 text-white font-black pixel-text text-sm">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            NEW CASE LOADED
          </div>
        </div>
      )}

      {/* Main game content */}
      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          {gameState.questions.length > 0 && gameState.currentQuestion < gameState.questions.length && (
            <QuestionCard
              question={gameState.questions[gameState.currentQuestion]}
              level={gameState.currentLevel}
              onAnswer={handleAnswer}
              onNext={nextQuestion}
              currentAnswer={gameState.answers[gameState.currentQuestion]}
              session_id={teamInfo?.session_id || ""}
              email={teamInfo?.email || ""}
            />
          )}
        </div>
      </div>

      {/* Landscape orientation prompt */}
      {showLandscapePrompt && (
        <div className="landscape-prompt-overlay">
          <div className="landscape-prompt-modal">
            <div className="mb-4">
              <RotateCcw className="rotate-icon" />
            </div>
            <h3 className="landscape-prompt-title">
              🔄 ROTATE YOUR DEVICE
            </h3>
            <p className="landscape-prompt-text">
              This game is optimized for <strong>landscape mode</strong>. Please rotate your device horizontally for the best gaming experience.
            </p>
            <div className="landscape-prompt-buttons">
              <button
                className="landscape-prompt-button primary"
                onClick={requestLandscapeOrientation}
              >
                ROTATE TO LANDSCAPE
              </button>
              <button
                className="landscape-prompt-button secondary"
                onClick={() => {
                  setShowLandscapePrompt(false);
                  setHasUserDismissedPrompt(true);
                }}
              >
                CONTINUE IN PORTRAIT
              </button>
            </div>
            <p className="landscape-prompt-note">
              Note: Portrait mode may affect gameplay experience
            </p>
          </div>
        </div>
      )}

      {/* Case brief modal for mobile */}
      {showCaseBrief && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="pixel-border bg-gradient-to-r from-blue-600 to-purple-600 p-6 max-w-md w-full">
            <h3 className="text-lg font-black mb-4 text-blue-100 pixel-text">
              📱 MOBILE DETECTED
            </h3>
            <p className="text-blue-200 mb-4 text-sm">
              For the best experience, please rotate your device to landscape mode or use a larger screen.
            </p>
            <button
              className="pixel-border bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-2 px-4 pixel-text transition-all w-full"
              onClick={() => setShowCaseBrief(false)}
            >
              CONTINUE ANYWAY
            </button>
          </div>
        </div>
      )}

      {/* TeamScoreModal is now rendered in the completion state above */}
      {/* ModuleCompleteModal removed - no longer showing completion time popup */}
    </div>
  );
};

export default GmpSimulation;
