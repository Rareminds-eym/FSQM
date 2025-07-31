import React from 'react';
import Food from './Food2.json';
import Lottie from 'react-lottie-player';

interface FoodLoaderProps {
  progress: number;
}

const FoodLoader: React.FC<FoodLoaderProps> = ({ progress }) => {
  return (
    <div className="relative group">
      {/* Battery Container */}
      <div className="relative transform group-hover:scale-105 mt-10 transition-all duration-500">
        
      <Lottie 
        animationData={Food}
        loop
        play
        className='translate-x-0 scale-100 md:translate-x-2.5 '
        />
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20
        rounded-full blur-xl opacity-50 animate-pulse" />
      {/* Connection Points */}
      <div className="absolute -left-4 top-1/2 w-3 h-3 bg-blue-400 rounded-full
        animate-pulse shadow-lg shadow-blue-400/50" />
      <div className="absolute -right-4 top-1/2 w-3 h-3 bg-emerald-400 rounded-full
        animate-pulse shadow-lg shadow-emerald-400/50" />
    </div>
  );
};

export default FoodLoader;