import React, { useEffect, useState } from "react";
import CircuitLines from "../ui/animations/CircuitLines";
import GlowingTitle from "../ui/GlowingTitle";
import FoodLoader from "./FoodLoader";
import Loading from './loding.json';
import Lottie from "react-lottie-player";

interface LoaderScreenProps {
  onComplete: () => void;
}

const LoaderScreen: React.FC<LoaderScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress((prev) => Math.min(prev + 1, 100));
      } else {
        onComplete();
      }
    }, 30);

    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  return (
    <div
      className="min-h-screen 
      flex bg-yelloww flex-col items-center justify-center relative overflow-hidden"
    >
      <CircuitLines />

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex justify-center items-center gap-2 md:gap-4 mt-[10%]">
          {/* <img
            src="images/naan-mudhalvan.png"
            alt="Rareminds"
            className="w-24 mt-0 md:w-64 md:mt-10"
          />
          <div className="flex items-center justify-center self-center mt-0 md:mt-10">
            <span className="text-2xl md:text-6xl font-bold text-black mx-4">×</span>
          </div> */}
          <img
            src="/images/RareMinds-Logo.png"
            alt="RareMinds Logo"
            className="w-24  mt-0 md:w-64 md:mt-10"
          />
        </div>
        <div className="w-48 h-48 mb-12">
          <FoodLoader progress={progress} />
        </div>

        <GlowingTitle className="mb-16 text-center">
          {/* Food Safety and Quality Management */}
          SafeBite 2.0
          <h1>Hackathon</h1>
        </GlowingTitle>

        <div className="text-blue-400 mt-20 font-medium flex flex-col items-center justify-center">
          <h1 className="font-semibold text-xl md:text-3xl lg:mb-2">{progress}%</h1>
          <Lottie 
            animationData={Loading}
            loop
            play
            className='translate-x-0 w-40 h-40 md:translate-x-2.5 '
          />
        </div>
      </div>
    </div>
  );
};

export default LoaderScreen;
