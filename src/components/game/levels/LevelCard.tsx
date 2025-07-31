import { Lock } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameProgress } from "../../../context/GameProgressContext";
// import { LevelImgs } from "../../../data/levelIcons";
import { Level } from "../../../types/game";
import { getDifficultyBadge } from "../../../utils/difficultyBadge";

interface LevelCardProps {
  level: Level;
}

const LevelCard: React.FC<LevelCardProps> = ({ level }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  const { progress } = useGameProgress();

  const isUnlocked =
    level.id === 1 || progress.completedLevels.includes(level.id - 1);
  const isCompleted = progress.completedLevels.includes(level.id);

  const difficulty = getDifficultyBadge(level.difficulty);

  const handleStartLevel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnlocked) {
      navigate(`/game/${level.id}`);
    }
  };

  return (
    <div
      className={`group h-[300px] md:h-[400px] perspective-1000 cursor-pointer 
        ${!isUnlocked && "opacity-75 cursor-not-allowed"}`}
      onMouseEnter={() => isUnlocked && setIsFlipped(true)}
      onMouseLeave={() => isUnlocked && setIsFlipped(false)}
    >
      <div
        className={`relative w-full h-full transition-all duration-500 
          transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-visibility-hidden">
          <div
            className={`h-full p-3 md:p-6
             group-hover:border-yellow-200
            flex flex-col items-center justify-center gap-0 md:gap-6
            transition-all duration-300
            ${isUnlocked
                ? "bg-gradient-to-b from-yellow-200/85 to-yellow-300 rounded-[2rem]  shadow-lg p-4  border-4 border-yellow-200"
                : "bg-gradient-to-b from-black/5 via-black/10 to-black/5 rounded-[2rem] shadow-lg p-4  border-4 border-yellow-300"
              }`}
          >
          <div className="relative">
            {isUnlocked ? (
              <>
                <img src={level.img} className="h-[90px] md:h-[120px]" />
                <div
                  className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full
                    group-hover:bg-yellow-400/20 transition-colors duration-300"
                />
              </>
            ) : (
              <Lock className="w-24 h-24 text-yellow-200/50" />
            )}
          </div>

          <div className="text-center">
            <h3
              className={`text-xl md:text-3xl font-bold mb-3
                ${isCompleted
                  ? "bg-gradient-to-r from-emerald-400 to-blue-400"
                  : isUnlocked
                    ? "bg-gradient-to-r from-blue-400 to-emerald-400 "
                    : "bg-black/40"
                } bg-clip-text text-transparent`}
            >
              Level {level.id}
            </h3>
            <p
              className={`text-sm md:text-lg mb-2 text-center
                ${isUnlocked ? "text-blue-500" : "text-slate-500"}`}
            >
              {level.title}
            </p>
            <div
              className={`inline-flex px-3 py-1 rounded-full 
                border ${difficulty.colors}`}
            >
              <span className="text-sm font-medium">{level.difficulty}</span>
            </div>
          </div>

          {isUnlocked ? (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 
                text-slate-400 text-sm opacity-60 text-center"
            >
              {isCompleted
                ? "Completed - Click to replay"
                : "Hover to see details"}
            </div>
          ) : (
            <div
              className="absolute bottom-4 text-center left-1/2 -translate-x-1/2 
                text-slate-500 text-sm"
            >
              Complete Level {level.id - 1} to unlock
            </div>
          )}
        </div>
      </div>

      {/* Back Side */}
      <div className="absolute inset-0 backface-visibility-hidden rotate-y-180">
        <div
          className="h-full backdrop-blur-sm 
            flex flex-col items-center justify-center transition-all duration-300
            bg-gradient-to-b from-violet-600 to-violet-300 rounded-[2rem] shadow-lg p-4 font-semibold border-4 border-violet-200"
        >
          <div className="text-center flex-grow flex items-center justify-center">
            <p
              className="text-2xl font-medium bg-gradient-to-r from-yellow-300 via-emerald-300 to-blue-300 
                bg-clip-text text-transparent animate-pulse"
            >
              {level.symptoms}
            </p>
          </div>

          <button
            onClick={handleStartLevel}
            className={`mt-4 w-5/6 py-3 px-4  transform 
                hover:-translate-y-1 transition-all duration-300 font-medium
                ${isUnlocked
                ? " bg-gradient-to-bl from-red-300 to-red-100 rounded-[1rem] shadow-lg p-4 font-semibold border-2 border-red-200"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
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
    </div >
  );
};

export default LevelCard;
