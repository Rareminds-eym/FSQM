import React from 'react';
import { Volume2, Music, Zap } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import SettingsSection from '../ui/SettingsSection';
import Toggle from '../ui/Toggle';
import Slider from '../ui/Slider';
import VolumeControl from '../ui/Volume';

const SoundSettings: React.FC = () => {
  const { settings, updateSoundSettings } = useSettings();
  const { sound } = settings;

  return (
    <SettingsSection title="Sound" icon={Volume2}>
      <div className="space-y-6">
        <Toggle
          label="Sound Effects"
          icon={Zap}
          checked={sound.effects}
          onChange={(checked) => updateSoundSettings({ effects: checked })}
        />
        
        <Toggle
          label="Background Music"
          icon={Music}
          checked={sound.music}
          onChange={(checked) => updateSoundSettings({ music: checked })}
        />

       <div className="flex flex-col justify-center items-center space-x-4">
          <VolumeControl
            label="Volume"
            value={sound.volume}
            onChange={(value) => updateSoundSettings({ volume: value })}
            min={0}
            max={1}
            step={0.1}
          />
          <Slider
            label="Volume"
            value={sound.volume}
            onChange={(value) => updateSoundSettings({ volume: value })}
            min={0}
            max={1}
            step={0.1}
          />
        </div>

      </div>
    </SettingsSection>
  );
};

export default SoundSettings;