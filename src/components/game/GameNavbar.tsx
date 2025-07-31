import { Battery, ChevronLeft, Home, Menu } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../../composables/gamePlay";
import CluesList from "./clues/CluesList";
import sound from './click.mp3';

interface GameNavbarProps {
  currentLevel: number;
  questionsAnswered: number;
  totalQuestions: number;
  accuracy: number;
  currentHint?: string;
  timeLeft: number;
  playerPoints: number;
}

const GameNavbar: React.FC<GameNavbarProps> = ({
  currentLevel,
  questionsAnswered,
  totalQuestions,
  accuracy,
  playerPoints,
  currentHint,
  timeLeft,
}) => {
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);
  const [showHint, setShowHint] = useState(false); // State to toggle hint visibility
  // const points = accuracy * 10;

  const [audio] = useState(new Audio(sound)); // Replace with actual sound file path
  const [hasPlayed, setHasPlayed] = useState(false); // To ensure sound plays only once

  console.log(timeLeft,typeof timeLeft)
  // Play sound when time is up
  useEffect(() => {
    if (timeLeft <= 1 && hasPlayed) {
      console.log('Audio time up`s ');
      audio.play(); // Play the time's up sound
      setHasPlayed(true); // Ensure the sound only plays once
    }
  }, [timeLeft, audio, hasPlayed]);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-yellow-600/45">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left - Back Button and Stats Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/levels")}
              className="group p-2 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 z-0 shadow-xl border-2 border-yellow-200 transition-all duration-300"
            >
              <ChevronLeft
                className="w-5 h-5 text-black group-hover:text-violet-600 transform group-hover:-translate-x-1 transition-all duration-300"
              />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 rounded-lg bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 z-0 shadow-xl border-2 border-yellow-200 transition-all duration-300 group"
              >
                <Menu
                  className="w-5 h-5 text-black group-hover:text-violet-700 transform group-hover:rotate-180 transition-all duration-300"
                />
              </button>

              {/* Stats Submenu (conditionally shown) */}
              {showStats && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-yellow-400/70 backdrop-blur-sm rounded-lg border border-yellow-200 shadow-xl p-4">
                  <div className="mb-4 pb-4 border-b border-slate-700/50">
                    <MenuButton icon={Home} text="Home" onClick={() => navigate("/")} />
                  </div>
                  <div className="space-y-3">
                    <div className="text-black font-semibold text-sm flex items-center justify-between">
                      <span>Time Remaining</span>{" "}
                      <span>{timeLeft > 0 ? formatTime(timeLeft) : "Time’s up!"}</span>
                    </div>
                    <StatItem label="Accuracy" value={`${accuracy.toFixed(1)}%`} color="text-emerald-400" />
                    <StatItem label="Answered" value={`${questionsAnswered}/${totalQuestions}`} color="text-blue-400" />
                    <StatItem label="Maximum Points" value={playerPoints.toString()} color="text-red-400" />
                    <div className="mt-2">
                      <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                          style={{ width: `${playerPoints}%` }}
                        />
                      </div>
                    </div>

                    {/* Hint Section */}
                    {currentHint && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="w-full text-slate-400 text-sm hover:text-emerald-400"
                        >
                          {showHint ? "Hide Hint" : "Show Hint"}
                        </button>
                        {showHint && (
                          <div className="mt-2 text-sm text-slate-300">
                            <strong>Hint: </strong>{currentHint}
                          </div>
                        )}
                      </div>
                    )}
                    
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center - Level Display */}
          <div className="flex flex-col items-center hidden sm:flex">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <Battery className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-medium">Level {currentLevel}</span>
            </div>
          </div>

          {/* Right - Time and Points */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-black">
              <span className="font-medium">Time Left:</span>
              <span>{timeLeft > 0 ? formatTime(timeLeft) : "Time’s up!"}</span>
            </div>
            <div className="items-center gap-1 text-black z-60 hidden md:flex">
              <span className="font-medium">Points:</span>
              <span>{playerPoints}</span>
            </div>
          </div>

          {/* Right - Clues Button */}
          <div className="">
            <CluesList levelId={currentLevel} />
          </div>
        </div>
      </div>
    </nav>
  );
};

const MenuButton: React.FC<{
  icon: React.FC<any>;
  text: string;
  onClick: () => void;
}> = ({ icon: Icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-400 hover:text-white text-yellow-100 transition-all duration-200 group"
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
    <span className="font-semibold text-sm">{label}</span>
    <span className={`font-medium ${color}`}>{value}</span>
  </div>
);

export default GameNavbar;
