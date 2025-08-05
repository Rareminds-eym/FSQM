import { AnimatePresence, motion } from 'framer-motion';
import { Lock, X } from 'lucide-react';
import React from 'react';

interface GameLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameLockedModal: React.FC<GameLockedModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-red-100/90 backdrop-blur-md 
              rounded-xl shadow-xl p-6 border border-red-600/30
              transform transition-all duration-200 mx-4"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-red-500/20 animate-pulse">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-900">Game Locked</h3>
              <button
                onClick={onClose}
                className="ml-auto p-1 rounded-full hover:bg-red-200/50 transition-colors"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
            
            <p className="text-red-800 mb-6">
              The game is currently locked and unavailable. Please check back later or contact an administrator.
            </p>
            
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-md bg-gradient-to-b from-red-400 to-red-500
                  hover:from-red-500 hover:to-red-600 text-white font-medium
                  transition-colors"
              >
                OK
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default GameLockedModal;