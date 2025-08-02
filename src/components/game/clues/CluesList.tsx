import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import { useGameProgress } from '../../../context/GameProgressContext';
import { levelClues } from './data';
import ClueItem from './ClueItem';

interface CluesListProps {
  levelId: number;
}

const CluesList: React.FC<CluesListProps> = ({ levelId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useSettings();
  const { getUnlockedClues } = useGameProgress();
  const clues = levelClues[levelId] || [];
  const unlockedClues = getUnlockedClues(levelId);

  if (!settings.gameplay.hints) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`p-3 rounded-lg transition-all duration-300 ${
          isVisible 
            ? 'bg-yellow-700/60 border border-yellow-800/70 text-yellow-950'
            : 'bg-yellow-600/60 border border-yellow-700/60 text-yellow-900 hover:bg-yellow-700/70 hover:border-yellow-800/80'
        }`}
      >
        <Lightbulb className={`w-5 h-5 ${isVisible ? 'animate-pulse' : ''}`} />
        {unlockedClues.length > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-800 
            rounded-full text-xs text-yellow-100 font-bold
            flex items-center justify-center">
            {unlockedClues.length}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-72 p-4
              bg-gradient-to-b from-yellow-400 to-yellow-500 backdrop-blur-sm border border-yellow-600/60
              rounded-lg z-50 shadow-xl"
          >
            <h3 className="text-yellow-900 font-bold mb-4 flex items-center gap-2">
              Click to Unlock Clues!
            </h3>
            <ul className="space-y-3">
              {clues.map((clue, index) => (
                <ClueItem
                  key={index}
                  clue={clue}
                  index={index}
                  levelId={levelId}
                  isUnlocked={unlockedClues.includes(index)}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CluesList;