import React from 'react';
import { ANIMATION_DELAYS } from '../../../utils/animation';

interface CircuitLinesProps {
  count?: number;
  className?: string;
}

const CircuitLines: React.FC<CircuitLinesProps> = ({ 
  count = 5,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent
            animate-circuit-line"
          style={{
            top: `${20 + i * 15}%`,
            left: '0',
            width: '100%',
            animationDelay: `${i * ANIMATION_DELAYS.CIRCUIT_LINE}s`,
            transform: `rotate(${i % 2 ? 2 : -2}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default CircuitLines;