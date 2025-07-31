import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';

interface HintButtonProps {
  hint: string;
  onUse: () => void;
}

const HintButton: React.FC<HintButtonProps> = ({ hint, onUse }) => {
  const [showHint, setShowHint] = useState(false);

  const handleUseHint = () => {
    setShowHint(true);
    onUse();
  };

  return (
    <div className="relative">
      <button
        onClick={handleUseHint}
        disabled={showHint}
        className={`p-3 rounded-full ${
          showHint 
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-yellow-500 hover:bg-yellow-400 text-yellow-900'
        } transition-all duration-300`}
      >
        <Lightbulb className="w-6 h-6" />
      </button>

      {showHint && (
        <div className="absolute top-full right-0 mt-2 w-64 p-4
          bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20
          rounded-lg text-yellow-300 text-sm">
          {hint}
        </div>
      )}
    </div>
  );
};

export default HintButton;