import { Lock } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEnhancedGameProgress } from "../../../context/EnhancedGameProgressContext";
import { Level } from "../../../types/game";
import { checkLevelUnlockStatus } from "./levelUnlock";

interface LevelCardProps {
  level: Level;
}

const LevelCard: React.FC<LevelCardProps> = ({ level }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [levelUnlocked, setLevelUnlocked] = useState<boolean | null>(null);
  const [isCheckingUnlock, setIsCheckingUnlock] = useState(true);
  const navigate = useNavigate();

  // Use enhanced context that handles training status
  const enhancedProgress = useEnhancedGameProgress();
  const { progress } = enhancedProgress;

  const isHackathon = Number(level.id) > 15;

  // Check level unlock status using enhanced environment-based system
  useEffect(() => {
    const checkUnlock = async () => {
      try {
        setIsCheckingUnlock(true);
        const unlocked = await checkLevelUnlockStatus(Number(level.id));
        setLevelUnlocked(unlocked);
        console.log(`[LevelCard] Level ${level.id} unlock status:`, unlocked);
      } catch (err) {
        console.error(`[LevelCard] Error checking unlock status for level ${level.id}:`, err);
        setLevelUnlocked(false);
      } finally {
        setIsCheckingUnlock(false);
      }
    };

    checkUnlock();

    // Refresh unlock status every 1 minute for all levels
    const interval = setInterval(checkUnlock, 60_000);
    return () => clearInterval(interval);
  }, [level.id, enhancedProgress.isTrainingActive]);

  // Compute unlock state with enhanced logic
  const isUnlocked = (() => {
    // If we're still checking or training is loading, show as locked
    if (isCheckingUnlock || enhancedProgress.isLoading || levelUnlocked === null) {
      return false;
    }

    // Use the database-driven unlock status
    if (!levelUnlocked) {
      return false;
    }

    // For hackathon levels (16, 17), rely purely on database status (independent of training)
    if (isHackathon) {
      return levelUnlocked;
    }

    // For training levels (1-15), check both database status and progression
    if (enhancedProgress.isTrainingActive) {
      // Level 1 is always unlocked if training is active and database allows it
      if (Number(level.id) === 1) {
        return levelUnlocked;
      }
      // Other training levels require previous level completion
      return levelUnlocked && progress.completedLevels.includes(Number(level.id) - 1);
    }

    // If training is inactive, training levels are locked regardless of database status
    return false;
  })();

  const isCompleted = enhancedProgress.isTrainingActive
    ? progress.completedLevels.includes(Number(level.id))
    : false;

  const handleStartLevel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUnlocked) return;
    if (Number(level.id) === 16) {
      console.log("[LevelCard] Navigating to FSQM Simulation for level 16 (HL1)");
      navigate("/fsqm-simulation/HL1");
    } else if (Number(level.id) === 17) {
      console.log("[LevelCard] Navigating to FSQM Simulation for level 17 (HL2)");
      navigate("/fsqm-simulation/HL2");
    } else {
      console.log(`[LevelCard] Navigating to /game/${level.id}`);
      navigate(`/game/${level.id}`);
    }
  };

  return (
    <div
      className={`group h-[300px] md:h-[400px] perspective-1000 cursor-pointer 
        ${!isUnlocked && "opacity-75 cursor-not-allowed"}`}
      onMouseEnter={() => isUnlocked && setIsFlipped(true)}
      onMouseLeave={() => isUnlocked && setIsFlipped(false)}
      onClick={handleStartLevel}
    >
      <div
        className={`relative w-full h-full transition-all duration-500 
          transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-visibility-hidden">
          <div
            className={`h-full rounded-lg p-6 
            flex flex-col items-center justify-center gap-6
            transition-all duration-300 transform-gpu
            bg-gradient-to-b from-yellow-900/40 via-yellow-800/40 to-yellow-700/40 backdrop-blur-sm
            border border-yellow-600/30 shadow-lg
            ${isUnlocked ? "" : "opacity-75"}`}
          >
            <div className="relative">
              {isUnlocked ? (
                <>
                  {/* <Icon className={`w-24 h-24 transition-colors duration-300
                    ${isCompleted 
                      ? 'text-white group-hover:text-gray-100' 
                      : 'text-gray-200 group-hover:text-white'
                    }`} /> */}
                  <div
                    className="absolute inset-0 bg-white/20 blur-xl rounded-full
                    transition-colors duration-300"
                  />
                </>
              ) : (
                <Lock className="w-24 h-24 text-slate-600" />
              )}
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold mb-3 text-yellow-400">
                {isHackathon ? level.title : `Level ${level.id}`}
              </h3>
              {!isHackathon && (
                <p className="text-lg mb-2 text-center text-blue-100">
                  {level.title}
                </p>
              )}
              <div
                className={`inline-flex px-3 py-1 rounded-full 
                ${isUnlocked ? "bg-yellow-400/10 border border-yellow-200/30" : "bg-gray-400/10 border border-gray-200/30"}`}
              >
                <span
                  className={`text-sm font-medium ${isUnlocked ? "text-yellow-100" : "text-black"}`}
                >
                  {level.difficulty}
                </span>
              </div>
            </div>

            {isUnlocked ? (
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2
                text-black font-bold text-xs"
              >
                {isCompleted
                  ? "Completed - Click to replay"
                  : "Hover to see details"}
              </div>
            ) : (
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2
                text-black text-xs font-bold text-center px-2"
              >
                {isCheckingUnlock || enhancedProgress.isLoading
                  ? "Checking access..."
                  : isHackathon
                  ? "Unlocks at scheduled time"
                  : !enhancedProgress.isTrainingActive
                  ? "Training mode disabled"
                  : Number(level.id) === 1
                  ? "Level locked by admin"
                  : "Complete previous level to unlock"}
              </div>
            )}
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-visibility-hidden rotate-y-180">
          <div
            className="h-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500
            backdrop-blur-sm rounded-lg p-6 border border-yellow-600/30
            flex flex-col items-center justify-center transition-all duration-300 transform-gpu
            shadow-lg"
          >
            <div className="text-center flex-grow flex items-center justify-center">
              <p className="text-2xl font-medium text-yellow-800">
                {level.symptoms}
              </p>
            </div>

            <button
              onClick={handleStartLevel}
              className={`mt-4 w-full py-3 px-4 rounded-md transform 
                hover:-translate-y-1 transition-all duration-300 font-medium
                ${
                  isUnlocked
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
            >
              {isCompleted
                ? "View Level"
                : isUnlocked
                ? "Start Diagnosis"
                : "Locked"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelCard;
