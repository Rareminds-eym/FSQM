export const playSound = (soundName: string, volume: number = 1) => {
  const audio = new Audio(`/sounds/${soundName}.mp3`);
  audio.volume = volume;
  return audio.play().catch(error => {
    console.warn('Audio playback failed:', error);
  });
};

export const SOUND_EFFECTS = {
  CLICK: 'click',
  SUCCESS: 'success',
  ERROR: 'error',
  LEVEL_COMPLETE: 'level-complete',
  HINT: 'hint',
} as const;