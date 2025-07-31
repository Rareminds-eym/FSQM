import React from 'react';
import { Battery } from 'lucide-react';

interface BatteryAnimationProps {
  className?: string;
}

const BatteryAnimation: React.FC<BatteryAnimationProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Battery className="w-full h-full text-emerald-400 transition-colors duration-500" />
      <div className="absolute inset-0 flex items-center">
        <div className="h-1/2 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-sm
          animate-batteryFill opacity-75"
          style={{ width: '70%', marginLeft: '15%' }}
        />
      </div>
    </div>
  );
};

export default BatteryAnimation;