import React from 'react';
import { Languages } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import SettingsSection from '../ui/SettingsSection';
import Select from '../ui/Select';

const LanguageSettings: React.FC = () => {
  const { settings, updateLanguageSettings } = useSettings();
  const { language } = settings;

  return (
    <SettingsSection title="Language" icon={Languages}>
      <div className="space-y-6">
        <Select
          label="App Language"
          value={language.current}
          onChange={(value) => updateLanguageSettings({ current: value })}
          options={[
            { value: 'en', label: 'English' },
            { value: 'ta', label: 'தமிழ்' },
          ]}
        />
      </div>
    </SettingsSection>
  );
};

export default LanguageSettings;