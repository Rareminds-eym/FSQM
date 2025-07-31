import React from 'react';
import { ANIMATION_DELAYS, generateRandomPosition } from '../../../utils/animation';

interface SparkleEffectProps {
  className?: string;
  count?: number;
}

const SparkleEffect: React.FC<SparkleEffectProps> = ({ 
  className = '', 
  count = 6 
}) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      {[...Array(count)].map((_, i) => {
        const position = generateRandomPosition();
        return (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300 rounded-full animate-sparkle"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              animationDelay: `${i * ANIMATION_DELAYS.SPARKLE}s`
            }}
          />
        );
      })}
    </div>
  );
};

export default SparkleEffect;