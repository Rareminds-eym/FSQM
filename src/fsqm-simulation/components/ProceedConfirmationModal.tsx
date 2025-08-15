import React from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

interface ProceedConfirmationModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  level?: 1 | 2;
}

export const ProceedConfirmationModal: React.FC<ProceedConfirmationModalProps> = ({
  show,
  onConfirm,
  onCancel,
  level = 1,
}) => {
  if (!show) return null;

  const isLevel1 = level === 1;
  const actionText = isLevel1 ? "proceed to the next question" : "complete the mission";
  const warningText = isLevel1 
    ? "Once you proceed, you cannot change your violation and root cause selections for this question."
    : "Once you complete the mission, you cannot change your solution selection for this question.";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="pixel-border bg-gradient-to-r from-orange-600 to-red-600 p-6 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-orange-100 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning icon */}
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-orange-100" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-black mb-4 text-orange-100 pixel-text text-center">
          ⚠️ CONFIRM ACTION
        </h3>

        {/* Warning message */}
        <div className="mb-6">
          <p className="text-orange-200 text-sm mb-3 leading-relaxed text-center">
            {warningText}
          </p>
          <div className="bg-red-700/30 border border-red-500/50 rounded p-3 pixel-border">
            <p className="text-red-200 text-xs font-bold text-center">
              🚫 THE SELECTED ANSWER CANNOT BE REVERTED
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            className="pixel-border bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-3 px-6 pixel-text transition-all flex items-center justify-center gap-2"
            onClick={onConfirm}
          >
            <CheckCircle className="w-5 h-5" />
            {isLevel1 ? "CONFIRM & PROCEED" : "CONFIRM & COMPLETE"}
          </button>
          
          <button
            className="pixel-border bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white font-black py-2 px-4 pixel-text transition-all text-sm"
            onClick={onCancel}
          >
            CANCEL
          </button>
        </div>

        {/* Additional info */}
        <p className="text-orange-300 text-xs mt-4 text-center italic">
          You can review your answer before confirming
        </p>
      </div>
    </div>
  );
};
