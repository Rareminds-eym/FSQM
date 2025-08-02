import React from "react";
import CircuitLines from "../ui/animations/CircuitLines";

interface GameIllustrationProps {
  img: string;
}

const GameIllustration: React.FC<GameIllustrationProps> = ({ img }) => {
  const getIllustration = () => {

    return (
      <div className="relative transform hover:scale-105 transition-all duration-500">
        <img src={img} alt="Game Illustration" className="rounded-lg shadow-md" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/20
          rounded-full blur-xl animate-pulse"
        />
      </div>
    );
  };

  return (
    <div
      className="bg-yellow-100/70 backdrop-blur-sm rounded-xl p-6 border border-yellow-600/30
      flex items-center justify-center relative overflow-hidden shadow-lg"
    >
      <CircuitLines className="opacity-30" />
      <div className="relative z-10 w-64 h-64">{getIllustration()}</div>
    </div>
  );
};

export default GameIllustration;
