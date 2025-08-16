import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTeamRegistrationCheck } from '../../hooks/useTeamRegistrationCheck';
import TeamRegistrationForm from './TeamRegistrationForm';

interface TeamRegistrationGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  showInlineForm?: boolean;
}

/**
 * A guard component that checks if user has completed team registration
 * Can either redirect to a registration page or show inline form
 */
const TeamRegistrationGuard: React.FC<TeamRegistrationGuardProps> = ({
  children,
  redirectTo = '/team-registration',
  showInlineForm = false
}) => {
  const { isLoading, needsRegistration, hasTeam, error } = useTeamRegistrationCheck();

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

  // If user needs registration
  if (needsRegistration) {
    if (showInlineForm) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Complete Your Registration
              </h1>
              <p className="text-gray-600">
                Please complete your team information to continue using the application.
              </p>
            </div>
            <TeamRegistrationForm />
          </div>
        </div>
      );
    } else {
      // Redirect to registration page
      return <Navigate to={redirectTo} replace />;
    }
  }

  // User has completed registration, show children
  return <>{children}</>;
};

export default TeamRegistrationGuard;