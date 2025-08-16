import React from 'react';
import TeamRegistrationForm from '../components/ui/TeamRegistrationForm';

const TeamRegistration: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto">
        <TeamRegistrationForm />
      </div>
    </div>
  );
};

export default TeamRegistration;