import React from "react";
import { useParams, Navigate } from "react-router-dom";
import GameEngine from "./GmpSimulation";
import Level2Simulation from "./Level2Simulation";

// Routes HL1 to GameEngine and HL2 to Level2Simulation based on :levelId
const FsqmSimulationRouter: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const id = (levelId || "").toLowerCase();

  // Accept a few common variants just in case
  const isHL2 = ["hl2", "l2", "2", "level2"].includes(id);
  const isHL1 = ["hl1", "l1", "1", "level1"].includes(id);

  if (isHL2) return <Level2Simulation />;
  if (isHL1) return <GameEngine />;

  // Unknown levelId -> redirect to levels page (or render HL1 by default)
  return <Navigate to="/levels" replace />;
};

export default FsqmSimulationRouter;