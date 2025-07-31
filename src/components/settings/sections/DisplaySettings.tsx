import React from 'react';
import { Monitor, Moon, Eye } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import SettingsSection from '../ui/SettingsSection';
import Toggle from '../ui/Toggle';

const DisplaySettings: React.FC = () => {
  const { settings, updateDisplaySettings } = useSettings();
  const { display } = settings;

  return (
    <SettingsSection title="Display" icon={Monitor}>
      <div className="space-y-6">
        <Toggle
          label="Animations"
          icon={Eye}
          checked={display.animations}
          onChange={(checked) => updateDisplaySettings({ animations: checked })}
        />
        
        <Toggle
          label="Dark Mode"
          icon={Moon}
          checked={display.darkMode}
          onChange={(checked) => updateDisplaySettings({ darkMode: checked })}
        />
        
        <Toggle
          label="Colorblind Mode"
          icon={Eye}
          checked={display.colorblindMode}
          onChange={(checked) => updateDisplaySettings({ colorblindMode: checked })}
        />
      </div>
    </SettingsSection>
  );
};

export default DisplaySettings;