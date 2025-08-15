// Export the refactored main component
export { default as GmpSimulationRefactored } from './GmpSimulation';

// Export types
export * from './types';

// Export services
export { AuthService } from './services/authService';
export { DatabaseService } from './services/databaseService';

// Export hooks
export { useAuth } from './hooks/useAuth';
export { useGameState } from './hooks/useGameState';
export { useGameTimer } from './hooks/useGameTimer';

// Export components
export { LoadingScreen } from './components/LoadingScreen';
export { SavedProgressModal } from './components/SavedProgressModal';
export { TeamScoreModal } from './components/TeamScoreModal';

// Keep existing exports for backward compatibility
export { default as GmpSimulation } from './GmpSimulation';
export { QuestionCard } from './QuestionCard';
export { Results } from './Results';
export { Timer } from './Timer';
export { ModuleCompleteModal } from './ModuleCompleteModal';
export { hackathonData } from './HackathonData';
