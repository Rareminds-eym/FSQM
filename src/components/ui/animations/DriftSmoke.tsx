import React from 'react';
import { ANIMATION_DELAYS } from '../../../utils/animation';

interface DriftSmokeProps {
  particleCount?: number;
}

const DriftSmoke: React.FC<DriftSmokeProps> = ({ particleCount = 6 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(particleCount)].map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 right-0 w-8 h-8 
            animate-smokeRise opacity-0"
          style={{
            background: `radial-gradient(circle at center,
              rgba(203, 213, 225, 0.4) 0%,
              rgba(203, 213, 225, 0.1) 50%,
              transparent 100%)`,
            animationDelay: `${i * ANIMATION_DELAYS.SMOKE}s`,
          }}
        />
      ))}
    </div>
  );
};

export default DriftSmoke;