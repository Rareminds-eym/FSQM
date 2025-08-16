import React from 'react';
import { X } from 'lucide-react';
import SmartTeamRegistrationForm from './SmartTeamRegistrationForm';

interface TeamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  canClose?: boolean;
  onSuccess?: () => void;
}

const TeamRegistrationModal: React.FC<TeamRegistrationModalProps> = ({
  isOpen,
  onClose,
  canClose = true,
  onSuccess
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {canClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        
        <div className="p-6">
          <SmartTeamRegistrationForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
};

export default TeamRegistrationModal;