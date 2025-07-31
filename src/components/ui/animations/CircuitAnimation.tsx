import React from 'react';
import { Cpu } from 'lucide-react';
import SparkleEffect from './SparkleEffect';
import ElectricityEffect from './ElectricityEffect';

interface CircuitAnimationProps {
  className?: string;
}

const CircuitAnimation: React.FC<CircuitAnimationProps> = ({ className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      <Cpu className="w-full h-full text-blue-400 transition-all duration-500
        group-hover:text-blue-300" />
      <ElectricityEffect />
      <SparkleEffect />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20
        rounded-full blur-xl animate-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1/2 h-1/2 bg-blue-400/10 rounded-full animate-ping" />
      </div>
    </div>
  );
};

export default CircuitAnimation;