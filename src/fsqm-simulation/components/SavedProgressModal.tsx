import React from "react";
import type { SavedProgressInfo } from "../types";

interface SavedProgressModalProps {
  show: boolean;
  progressInfo: SavedProgressInfo | null;
  onContinue: () => void;
  onStartFresh: () => void;
}

export const SavedProgressModal: React.FC<SavedProgressModalProps> = ({
  show,
  progressInfo,
  onContinue,
  onStartFresh,
}) => {
  if (!show || !progressInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="pixel-border bg-gradient-to-r from-purple-600 to-blue-600 p-6 max-w-md w-full text-center">
        <h2 className="text-xl font-black mb-4 text-purple-100 pixel-text">
          SAVED PROGRESS FOUND
        </h2>
        
        <div className="text-purple-200 mb-6 space-y-2">
          <p className="font-medium">We found your previous session:</p>
          <div className="bg-black bg-opacity-30 p-3 rounded pixel-border text-sm">
            <p>Question: {progressInfo.currentQuestion} of {progressInfo.totalQuestions}</p>
            <p>Answered: {progressInfo.answeredQuestions} questions</p>
            <p>Time Remaining: {Math.floor(progressInfo.timeRemaining / 60)}:{(progressInfo.timeRemaining % 60).toString().padStart(2, '0')}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            className="pixel-border bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-3 px-6 pixel-text transition-all"
            onClick={onContinue}
          >
            CONTINUE GAME
          </button>
          
          <button
            className="pixel-border bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-black py-2 px-6 pixel-text transition-all text-sm"
            onClick={onStartFresh}
          >
            START FRESH
          </button>
        </div>
        
        <p className="text-purple-300 text-xs mt-4 italic">
          Starting fresh will delete your saved progress
        </p>
      </div>
    </div>
  );
};
