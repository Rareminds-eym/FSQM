import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Home, Clock } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { scenarios } from "../../../data/diagnosticScenarios";

interface SuccessModalProps {
  isOpen: boolean;
  onNext: () => void;
  currentLevel: number;
}

const TimeOutModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onNext,
  currentLevel,
}) => {
  const navigate = useNavigate();
  const isLastLevel = !scenarios.some((s) => s.id === currentLevel + 1);

  const handleNext = () => {
    if (isLastLevel) {
      navigate("/levels");
    } else {
      onNext();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative max-w-md w-full mx-4 bg-gradient-to-b from-yellow-400 to-yellow-500
              rounded-lg shadow-2xl border border-yellow-600 overflow-hidden"
          >
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-400/20 to-yellow-600/20
                animate-gradient-x"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_100%)]" />
            </div>

            {/* Content */}
            <div className="relative p-6 text-center">
              <div className="mb-4 inline-flex p-3 rounded-full bg-yellow-700/30 animate-bounce">
                <Clock className="w-8 h-8 text-yellow-800" />
              </div>

              <h3 className="text-2xl font-bold text-yellow-900 mb-2">
                {/* {isLastLevel ? "Congratulations!" : "Excellent Diagnosis!"} */}Oops Time Up!
              </h3>

              <p className="text-yellow-800 mb-6">
                {/* {isLastLevel
                  ? "You've completed all available diagnostic scenarios!"
                  : `You've successfully completed Level ${currentLevel}. Ready for the next challenge?`} */}
                  You've failed to diagnose the scenario. Better luck next time!
              </p>

              <button
                onClick={handleNext}
                className="w-full py-3 px-6 bg-gradient-to-r from-yellow-700 to-yellow-800
                  hover:from-yellow-600 hover:to-yellow-700 text-yellow-100 rounded-lg
                  font-medium flex items-center justify-center gap-2
                  transform hover:scale-105 transition-all duration-200"
              >
                {isLastLevel ? (
                  <>
                    Return to Levels
                    <Home className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Continue to Level {currentLevel + 1}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Sparkle Effects */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-700 rounded-full animate-ping"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TimeOutModal;
