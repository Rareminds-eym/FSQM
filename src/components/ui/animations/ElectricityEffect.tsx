import React from 'react';
import { ANIMATION_DELAYS } from '../../../utils/animation';

interface ElectricityEffectProps {
  className?: string;
  count?: number;
}

const ElectricityEffect: React.FC<ElectricityEffectProps> = ({ 
  className = '',
  count = 3
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${50 + (i * 20)}% ${50 + (i * 10)}%, 
              rgba(96, 165, 250, 0.8), 
              rgba(37, 99, 235, 0.4) 20%, 
              transparent 40%)`,
            animation: `pulse ${3 + i}s infinite`,
            animationDelay: `${i * ANIMATION_DELAYS.ELECTRICITY}s`
          }}
        />
      ))}
    </div>
  );
};

export default ElectricityEffect;