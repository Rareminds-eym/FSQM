import React from "react";
import { useParams } from "react-router-dom";
import GameEngine from "./GmpSimulation";
import Level2Simulation from "./Level2Simulation";

// Simple router to route HL1/HL2 to their respective components
const FsqmSimulationRouter: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const id = levelId?.toUpperCase();

  if (id === "HL2") {
    // Dedicated HL2 flow with eligibility checks and progress
    return <Level2Simulation />;
  }

  // Default (HL1) uses GameEngine
  return <GameEngine />;
};

export default FsqmSimulationRouter;