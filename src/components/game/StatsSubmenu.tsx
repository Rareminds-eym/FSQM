import React from 'react';
import { Target, Award, Star } from 'lucide-react';

interface StatsSubmenuProps {
  isOpen: boolean;
  onClose: () => void;
  accuracy: number;
  completion: number;
  points: number;
}

const StatsSubmenu: React.FC<StatsSubmenuProps> = ({
  isOpen,
  onClose,
  accuracy,
  completion,
  points
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-full left-0 mt-2 w-64 bg-slate-800/90 backdrop-blur-sm
        rounded-lg border border-slate-700 shadow-xl p-4
        animate-in slide-in-from-left-2"
    >
      <div className="space-y-4">
        {/* Accuracy */}
        <div className="flex items-center gap-3">
          <Award className={`w-5 h-5 ${
            accuracy >= 70 ? 'text-emerald-400' : 
            accuracy >= 40 ? 'text-yellow-400' : 
            'text-red-400'
          }`} />
          <div>
            <div className="text-sm text-slate-400">Accuracy</div>
            <div className={`font-medium ${
              accuracy >= 70 ? 'text-emerald-400' : 
              accuracy >= 40 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {accuracy.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Completion */}
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-blue-400" />
          <div>
            <div className="text-sm text-slate-400">Completion</div>
            <div className="text-white font-medium">
              {completion.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Points */}
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-yellow-400" />
          <div>
            <div className="text-sm text-slate-400">Points</div>
            <div className="text-yellow-400 font-medium">
              {points} pts
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500
              transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsSubmenu;