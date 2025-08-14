import { Lock, Battery, Zap, Gauge, BatteryCharging, Cpu } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameProgress } from "../../../context/GameProgressContext";
import { Level } from "../../../types/game";
import { getDifficultyBadge } from "../../../utils/difficultyBadge";
import { supabase } from "../../../lib/supabase";

interface LevelCardProps {
  level: Level;
}

const LevelCard: React.FC<LevelCardProps> = ({ level }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hackathonUnlocked, setHackathonUnlocked] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { progress } = useGameProgress();

  const isHackathon = Number(level.id) > 15;

  // Check hackathon unlock for levels 16 and 17
  useEffect(() => {
    if (isHackathon && (Number(level.id) === 16 || Number(level.id) === 17)) {
      const checkUnlock = async () => {
        try {
          const { data, error } = await supabase
            .from("hackathon_unlocks")
            .select("level_id, force_unlock")
            .eq("level_id", Number(level.id))
            .single();

          if (error) {
            console.error(`[LevelCard] Error fetching hackathon unlock for level ${level.id}:`, error);
            setHackathonUnlocked(false);
            return;
          }

          if (!data) {
            console.log(`[LevelCard] Level ${level.id}: No hackathon unlock data found`);
            setHackathonUnlocked(false);
            return;
          }

          // Use force_unlock boolean directly
          const unlocked = !!data.force_unlock;
          setHackathonUnlocked(unlocked);
        } catch (err) {
          setHackathonUnlocked(false);
        }
      };

      checkUnlock();
      const interval = setInterval(checkUnlock, 60_000); // refresh every 1 minute
      return () => clearInterval(interval);
    }
  }, [level.id, isHackathon, progress.completedLevels]);

  // Compute unlock state
  const isUnlocked = !isHackathon
    ? level.id === 1 || progress.completedLevels.includes(Number(level.id) - 1)
    : !!hackathonUnlocked;

  const isCompleted = progress.completedLevels.includes(Number(level.id));

  const getBatteryIcon = (id: number) => {
    const icons = [Battery, Zap, Gauge, BatteryCharging, Cpu];
    return icons[id % icons.length];
  };

  const Icon = getBatteryIcon(level.id);
  const difficulty = getDifficultyBadge(level.difficulty);

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
                text-black text-xs font-bold"
              >
                {isHackathon
                  ? "Unlocks at scheduled time"
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
