import React from "react";
import CircuitLines from "../ui/animations/CircuitLines";

interface GameIllustrationProps {
  img: string;
}

const GameIllustration: React.FC<GameIllustrationProps> = ({ img }) => {
  const getIllustration = () => {

    return (
      <div className="relative transform hover:scale-105 transition-all duration-500">
        <img src={img} />
        <div
          className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-yellow-500/20
          rounded-full blur-xl animate-pulse"
        />
      </div>
    );
  };

  return (
    <div
       className=" backdrop-blur-sm p-6 bg-gradient-to-b from-yellow-200 to-yellow-300 z-0 rounded-2xl flex items-center 
       justify-center relative overflow-hidden border-2 border-yellow-100 "
    >
      <CircuitLines />
      <div className="relative z-10 w-32 h-32 md:w-64 md:h-64">{getIllustration()}</div>
      
    </div>
  );
};

export default GameIllustration;
