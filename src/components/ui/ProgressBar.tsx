import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 
            transition-all duration-300 rounded-full"
          style={{ 
            width: `${progress}%`,
            backgroundSize: '200% 100%',
            animation: 'gradient 2s linear infinite',
          }}
        />
      </div>
      <div className="absolute -bottom-7 left-0 right-0 text-center text-emerald-300 
        text-sm font-medium tracking-wider">
        Loading... {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;