import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameSettings } from '../types/settings';

const DEFAULT_SETTINGS: GameSettings = {
  sound: {
    enabled: true,
    volume: 0.7,
    effects: true,
    music: true,
  },
  display: {
    animations: true,
    darkMode: true,
    colorblindMode: false,
  },
  gameplay: {
    difficulty: 'normal',
    hints: true,
    confirmActions: true,
  },
  language: {
    current: 'en',
  },
};

interface SettingsContextType {
  settings: GameSettings;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  updateSoundSettings: (soundSettings: Partial<GameSettings['sound']>) => void;
  updateDisplaySettings: (displaySettings: Partial<GameSettings['display']>) => void;
  updateGameplaySettings: (gameplaySettings: Partial<GameSettings['gameplay']>) => void;
  updateLanguageSettings: (languageSettings: Partial<GameSettings['language']>) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = (newSettings: GameSettings) => {
    localStorage.setItem('gameSettings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    saveSettings(updated);
  };

  const updateSoundSettings = (soundSettings: Partial<GameSettings['sound']>) => {
    const updated = {
      ...settings,
      sound: { ...settings.sound, ...soundSettings },
    };
    saveSettings(updated);
  };

  const updateDisplaySettings = (displaySettings: Partial<GameSettings['display']>) => {
    const updated = {
      ...settings,
      display: { ...settings.display, ...displaySettings },
    };
    saveSettings(updated);
  };

  const updateGameplaySettings = (gameplaySettings: Partial<GameSettings['gameplay']>) => {
    const updated = {
      ...settings,
      gameplay: { ...settings.gameplay, ...gameplaySettings },
    };
    saveSettings(updated);
  };

  const updateLanguageSettings = (languageSettings: Partial<GameSettings['language']>) => {
    const updated = {
      ...settings,
      language: { ...settings.language, ...languageSettings },
    };
    saveSettings(updated);
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      updateSoundSettings,
      updateDisplaySettings,
      updateGameplaySettings,
      updateLanguageSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};