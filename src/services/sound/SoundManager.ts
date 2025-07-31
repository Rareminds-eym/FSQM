import { useSettings } from '../../hooks/useSettings';

class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private baseVolume = 0.5;

  private constructor() {
    this.preloadSounds();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private preloadSounds() {
    const soundEffects = {
      click: '/sounds/click.mp3',
      success: '/sounds/success.mp3',
      error: '/sounds/error.mp3',
      unlock: '/sounds/unlock.mp3',
      hint: '/sounds/hint.mp3',
      complete: '/sounds/complete.mp3',
    };

    Object.entries(soundEffects).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  play(soundName: string, volume: number = this.baseVolume) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.volume = volume;
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.warn('Sound playback failed:', error);
      });
    }
  }

  setBaseVolume(volume: number) {
    this.baseVolume = volume;
  }
}

export default SoundManager;