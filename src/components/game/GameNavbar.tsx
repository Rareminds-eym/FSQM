import { Battery, ChevronLeft, Home, Menu } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../../composables/gamePlay";
import CluesList from "./clues/CluesList";

interface GameNavbarProps {
  currentLevel: number;
  accuracy: number;
  timeLeft: number;
  playerPoints: number;
}

// We'll use inline styles for the animation

const GameNavbar: React.FC<GameNavbarProps> = ({
  currentLevel,
  accuracy,
  playerPoints,
  timeLeft,
}) => {
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);

  return (
    <>
      <nav className="bg-yellow-500/90 backdrop-blur-md border-b border-yellow-600/30 sticky top-0 z-40 
        shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left - Back Button and Stats Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/levels")}
              className="group p-2 rounded-lg bg-yellow-600/60 hover:bg-yellow-500/70 
                border border-yellow-700/40 hover:border-yellow-600/60 
                transform hover:-translate-y-1 hover:shadow-md
                transition-all duration-300"
            >
              <ChevronLeft
                className="w-5 h-5 text-yellow-900 group-hover:text-yellow-950
                transform group-hover:-translate-x-1 transition-all duration-300"
              />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 rounded-lg bg-yellow-600/60 hover:bg-yellow-700/70
                  border border-yellow-700/60 hover:border-yellow-800/80
                  transition-all duration-300 group"
              >
                <Menu
                  className="w-5 h-5 text-yellow-900 group-hover:text-yellow-950
                  transform group-hover:rotate-180 transition-all duration-300"
                />
              </button>

              {/* Stats Submenu */}
              {showStats && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 bg-gradient-to-b from-yellow-400 to-yellow-500 
                  backdrop-blur-sm rounded-lg border border-yellow-600/50 shadow-xl p-4"
                >
                  {/* Navigation Links */}
                  <div className="mb-4 pb-4 border-b border-yellow-600/50">
                    <MenuButton
                      icon={Home}
                      text="Home"
                      onClick={() => navigate("/")}
                    />
                  </div>

                  {/* Stats Section */}
                  <div className="space-y-3">
                    <div className="text-white text-sm flex items-center justify-between">
                      <span>Time Remaining</span>{" "}
                      <span>
                        {timeLeft > 0 ? formatTime(timeLeft) : "Time’s up!"}
                      </span>
                    </div>
                    <StatItem
                      label="Accuracy"
                      value={`${accuracy.toFixed(1)}%`}
                      color="text-yellow-900"
                    />
                    <StatItem
                      label="Answered"
                      value={`${currentLevel}/15`}
                      color="text-yellow-900"
                    />
                    <StatItem
                      label="Maximum Points"
                      value={playerPoints.toString()}
                      color="text-yellow-900"
                    />

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="h-1.5 bg-yellow-600/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-700 to-yellow-800
                            transition-all duration-300"
                          style={{
                            width: `${playerPoints}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center - Level Display */}
          <div className="flex flex-col items-center">
            <div
              className="flex items-center gap-3 px-4 py-2 bg-yellow-600/60 rounded-lg
              border border-yellow-700/60"
            >
              <Battery className="w-5 h-5 text-yellow-900" />
              <span className="text-yellow-950 font-bold">
                Level {currentLevel}
              </span>
            </div>
          </div>

          {/* Right - Clues Button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <CluesList levelId={currentLevel} />
            </div>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

const MenuButton: React.FC<{
  icon: React.FC<any>;
  text: string;
  onClick: () => void;
}> = ({ icon: Icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
       hover:bg-yellow-600/50 text-yellow-800 hover:text-yellow-900
      transition-all duration-200 group"
  >
    <Icon className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-200" />
    <span className="font-medium">{text}</span>
  </button>
);

const StatItem: React.FC<{
  label: string;
  value: string;
  color: string;
}> = ({ label, value, color }) => (
  <div className="flex items-center justify-between">
    <span className="text-yellow-800 text-sm font-medium">{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

export default GameNavbar;
