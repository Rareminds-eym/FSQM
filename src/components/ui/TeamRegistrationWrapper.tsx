import React, { useState, useEffect } from 'react';
import { useTeamRegistrationCheck } from '../../hooks/useTeamRegistrationCheck';
import TeamRegistrationModal from './TeamRegistrationModal';

interface TeamRegistrationWrapperProps {
  children: React.ReactNode;
  requireTeamRegistration?: boolean;
  showModalOnMissingRegistration?: boolean;
}

const TeamRegistrationWrapper: React.FC<TeamRegistrationWrapperProps> = ({
  children,
  requireTeamRegistration = true,
  showModalOnMissingRegistration = true
}) => {
  const { isLoading, needsRegistration, hasTeam, error } = useTeamRegistrationCheck();
  const [showModal, setShowModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    if (!isLoading && needsRegistration && requireTeamRegistration && showModalOnMissingRegistration && !hasShownModal) {
      setShowModal(true);
      setHasShownModal(true);
    }
  }, [isLoading, needsRegistration, requireTeamRegistration, showModalOnMissingRegistration, hasShownModal]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleRegistrationComplete = () => {
    setShowModal(false);
    // Optionally refresh the page or update state
    window.location.reload();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Checking team registration...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Registration Check Failed
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If team registration is required but user doesn't have a team, show blocking message
  if (requireTeamRegistration && needsRegistration && !showModalOnMissingRegistration) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center max-w-md">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Team Registration Required
          </h3>
          <p className="text-yellow-700 mb-4">
            You need to complete your team registration to access this feature.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <TeamRegistrationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        canClose={!requireTeamRegistration}
      />
    </>
  );
};

export default TeamRegistrationWrapper;