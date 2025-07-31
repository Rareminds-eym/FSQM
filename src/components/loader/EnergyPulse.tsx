import React from 'react';
import { ANIMATION_DELAYS } from '../../utils/animation';

interface EnergyPulseProps {
  pulseCount?: number;
}

const EnergyPulse: React.FC<EnergyPulseProps> = ({ pulseCount = 3 }) => {
  return (
    <div className="absolute inset-0">
      {[...Array(pulseCount)].map((_, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            animationDelay: `${i * ANIMATION_DELAYS.SPARKLE}s`,
          }}
        >
          {/* Vertical Energy Lines */}
          <div className="absolute inset-y-[20%] left-[20%] w-[2px]
            bg-gradient-to-b from-transparent via-blue-400 to-transparent
            animate-energyLine" 
            style={{ animationDelay: '0s' }}
          />
          <div className="absolute inset-y-[20%] left-[40%] w-[2px]
            bg-gradient-to-b from-transparent via-emerald-400 to-transparent
            animate-energyLine"
            style={{ animationDelay: '0.2s' }}
          />
          <div className="absolute inset-y-[20%] left-[60%] w-[2px]
            bg-gradient-to-b from-transparent via-blue-400 to-transparent
            animate-energyLine"
            style={{ animationDelay: '0.4s' }}
          />
          <div className="absolute inset-y-[20%] left-[80%] w-[2px]
            bg-gradient-to-b from-transparent via-emerald-400 to-transparent
            animate-energyLine"
            style={{ animationDelay: '0.6s' }}
          />
        </div>
      ))}
    </div>
  );
};

export default EnergyPulse;