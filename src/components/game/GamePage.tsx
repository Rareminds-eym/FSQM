import { AnimatePresence } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import CircuitLines from "../ui/animations/CircuitLines";
import {
  fetchGameProgress,
  fetchUserDetails,
  fetchUserStats,
  saveGameProgress,
  uploadToLeaderboard,
  convertProgressToGameState,
  saveGameCompletion,
  updateLeaderboardFromProgress,
} from "../../composables/gameProgress";
import { useAuth } from "../home/AuthContext";
import { useGameProgress } from "../../context/GameProgressContext";
import {
  gameLevelId,
  gamePoints,
  gameScenarios,
  getScenarioById,
} from "../../data/recoilState";
import { DiagnosticQuestion, DiagnosticScenario } from "../../types/game";
import TypewriterText from "../ui/TypewriterText";
import GameIllustration from "./GameIllustration";
import GameNavbar from "./GameNavbar";
import { DiagnosticPhase } from "./diagnostic";
import { ConfirmationModal, ErrorAnimation, SuccessModal } from "./feedback";
import TimeOutModal from "./feedback/TimeOutModal";
import { GlowingTitle } from "../ui";

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { levelId } = useParams();
  const { completeLevel } = useGameProgress();
  const getScenario = useRecoilValue(getScenarioById);
  const [scenarios, setScenarios] = useRecoilState<DiagnosticScenario[] | null>(
    gameScenarios
  );
  const [_gameLevelId, setGameLevelId] = useRecoilState(gameLevelId);
  const [scenario, setScenario] = useState<DiagnosticScenario | null>();
  const [relevantQuestions, setRelevantQuestions] = useState<any>();
  const [irrelevantQuestions, setIrrelevantQuestions] = useState<any>();
  const [accuracy, setAccuracy] = useState(100);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingOption, setPendingOption] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [_gamePoints, _setGamePoints] = useRecoilState(gamePoints);
  const [timeOut, setTimeOut] = useState(false);
  const [points, setPoints] = useState(100);
  const totalPoints = 100;
  const totalTime = 180;
  const [isLoading, setIsLoading] = useState(true);

  const [gameState, setGameState] = useState({
    answeredQuestions: [] as string[],
    showResolution: true,
    selectedResolution: [] as string[],
    completed: false,
    timeLeft: totalTime,
    score: 0,
    accuracy: 0,
  });

  // Get authenticated user from AuthContext
  const { user, isAuthenticated } = useAuth();

  const uploadLB = async () => {
    try {
      if (!user || !isAuthenticated) {
        console.log("User not authenticated - skipping leaderboard upload");
        return;
      }
      
      // Update leaderboard with current user's progress
      const result = await updateLeaderboardFromProgress(user.id);
      if (result.success) {
        console.log("Leaderboard updated successfully");
      } else {
        console.error("Error updating leaderboard:", result.error);
      }
    } catch (error) {
      console.error("Error uploading to leaderboard:", error);
    }
  };

  // Hide profile menu when component mounts
  useEffect(() => {
    const profileElement = document.querySelector('.fixed.top-4.right-4.z-50') as HTMLElement;
    if (profileElement) {
      profileElement.style.display = 'none';
    }
    
    // Show profile menu again when component unmounts
    return () => {
      const profileElement = document.querySelector('.fixed.top-4.right-4.z-50') as HTMLElement;
      if (profileElement) {
        profileElement.style.display = '';
      }
    };
  }, []);

  useEffect(() => {
    const validateLevel = async () => {
      if (!levelId) {
        navigate("/404");
        return;
      }
      try {
        // Validate level exists in scenarios
        if (scenarios && !scenarios.some(s => s.id.toString() === levelId)) {
          console.error("Level not found:", levelId);
          navigate("/404");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error validating level:", error);
        navigate("/404");
      }
    };
    validateLevel();
  }, [levelId, navigate, scenarios]);

  useEffect(() => {
    console.log(levelId);
    if (levelId) {
      setGameLevelId(levelId);
    }
  }, [levelId]);

  useEffect(() => {
    try {
      if (levelId) {
        // Get the updated scenario based on levelId
        const updatedScenario = getScenario;
        setScenario(updatedScenario);
        
        // Only proceed if we have a valid scenario
        if (updatedScenario == null || updatedScenario == undefined) return;
        
        const relevantQuestions_ = updatedScenario.questions.filter((q) => q.isRelevant);
        setRelevantQuestions(relevantQuestions_);
        const irrelevantQuestions_ = updatedScenario.questions.filter(
          (q) => q.isRelevant == false
        );
        setIrrelevantQuestions(irrelevantQuestions_);
        
        // Log to verify different scenarios are loaded
        console.log("Loaded scenario for level:", levelId, updatedScenario.title);
      }
    } catch (error) {
      console.error("Error fetching scenario:", error);
      navigate("/levels");
    }
  }, [_gameLevelId, navigate, scenarios, levelId, getScenario]);

  const handleSelectQuestion = useCallback(
    (question: DiagnosticQuestion) => {
      if (!gameState.answeredQuestions.includes(question.text)) {
        setGameState((prev) => ({
          ...prev,
          answeredQuestions: [...prev.answeredQuestions, question.text],
        }));
      }
    },
    [gameState.answeredQuestions]
  );

  const handleResolutionAttempt = useCallback((optionId: string) => {
    setPendingOption(optionId);
    setShowConfirmation(true);
  }, []);

  const handleConfirmResolution = useCallback(async () => {
    if (!pendingOption || !scenario) return;

    const option = scenario.resolutionQuestion.options.find(
      (opt) => opt.id === pendingOption
    );

    setShowConfirmation(false);
    setGameState((prev) => ({
      ...prev,
      selectedResolution: [
        ...(gameState.selectedResolution || []),
        pendingOption,
      ],
      // completed: false,
    }));

    if (option?.isCorrect) {
      setGameState((prev) => ({
        ...prev,
        completed: true,
      }));

      uploadLB();

      completeLevel(scenario.id);
      setShowSuccess(true);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  }, [pendingOption, scenario, completeLevel]);

  const handleNextLevel = useCallback(() => {
    setShowSuccess(false);
    setTimeOut(false);
    const nextLevel = Number(levelId) + 1;

    // Reset all game state
    setGameState({
      answeredQuestions: [],
      showResolution: true,
      selectedResolution: [],
      completed: false,
      timeLeft: totalTime,
      score: 100,
      accuracy: 100,
    });
    
    // Reset scenario-specific state
    setScenario(null);
    setRelevantQuestions(undefined);
    setIrrelevantQuestions(undefined);

    if (scenarios?.some((s) => s.id === nextLevel)) {
      // Navigate to next level with replace:true to ensure the URL is updated
      navigate(`/game/${nextLevel}`, { replace: true });
    } else {
      navigate("/levels", { replace: true });
    }
  }, [levelId, navigate]);

  // User authentication is now handled by the useAuth hook above

  useEffect(() => {
    if (
      !(
        gameState.selectedResolution.length > 0 ||
        gameState.answeredQuestions.length > 0
      )
    ) {
      console.log("No resolutions or answers provided.");
      return;
    }

    let resolutionPointDeduction = 0;
    let answeredQuestionsPointDeduction = 0;
    let irrelevantQuestionsPointDeduction = 0;

    const resolutionOptions = scenario?.resolutionQuestion?.options || [];
    const totalResolutionOptions = resolutionOptions.length;
    const totalQuestions = scenario?.questions?.length || 0;

    // Calculate points deducted for wrong answers in resolution
    const selectedWrongAnswers = gameState.selectedResolution.filter((q) =>
      resolutionOptions.some((option) => option.id === q && !option.isCorrect)
    ).length;

    if (totalResolutionOptions > 0) {
      resolutionPointDeduction =
        (selectedWrongAnswers * totalPoints) / totalResolutionOptions;
      console.log("Resolution Point Deduction:", resolutionPointDeduction);
    } else {
      console.warn("Resolution options length is undefined or zero.");
    }

    // Calculate points deducted for answered questions
    if (totalResolutionOptions > 0 && totalQuestions > 0) {
      answeredQuestionsPointDeduction =
        (totalPoints / totalResolutionOptions / totalQuestions) *
        gameState.answeredQuestions.length;
      console.log(
        "Answered Questions Point Deduction:",
        answeredQuestionsPointDeduction
      );
    } else {
      console.warn("Resolution options or questions are undefined or zero.");
    }

    // Update points
    setPoints(
      totalPoints - resolutionPointDeduction - answeredQuestionsPointDeduction
    );

    // Calculate points deducted for irrelevant questions answered
    const irrelevantQuestionsAnswered = gameState.answeredQuestions.filter(
      (q) =>
        scenario?.questions?.some(
          (question) => question.text === q && !question.isRelevant
        )
    ).length;

    if (irrelevantQuestions?.length > 0) {
      const totalIrrelevantQuestions = irrelevantQuestions?.length; // Avoid division by zero
      if (totalResolutionOptions > 0) {
        irrelevantQuestionsPointDeduction =
          (totalPoints / totalResolutionOptions / totalIrrelevantQuestions) *
          irrelevantQuestionsAnswered;
        console.log(
          totalPoints,
          totalResolutionOptions,
          totalIrrelevantQuestions,
          irrelevantQuestionsAnswered
        );
        console.log(
          "Irrelevant Questions Point Deduction:",
          irrelevantQuestionsPointDeduction
        );
      } else {
        console.warn(
          "Resolution options or irrelevant questions are undefined."
        );
      }

      console.log(irrelevantQuestionsPointDeduction);

      setAccuracy(
        100 - irrelevantQuestionsPointDeduction - resolutionPointDeduction
      );
    }
  }, [
    gameState.selectedResolution,
    scenario?.resolutionQuestion?.options,
    gameState.answeredQuestions,
    scenario?.questions,
    irrelevantQuestions?.length,
  ]);

  // Load game progress when component mounts or user/level changes
  useEffect(() => {
    const loadGameProgress = async () => {
      if (!user || !isAuthenticated || !levelId) {
        console.log("User not authenticated or no level ID - using local state only");
        return;
      }

      try {
        const progress = await fetchGameProgress(user.id, levelId);
        if (progress) {
          // Convert database progress to game state format
          const gameStateFromProgress = convertProgressToGameState(progress);
          if (gameStateFromProgress) {
            console.log("Loaded player's progress:", progress);
            setGameState(gameStateFromProgress);
          }
        } else {
          console.log("No previous progress found for this level");
        }
      } catch (error) {
        console.error("Error loading game progress:", error);
      }
    };

    loadGameProgress();
  }, [user, isAuthenticated, levelId]);

  // Save game progress whenever game state changes
  useEffect(() => {
    const saveCurrentProgress = async () => {
      if (!user || !isAuthenticated || !levelId || !scenario) {
        return;
      }

      // Only save if there's meaningful progress (user has interacted with the game)
      if (gameState.answeredQuestions.length === 0 && 
          gameState.selectedResolution.length === 0 && 
          gameState.timeLeft === totalTime) {
        return;
      }

      try {
        const result = await saveGameProgress(user.id, gameState, levelId);
        if (!result.success) {
          console.error("Failed to save game progress:", result.error);
        }
      } catch (error) {
        console.error("Error saving game progress:", error);
      }
    };

    // Debounce the save operation to avoid too frequent saves
    const timeoutId = setTimeout(saveCurrentProgress, 1000);
    return () => clearTimeout(timeoutId);
  }, [user, isAuthenticated, levelId, scenario, gameState]);

  useEffect(() => {
    if (gameState.timeLeft <= 0) {
      if (!gameState.completed) {
        if (scenario) {
          uploadLB();
          completeLevel(scenario.id);
        }
        setTimeOut(true);
      }
      setGameState((prev) => ({
        ...prev,
        completed: true,
        timeLeft: 0,
      }));

      return;
    }

    const timerId = setInterval(() => {
      if (gameState.completed) return () => clearInterval(timerId);
      setGameState((prev) => ({
        ...prev,
        timeLeft: gameState.timeLeft - 1,
      }));
    }, 1000);

    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, [gameState.timeLeft]);

  useEffect(() => {
    if (!scenario?.questions) return;
    const irrelevantQuestions_ = scenario.questions.filter(
      (q) => !q.isRelevant
    );
    setIrrelevantQuestions(irrelevantQuestions_);
    console.log(irrelevantQuestions);
  }, [scenario?.questions]);

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      accuracy: accuracy,
    }));
  }, [accuracy]);

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      score: points,
    }));
  }, [points]);

  useEffect(() => {
    if (
      gameState.answeredQuestions.length == 0 &&
      gameState.selectedResolution.length == 0
    )
      setPoints(100);
  }, [gameState.answeredQuestions.length, gameState.selectedResolution.length]);

  useEffect(() => {
    if (gameState.timeLeft <= 0) setPoints(0);
  }, [gameState.timeLeft]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex-1 bg-gradient-to-b from-yellow-400 via-yellow-400 to-yellow-500 p-8 relative overflow-hidden">
      {/* Add circuit lines background for visual depth */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <CircuitLines />
      </div>
      
      {scenario != null && (
        <>
          <GameNavbar
            currentLevel={scenario.id}
            accuracy={gameState.accuracy}
            playerPoints={gameState.score}
            timeLeft={gameState.timeLeft}
          />
          <div className="max-w-7xl mx-auto relative z-10 space-y-8">
              <div className="text-center space-y-4 pt-4 pb-6">
                <GlowingTitle className="text-3xl font-bold">
                  {scenario.title}
                </GlowingTitle>
                <TypewriterText
                  key={`description-${scenario.id}`}
                  text={scenario.description}
                  className="text-lg text-yellow-900 font-medium mx-auto max-w-3xl"
                />
              </div>

              {/* <GameIllustration img={scenario.img} /> */}

              <div className="bg-yellow-100/70 backdrop-blur-md rounded-xl p-6 border border-yellow-600/30 shadow-lg">
                <DiagnosticPhase
                  questions={scenario.questions}
                  answeredQuestions={gameState.answeredQuestions}
                  onSelectQuestion={handleSelectQuestion}
                  resolutionQuestion={scenario.resolutionQuestion}
                  selectedResolution={gameState.selectedResolution}
                  onSelectResolution={handleResolutionAttempt}
                  showResolution={gameState.completed}
                />
              </div>
          </div>
          <ConfirmationModal
            isOpen={showConfirmation}
            onConfirm={handleConfirmResolution}
            onCancel={() => {
              setShowConfirmation(false);
              setPendingOption(null);
            }}
            text="Are you sure you want to select this answer?"
            option={
              scenario.resolutionQuestion.options.find(
                (opt) => opt.id === pendingOption
              )?.text || ""
            }
          />
          <SuccessModal
            isOpen={showSuccess}
            onNext={handleNextLevel}
            currentLevel={scenario.id}
          />
          <TimeOutModal
            isOpen={timeOut}
            onNext={handleNextLevel}
            currentLevel={scenario.id}
          />
          <AnimatePresence>{showError && <ErrorAnimation />}</AnimatePresence>
        </>
      )}
    </div>
  );
};

export default GamePage;
