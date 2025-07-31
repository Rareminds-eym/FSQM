import { useCallback } from 'react';
import { useSettings } from './useSettings';
import SoundManager from '../services/sound/SoundManager';

export const useSound = () => {
  const { settings } = useSettings();
  const soundManager = SoundManager.getInstance();

  const playSound = useCallback((soundName: string) => {
    if (settings.sound.effects) {
      soundManager.play(soundName, settings.sound.volume);
    }
  }, [settings.sound.effects, settings.sound.volume]);

  return {
    playClick: () => playSound('click'),
    playSuccess: () => playSound('success'),
    playError: () => playSound('error'),
    playUnlock: () => playSound('unlock'),
    playHint: () => playSound('hint'),
    playComplete: () => playSound('complete'),

  };
};