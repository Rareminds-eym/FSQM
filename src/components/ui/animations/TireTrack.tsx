import React from 'react';
import { ANIMATION_DELAYS } from '../../../utils/animation';

const TireTrack: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-0 right-0 w-full h-1">
        {/* Left Tire Track */}
        <div className="absolute bottom-0 right-8 w-32 h-[2px] 
          animate-tireTrack origin-right"
          style={{
            background: 'linear-gradient(to left, rgba(96, 165, 250, 0.3), transparent)',
          }}
        />
        
        {/* Right Tire Track */}
        <div className="absolute bottom-0 right-4 w-32 h-[2px] 
          animate-tireTrack origin-right"
          style={{
            background: 'linear-gradient(to left, rgba(96, 165, 250, 0.3), transparent)',
            animationDelay: `${ANIMATION_DELAYS.TIRE_TRACK}s`,
          }}
        />
      </div>
    </div>
  );
};

export default TireTrack;