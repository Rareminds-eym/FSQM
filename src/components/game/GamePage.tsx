import { supabase } from "../../lib/supabase";
import { AnimatePresence } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  fetchGameProgress,
  fetchUserDetails,
  fetchUserStats,
  saveGameProgress,
  uploadToLeaderboard,
} from "../../composables/gameProgress";
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
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [gameState, setGameState] = useState({
    answeredQuestions: [] as string[],
    showResolution: true,
    selectedResolution: [] as string[],
    completed: false,
    timeLeft: totalTime,
    score: 0,
    accuracy: 0,
  });

  const uploadLB = async () => {
    try {
      if (currentUser) {
        const user = await fetchUserDetails(currentUser.id);
        const data = await fetchUserStats(currentUser.id);
        if (data) {
          console.log(data?.totalAccuracy, data?.completedLevels);
          uploadToLeaderboard(
            currentUser.id,
            user?.username,
            data?.totalScore,
            data?.totalAccuracy / data?.completedLevels,
            data?.completedLevels
          );
        }
      }
    } catch (error) {
      console.error(" Error uploading to leaderboard:", error);
    }
  };

  useEffect(() => {
    const validateLevel = async () => {
      if (!levelId) {
        navigate("/404");
        return;
      }
      try {
        const { data: level, error } = await supabase
          .from("scenarios")
          .select("*")
          .eq("id", levelId)
          .single();

        if (error || !level) {
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
  }, [levelId, navigate]);

  useEffect(() => {
    console.log(levelId);
    if (levelId) {
      setGameLevelId(levelId);
    }
  }, [levelId]);

  useEffect(() => {
    try {
      if (levelId) setScenario(getScenario);
      if (scenario == null || scenario == undefined) return;
      const relevantQuestions_ = scenario.questions.filter((q) => q.isRelevant);
      setRelevantQuestions(relevantQuestions_);
      const irrelevantQuestions_ = scenario.questions.filter(
        (q) => q.isRelevant == false
      );
      setIrrelevantQuestions(irrelevantQuestions_);
    } catch (error) {
      console.error("Error fetching scenario:", error);
      navigate("/levels");
    }
  }, [_gameLevelId, navigate, scenarios]);

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
  }, [pendingOption, scenario, completeLevel, auth]);

  const handleNextLevel = useCallback(() => {
    setShowSuccess(false);
    setTimeOut(false);
    const nextLevel = Number(levelId) + 1;

    setGameState({
      answeredQuestions: [],
      showResolution: true,
      selectedResolution: [],
      completed: false,
      timeLeft: totalTime,
      score: 100,
      accuracy: 100,
    });

    if (scenarios?.some((s) => s.id === nextLevel)) {
      navigate(`/game/${nextLevel}`, { replace: true });
    } else {
      navigate("/levels", { replace: true });
    }
  }, [levelId, navigate]);

  // Get current user on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

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

  useEffect(() => {
    if (currentUser && levelId) {
      fetchGameProgress(currentUser.id, levelId)
        .then((progress) => {
          if (progress) {
            // Handle the fetched progress
            console.log("Player's progress:", progress);
            setGameState({
              answeredQuestions: progress.answeredQuestions,
              showResolution: progress.showResolution,
              selectedResolution: progress.selectedResolution,
              completed: progress.completed,
              timeLeft: progress.timeLeft,
              score: progress.score,
              accuracy: progress.accuracy,
            });
          } else {
            // Handle case where no progress exists
            console.log("No progress found.");
            saveGameProgress(currentUser.id, gameState, levelId);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("No user logged in.");
      navigate("/");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && levelId && scenario)
      saveGameProgress(currentUser.id, gameState, levelId);
  }, [gameState]);

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
    <div className="flex-1 bg-yelloww">
      {scenario != null && (
        <>
          <GameNavbar
            currentLevel={scenario.id}
            questionsAnswered={gameState.answeredQuestions.length}
            totalQuestions={scenario.questions.length}
            accuracy={gameState.accuracy}
            playerPoints={gameState.score}
            currentHint={
              scenario.questions.find(
                (q) => !gameState.answeredQuestions.includes(q.text)
              )?.hint
            }
            timeLeft={gameState.timeLeft}
          />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-xl md:text-3xl font-bold text-black/70">
                  {scenario.title}
                </h1>
                <TypewriterText
                  text={scenario.description}
                  className="text-sm md:text-lg text-black"
                />
              </div>

              <GameIllustration img={scenario.img} />

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
