import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GmpSimulation from "../gmp-simulation/GmpSimulation";
import Level1Card from "../gmp-simulation/Level1Card";
import { gmpCases } from "../gmp-simulation/gmpCases";
import { DeviceOverlay } from "./DeviceOverlay";


export default function GmpSimulationScreen({ mode: routeMode }) {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Detect orientation
  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerWidth < window.innerHeight) {
        setShowOverlay(true);
      } else {
        setShowOverlay(false);
      }
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Use mode from router if provided, else calculate from levelId
  let mode = routeMode ?? "violation-root-cause";
  if (!routeMode && (levelId === "6" || levelId === "HL2")) mode = "solution";
  React.useEffect(() => {
    console.log(`[GmpSimulationScreen] Rendering GmpSimulation with mode:`, mode);
  }, [mode, levelId, routeMode]);

  // Handler to navigate to HL2 (module 6)
  const handleProceedToLevel2 = () => {
    if (levelId !== "HL2" && levelId !== "6") {
      setRedirecting(true);
      navigate("/gmp-simulation/6", { replace: true });
      setTimeout(() => window.location.reload(), 100);
    }
  };

  if (redirecting) {
    return null;
  }

  // Fullscreen wrapper for simulation
  return (
    <div className="h-screen bg-gray-800 flex flex-col overflow-hidden relative">
      {showOverlay ? (
        <DeviceOverlay />
      ) : levelId === "5" ? (
        (() => {
          const caseData = gmpCases[0];
          const question = {
            id: caseData.caseNo,
            caseFile: caseData.caseFile,
            options: [],
            correctViolation: caseData.violation,
            correctRootCause: caseData.rootCause,
            correctSolution: caseData.solution,
            violationOptions: [caseData.violation],
            rootCauseOptions: [caseData.rootCause],
            solutionOptions: [caseData.solution],
          };
          return (
            <Level1Card
              question={question}
              onAnswer={() => {}}
              onNext={() => {}}
            />
          );
        })()
      ) : (
        <GmpSimulation mode={mode} onProceedToLevel2={handleProceedToLevel2} />
      )}
    </div>
  );
}
