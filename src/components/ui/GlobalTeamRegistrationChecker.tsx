import React, { useState, useEffect } from 'react';
import { useAuth } from '../home/AuthContext';
import { getUserTeam } from '../../services/teamsService';
import TeamRegistrationForm from './TeamRegistrationForm';

interface TeamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  canClose?: boolean;
  onSuccess?: () => void;
}

const SimpleTeamRegistrationModal: React.FC<TeamRegistrationModalProps> = ({
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
            <span className="text-2xl">&times;</span>
          </button>
        )}
        
        <div className="p-6">
          <TeamRegistrationForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
};

interface GlobalTeamRegistrationCheckerProps {
  children: React.ReactNode;
}

const GlobalTeamRegistrationChecker: React.FC<GlobalTeamRegistrationCheckerProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkTeamRegistration = async () => {
      if (!isAuthenticated || !user?.id || hasChecked) return;

      setIsChecking(true);
      try {
        const team = await getUserTeam(user.id);
        
        if (!team) {
          console.log('🚨 User not found in team table, showing registration modal');
          setShowRegistrationModal(true);
        } else {
          console.log('✅ User found in team table:', team.team_name);
        }
      } catch (error) {
        console.error('Error checking team registration:', error);
        // On error, show the modal to be safe
        setShowRegistrationModal(true);
      } finally {
        setIsChecking(false);
        setHasChecked(true);
      }
    };

    // Only check once when user is authenticated
    if (isAuthenticated && user?.id && !hasChecked) {
      checkTeamRegistration();
    }
  }, [isAuthenticated, user?.id, hasChecked]);

  const handleRegistrationSuccess = () => {
    setShowRegistrationModal(false);
    console.log('✅ Team registration completed successfully');
  };

  const handleRegistrationClose = () => {
    // Don't allow closing the modal until registration is complete
    // This ensures users must complete registration
    console.log('⚠️ Registration modal close attempted - keeping open until completion');
  };

  return (
    <>
      {children}
      
      {/* Global Team Registration Modal */}
      <SimpleTeamRegistrationModal
        isOpen={showRegistrationModal}
        onClose={handleRegistrationClose}
        onSuccess={handleRegistrationSuccess}
        canClose={false} // Force completion of registration
      />
    </>
  );
};

export default GlobalTeamRegistrationChecker;