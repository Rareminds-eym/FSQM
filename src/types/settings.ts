export interface GameSettings {
  sound: {
    enabled: boolean;
    volume: number;
    effects: boolean;
    music: boolean;
  };
  display: {
    animations: boolean;
    darkMode: boolean;
    colorblindMode: boolean;
  };
  gameplay: {
    difficulty: 'easy' | 'normal' | 'hard';
    hints: boolean;
    confirmActions: boolean;
  };
  language: {
    current: 'en' | 'ta';
  };
}