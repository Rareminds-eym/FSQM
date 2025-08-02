import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { levels } from '../../../data/levels';
import { Home } from "lucide-react";
import { useRecoilState } from "recoil";
import { fetchTopLevel } from "../../../composables/fetchLevel";
import { useGameProgress } from "../../../context/GameProgressContext";
import { gameScenarios } from "../../../data/recoilState";
import { scenarios } from "../../../data/diagnosticScenarios"; // Direct import for testing
import { useAuth } from "../../home/AuthContext";
import GlowingTitle from "../../ui/GlowingTitle";
import CircuitLines from "../../ui/animations/CircuitLines";
import LevelCard from "./LevelCard";

const LevelsPage: React.FC = () => {
  const navigate = useNavigate();
  const [, setGameScenarios] = useRecoilState<any>(gameScenarios);
  const [topLevel, setTopLevel] = useState(0);
  const { completeLevel } = useGameProgress();
  const { user } = useAuth();

  // Initialize diagnostic scenarios in global state for game use
  useEffect(() => {
    console.log("Initializing diagnostic scenarios for game use");
    setGameScenarios(scenarios);
  }, [setGameScenarios]);

  useEffect(() => {
    if (user) {
      fetchTopLevel(user.id)
        .then((topLevel_) => {
          setTopLevel(topLevel_);
        })
        .catch((error) => console.error(error));
    }
  }, [user]);

  useEffect(() => {
    for (let i = 1; i <= topLevel; i++) completeLevel(i);
  }, [topLevel, completeLevel]);

  return (
    <div className="flex-1 bg-gradient-to-b from-yellow-400 via-yellow-400 to-yellow-500 p-8 relative overflow-hidden">
      <CircuitLines className="opacity-30"/>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Home Button */}
        <div className="absolute left-0 top-0">
          <button
            onClick={() => navigate("/")}
            className="group p-3 rounded-lg bg-yellow-500/70 hover:bg-yellow-400/80 
              border border-yellow-600/60 hover:border-orange-400/70 
              transform hover:-translate-y-1 hover:translate-x-1
              transition-all duration-300"
          >
            <Home
              className="w-5 h-5 text-yellow-800 group-hover:text-orange-600
              transition-colors duration-300"
            />
          </button>
        </div>

        <div className="space-y-12 pt-16">
          <div className="text-center pt-4 pb-10 scale-75 sm:scale-100">
            <GlowingTitle className="text-center">DIAGNOSTIC LEVELS </GlowingTitle>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels && levels.length > 0 ? (
            levels.map((level: any) => (
              <LevelCard key={level.id} level={level} />
            ))
          ) : (
            <div className="col-span-full text-center text-white text-lg">
              Loading levels...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelsPage;
