import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  text: string;
  option?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  text,
  option
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
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-yellow-100/90 backdrop-blur-md 
              rounded-xl shadow-xl p-6 border border-yellow-600/30
              transform transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-yellow-500/20">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-900">Confirmation</h3>
            </div>
            
            <p className="text-yellow-800 mb-6">
              {text}
              <br />
              <span className="text-yellow-700 font-medium mt-2 block">
                {option}
              </span>
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-md text-yellow-800 
                  hover:bg-yellow-200/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-md bg-gradient-to-b from-yellow-400 to-yellow-500
                  hover:from-yellow-500 hover:to-yellow-600 text-yellow-900 font-medium
                   transition-colors"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmationModal;