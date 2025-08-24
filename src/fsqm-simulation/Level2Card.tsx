
import React, { useState } from 'react';
import Level2Screen1_CaseSelection from './level2/Level2Screen1_CaseSelection';
import Level2Screen2 from './level2/Level2Screen2';
import Level2Screen3 from './level2/Level2Screen3';
import Level2Screen4 from './level2/Level2Screen4';

interface TeamMember {
  name: string;
  email: string;
}

interface Level2CardProps {
  teamName: string;
  teamMembers: TeamMember[];
}




interface Level2CardExtraProps {
  screen: number;
  onAdvanceScreen: () => void;
  timer: number;
}

const Level2Card: React.FC<Level2CardProps & Level2CardExtraProps> = ({ teamName, teamMembers, screen, onAdvanceScreen, timer }) => {
  const [selectedCases, setSelectedCases] = useState<{ [email: string]: number }>({});

  const handleSelectCase = (email: string, caseId: number) => {
    setSelectedCases((prev) => ({ ...prev, [email]: caseId }));
  };

  if (screen === 1) {
    return (
      <Level2Screen1_CaseSelection
        teamName={teamName}
        teamMembers={teamMembers}
        selectedCases={selectedCases}
        onSelectCase={handleSelectCase}
        onContinue={onAdvanceScreen}
      />
    );
  }
  if (screen === 2) return <Level2Screen2 onProceedConfirmed={onAdvanceScreen} timer={timer} />;
  if (screen === 3) return <Level2Screen3 timer={timer} />;
  if (screen === 4) return <Level2Screen4 />;
  return null;
};

export default Level2Card;
