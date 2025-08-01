import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import { useGameProgress } from '../../../context/GameProgressContext';
import { useSound } from '../../../hooks/useSound';

interface ClueItemProps {
  clue: string;
  index: number;
  levelId: number;
  isUnlocked: boolean;
}

const ClueItem: React.FC<ClueItemProps> = ({ 
  clue, 
  index, 
  levelId, 
  isUnlocked 
}) => {
  const { unlockClue } = useGameProgress();
  const { playUnlock } = useSound();

  const handleUnlock = () => {
    if (!isUnlocked) {
      unlockClue(levelId, index);
      playUnlock();
    }
  };

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative group ${
        isUnlocked ? 'text-yellow-900' : 'text-yellow-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleUnlock}
          disabled={isUnlocked}
          className={`p-1.5 rounded-lg transition-all duration-300 ${
            isUnlocked
              ? 'bg-yellow-700/40 text-yellow-900'
              : 'bg-yellow-600/30 text-yellow-800 hover:bg-yellow-700/40 hover:text-yellow-900'
          }`}
        >
          {isUnlocked ? (
            <Unlock className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
        </button>
        <div className="flex-1">
          {isUnlocked ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
            >
              {clue}
            </motion.p>
          ) : (
            <div className="h-4 bg-yellow-600/30 rounded animate-pulse" />
          )}
        </div>
      </div>
    </motion.li>
  );
};

export default ClueItem;