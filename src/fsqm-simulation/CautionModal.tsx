import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CautionModalProps {
  open: boolean;
  onClose: () => void;
  onCancel?: () => void;
}

const CautionModal: React.FC<CautionModalProps> = ({ open, onClose, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="pixel-border-thick bg-yellow-100 w-full max-w-md text-center relative overflow-hidden animate-slideIn p-6">
        <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-10"></div>
        <div className="relative z-10">
          {/* Close (X) button */}
          <button
            onClick={onCancel || onClose}
            className="absolute top-3 right-3 pixel-border bg-yellow-300 hover:bg-yellow-400 text-yellow-900 font-black w-8 h-8 flex items-center justify-center text-lg rounded-full z-20"
            aria-label="Close"
          >
            ×
          </button>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-yellow-400 pixel-border flex items-center justify-center w-12 h-12 mr-2 animate-bounce">
              <AlertTriangle className="text-yellow-900 w-8 h-8 animate-pulse" />
            </div>
            <h2 className="font-black text-yellow-900 pixel-text text-lg">Caution</h2>
          </div>
          <div className="font-bold text-yellow-900 mb-6 text-base">
            The selected answer cannot be reverted.
          </div>
          <button
            onClick={onClose}
            className="pixel-border bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black pixel-text py-2 px-6 rounded transition-all duration-200 shadow-lg"
          >
            Confirm &amp; Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default CautionModal;
