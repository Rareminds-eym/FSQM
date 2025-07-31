import React from 'react';
import Lottie from 'react-lottie-player';
import Food from './Food.json'


interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className} w-44 h-44`}>
      <div className="transform-gpu transition-transform duration-500 hover:scale-110">
        <Lottie 
        animationData={Food}
        loop
        play
        className='translate-x-0 scale-100 md:translate-x-2.5 '
        />
      </div>
    </div>
  );
};

export default AnimatedLogo;