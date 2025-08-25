import { Lock } from "lucide-react";
import "./LevelCard.css";
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
  const [isAnimating, setIsAnimating] = useState(false);
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
    if (!isUnlocked || isAnimating) return;
    setIsAnimating(true);

    const title = (level.title || "").toLowerCase();
    const isHL1 = Number(level.id) === 16 || title.includes("hackathon level 1");
    const isHL2 = Number(level.id) === 17 || title.includes("hackathon level 2");

    setTimeout(() => {
      console.log("[LevelCard] Clicked level:", { id: level.id, title: level.title });
      if (isHL1) {
        console.log("[LevelCard] Navigating to FSQM Simulation for HL1");
        navigate("/fsqm-simulation/HL1");
      } else if (isHL2) {
        console.log("[LevelCard] Navigating to FSQM Simulation for HL2");
        navigate("/fsqm-simulation/HL2");
      } else {
        console.log(`[LevelCard] Navigating to /game/${level.id}`);
        navigate(`/game/${level.id}`);
      }
      setIsAnimating(false);
    }, 600); // Animation duration
  };

  // Add running border and special theme for Hackathon Level 1 (id === 16) if active/unlocked
  const isHackathonLevel1 = isHackathon && Number(level.id) === 16;
  const showRunningBorder = isHackathonLevel1 && isUnlocked;

  // Gold/yellow theme for Hackathon Level 1
  const hackathon1FrontBg = "bg-gradient-to-br from-[#FFD700] via-[#FFB300] to-[#FF8C00] border-2 border-[#FFD700] shadow-2xl";
  const hackathon1BackBg = "bg-gradient-to-br from-[#FFEF8E] via-[#FFD700] to-[#FFB300] border-[#FFD700] shadow-2xl";
  const hackathon1Title = "text-[#7c5700] drop-shadow-[0_2px_8px_#fff8dc]"; // dark gold text with light shadow
  const hackathon1Difficulty = "bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#7c5700] font-semibold";
  const hackathon1Button = "bg-gradient-to-r from-[#FFB300] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFB300] text-[#7c5700] font-bold shadow-md";
  const hackathon1ButtonLocked = "bg-[#FFB300] text-[#7c5700] cursor-not-allowed font-bold opacity-70";
  const hackathon1Text = "text-[#7c5700] drop-shadow-[0_1px_2px_#fff8dc]";

  return (
    <div
      className={`group h-[300px] md:h-[400px] perspective-1000 cursor-pointer 
        ${!isUnlocked && "opacity-75 cursor-not-allowed"} ${showRunningBorder ? "running-border" : ""}`}
      onMouseEnter={() => isUnlocked && setIsFlipped(true)}
      onMouseLeave={() => isUnlocked && setIsFlipped(false)}
      onClick={handleStartLevel}
    >
      <div
        className={`relative w-full h-full transition-all duration-500 
          transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""} ${isAnimating && isUnlocked ? "animate-slide-up" : ""}`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-visibility-hidden">
          <div
            className={`h-full rounded-lg p-6 
            flex flex-col items-center justify-center gap-6
            transition-all duration-300 transform-gpu
            ${isHackathonLevel1
              ? hackathon1FrontBg
              : "bg-gradient-to-b from-yellow-900/40 via-yellow-800/40 to-yellow-700/40 border border-yellow-600/30 shadow-lg"}
            backdrop-blur-sm
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
                    className={`absolute inset-0 rounded-full transition-colors duration-300 
                      ${isHackathonLevel1 ? "bg-[#fff8dc]/60 blur-2xl" : "bg-white/20 blur-xl"}`}
                  />
                </>
              ) : (
                <Lock className={`w-24 h-24 ${isHackathonLevel1 ? "text-[#7c5700] drop-shadow-[0_2px_8px_#fff8dc]" : "text-slate-600"}`} />
              )}
            </div>

            <div className="text-center">
              <h3 className={`text-3xl font-bold mb-3 ${isHackathonLevel1 ? hackathon1Title : "text-yellow-400"}`}>
                {isHackathon ? level.title : `Level ${level.id}`}
              </h3>
              {!isHackathon && (
                <p className="text-lg mb-2 text-center text-blue-100">
                  {level.title}
                </p>
              )}
              <div
                className={`inline-flex px-3 py-1 rounded-full 
                ${isHackathonLevel1
                  ? hackathon1Difficulty
                  : isUnlocked
                    ? "bg-yellow-400/10 border border-yellow-200/30 text-yellow-100"
                    : "bg-gray-400/10 border border-gray-200/30 text-black"}`}
              >
                <span
                  className={`text-sm font-medium`}
                >
                  {level.difficulty}
                </span>
              </div>
            </div>

            {isUnlocked ? (
              <div
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 font-bold text-xs 
                  ${isHackathonLevel1 ? hackathon1Text + " bg-[#fff8dc]/80 px-2 py-1 rounded shadow" : "text-black"}`}
              >
                {isCompleted
                  ? "Completed - Click to replay"
                  : "Hover to see details"}
              </div>
            ) : (
              <div
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-center px-2 
                  ${isHackathonLevel1 ? hackathon1Text + " bg-[#fff8dc]/80 px-2 py-1 rounded shadow" : "text-black"}`}
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
            className={`h-full rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-300 transform-gpu shadow-lg backdrop-blur-sm border 
              ${isHackathonLevel1
                ? hackathon1BackBg
                : "bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 border-yellow-600/30"}`}
          >
            <div className="text-center flex-grow flex items-center justify-center">
              <p className={`text-2xl font-medium ${isHackathonLevel1 ? hackathon1Text + " drop-shadow-[0_2px_8px_#fff8dc] bg-[#fff8dc]/80 px-2 py-1 rounded" : "text-yellow-800"}`}>
                {level.symptoms}
              </p>
            </div>

            <button
              onClick={handleStartLevel}
              className={`mt-4 w-full py-3 px-4 rounded-md transform 
                hover:-translate-y-1 transition-all duration-300 font-medium
                ${isHackathonLevel1
                  ? (isUnlocked ? hackathon1Button : hackathon1ButtonLocked)
                  : isUnlocked
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
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
