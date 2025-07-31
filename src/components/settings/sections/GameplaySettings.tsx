import { Gamepad2, Lightbulb } from 'lucide-react';
import React from 'react';
import { useSettings } from '../../../hooks/useSettings';
import SettingsSection from '../ui/SettingsSection';
import Toggle from '../ui/Toggle';

const GameplaySettings: React.FC = () => {
  const { settings, updateGameplaySettings } = useSettings();
  const { gameplay } = settings;

  return (
    <SettingsSection title="Gameplay" icon={Gamepad2}>
      <div className="space-y-6">
        {/* <Select
          label="Difficulty"
          value={gameplay.difficulty}
          onChange={(value) => updateGameplaySettings({ 
            difficulty: value as 'easy' | 'normal' | 'hard' 
          })}
          options={[
            { value: 'easy', label: 'Easy' },
            { value: 'normal', label: 'Normal' },
            { value: 'hard', label: 'Hard' }
          ]}
        /> */}
        
        <Toggle
          label="Show Hints"
          icon={Lightbulb}
          checked={gameplay.hints}
          onChange={(checked) => updateGameplaySettings({ hints: checked })}
        />
        
        {/* <Toggle
          label="Confirm Actions"
          icon={AlertTriangle}
          checked={gameplay.confirmActions}
          onChange={(checked) => updateGameplaySettings({ confirmActions: checked })}
        /> */}
      </div>
    </SettingsSection>
  );
};

export default GameplaySettings;