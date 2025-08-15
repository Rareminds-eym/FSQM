# FSQM Simulation - Modular Architecture

This directory contains the refactored FSQM simulation game with a clean, modular architecture.

## 📁 Directory Structure

```
src/fsqm-simulation/
├── components/           # UI Components
│   ├── LoadingScreen.tsx
│   ├── SavedProgressModal.tsx
│   └── TeamScoreModal.tsx
├── hooks/               # Custom React Hooks
│   ├── useAuth.ts
│   ├── useGameState.ts
│   └── useGameTimer.ts
├── services/            # Business Logic Services
│   ├── authService.ts
│   └── databaseService.ts
├── types/               # TypeScript Type Definitions
│   └── index.ts
├── GmpSimulationRefactored.tsx  # Main refactored component
├── GmpSimulation.tsx    # Original component (kept for reference)
├── index.ts             # Module exports
└── README.md            # This file
```

## 🏗️ Architecture Overview

### **Separation of Concerns**

The original 2238-line `GmpSimulation.tsx` has been broken down into focused modules:

1. **Types** (`types/index.ts`)
   - All TypeScript interfaces and types
   - Centralized type definitions

2. **Services** (`services/`)
   - `authService.ts`: Authentication and session management
   - `databaseService.ts`: All Supabase database operations

3. **Hooks** (`hooks/`)
   - `useAuth.ts`: Authentication state management
   - `useGameState.ts`: Game state and logic management
   - `useGameTimer.ts`: Timer and auto-save functionality

4. **Components** (`components/`)
   - `LoadingScreen.tsx`: Loading states and error handling
   - `SavedProgressModal.tsx`: Saved progress restoration
   - `TeamScoreModal.tsx`: Team score calculation display

5. **Main Component** (`GmpSimulationRefactored.tsx`)
   - Orchestrates all modules
   - Handles UI rendering and user interactions

## 🔧 Key Improvements

### **1. Maintainability**
- **Single Responsibility**: Each module has one clear purpose
- **Smaller Files**: Easier to understand and modify
- **Clear Dependencies**: Explicit imports show relationships

### **2. Reusability**
- **Custom Hooks**: Can be reused across components
- **Service Classes**: Stateless, testable business logic
- **Modular Components**: Can be used independently

### **3. Testability**
- **Isolated Logic**: Services can be unit tested
- **Mocked Dependencies**: Hooks can be tested with mock services
- **Component Testing**: UI components can be tested in isolation

### **4. Type Safety**
- **Centralized Types**: Consistent interfaces across modules
- **Strong Typing**: Better IDE support and error catching

## 🚀 Usage

### **Using the Refactored Component**

```tsx
import { GmpSimulationRefactored } from './fsqm-simulation';

function App() {
  return (
    <GmpSimulationRefactored 
      mode="violation-root-cause" 
      onProceedToLevel2={() => console.log('Proceed to level 2')}
    />
  );
}
```

### **Using Individual Modules**

```tsx
// Using hooks
import { useAuth, useGameState } from './fsqm-simulation';

function CustomGameComponent() {
  const { teamInfo, teamInfoError } = useAuth();
  const { gameState, startGame } = useGameState('violation-root-cause');
  
  // Your component logic
}

// Using services directly
import { DatabaseService, AuthService } from './fsqm-simulation';

async function saveProgress() {
  const teamInfo = await AuthService.fetchTeamInfo();
  if (teamInfo.success) {
    await DatabaseService.saveCurrentPosition(/* params */);
  }
}
```

## 🔄 Migration Guide

### **From Original to Refactored**

1. **Replace Import**:
   ```tsx
   // Before
   import GmpSimulation from './fsqm-simulation/GmpSimulation';
   
   // After
   import { GmpSimulationRefactored } from './fsqm-simulation';
   ```

2. **Same Props Interface**:
   ```tsx
   // Props remain the same
   <GmpSimulationRefactored 
     mode={mode} 
     onProceedToLevel2={handleProceed} 
   />
   ```

3. **Functionality Preserved**:
   - All original features are maintained
   - Same user experience
   - Same database operations

## 🧪 Testing Strategy

### **Unit Tests**
- **Services**: Test database operations and authentication
- **Hooks**: Test state management and side effects
- **Components**: Test UI rendering and user interactions

### **Integration Tests**
- **Hook + Service**: Test complete workflows
- **Component + Hook**: Test user interactions with state changes

### **Example Test Structure**
```
__tests__/
├── services/
│   ├── authService.test.ts
│   └── databaseService.test.ts
├── hooks/
│   ├── useAuth.test.ts
│   ├── useGameState.test.ts
│   └── useGameTimer.test.ts
├── components/
│   ├── LoadingScreen.test.tsx
│   └── SavedProgressModal.test.tsx
└── integration/
    └── gameFlow.test.tsx
```

## 🔍 Code Quality Benefits

1. **Reduced Complexity**: Each file has a single, clear purpose
2. **Better Error Handling**: Centralized error management in services
3. **Improved Performance**: Better memoization and optimization opportunities
4. **Enhanced Developer Experience**: Better IDE support and debugging

## 📝 Future Enhancements

1. **Add More Hooks**: Extract remaining complex logic
2. **Service Layer Expansion**: Add caching and offline support
3. **Component Library**: Create reusable UI components
4. **State Management**: Consider Redux/Zustand for complex state
5. **Error Boundaries**: Add React error boundaries for better UX

## 🤝 Contributing

When adding new features:

1. **Follow the Module Pattern**: Keep related code together
2. **Update Types**: Add new interfaces to `types/index.ts`
3. **Write Tests**: Add tests for new functionality
4. **Document Changes**: Update this README for significant changes

## 📚 Related Files

- Original component: `GmpSimulation.tsx` (kept for reference)
- Data definitions: `HackathonData.ts`
- Existing components: `QuestionCard.tsx`, `Results.tsx`, `Timer.tsx`
