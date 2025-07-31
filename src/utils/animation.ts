export const ANIMATION_DELAYS = {
  SPARKLE: 0.2,
  CIRCUIT_LINE: 0.5,
  TIRE_TRACK: 0.1,
  SMOKE: 0.2,
};

export const ANIMATION_DURATIONS = {
  FAST: 300,
  NORMAL: 500,
  SLOW: 800,
};

export const generateRandomPosition = () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
});