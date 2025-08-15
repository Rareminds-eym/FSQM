import { getEnvironmentConfig, EnvironmentConfig } from "./data";

/**
 * Determine if we're in development or production environment
 * @returns 'development' | 'production'
 */
function getEnvironment(): 'development' | 'production' {
  // Check if we're in development mode
  const isDev = import.meta.env.DEV ||
                import.meta.env.MODE === 'development' ||
                window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1' ||
                window.location.hostname === 'fsqm.netlify.app' ||
                window.location.hostname === 'fsqmdev.rareminds.in';

  // Production environment
  const isProd = window.location.hostname === 'fsqm.rareminds.in';

  // If explicitly production, return production
  if (isProd) {
    return 'production';
  }

  // Otherwise, if development indicators or development domains, return development
  return isDev ? 'development' : 'production';
}

/**
 * Get the environment configuration from local data
 * @returns EnvironmentConfig | null - The environment configuration or null if error
 */
export function getEnvironmentConfigSync(): EnvironmentConfig | null {
  try {
    const environmentId = getEnvironment();
    console.log(`[Environment Config] Getting configuration for environment: ${environmentId}`);

    const config = getEnvironmentConfig(environmentId);

    if (!config) {
      console.error(`[Environment Config] No configuration found for environment: ${environmentId}`);
      return null;
    }

    console.log('[Environment Config] Retrieved configuration:', config);
    return config;
  } catch (err) {
    console.error('[Environment Config] Exception getting configuration:', err);
    return null;
  }
}

/**
 * Check if training levels should be accessible (affects GameProgressContext usage)
 * @returns boolean - Whether training is enabled
 */
export function isTrainingEnabled(): boolean {
  const config = getEnvironmentConfigSync();
  return config?.training ?? false; // Default to false (locked) if error
}

/**
 * Enhanced level unlock check with complete locking logic
 * @param levelId - The level ID to check
 * @returns boolean - Whether the level is unlocked
 */
export function checkLevelUnlockStatus(levelId: number): boolean {
  try {
    const config = getEnvironmentConfigSync();

    // If we can't get config, default to locked for security
    if (!config) {
      console.log(`[Level Unlock] No config available, locking level ${levelId}`);
      return false;
    }

    // Apply locking logic based on requirements:
    if (levelId >= 1 && levelId <= 15) {
      // Training levels (1-15) are controlled ONLY by training column
      // If training is false, lock all training levels including level 1
      const environment = getEnvironment();
      console.log(`[Level Unlock] Training level ${levelId} - environment: ${environment}, training: ${config.training}, unlocked: ${config.training}`);
      return config.training;
    } else if (levelId === 16) {
      // HL1 level (16) - controlled ONLY by hl_1 column (independent of training)
      console.log(`[Level Unlock] HL1 level ${levelId} - hl_1: ${config.hl_1}, unlocked: ${config.hl_1}`);
      return config.hl_1;
    } else if (levelId === 17) {
      // HL2 level (17) - controlled ONLY by hl_2 column (independent of training)
      console.log(`[Level Unlock] HL2 level ${levelId} - hl_2: ${config.hl_2}, unlocked: ${config.hl_2}`);
      return config.hl_2;
    } else {
      // Levels 18+ are not controlled by the system
      console.log(`[Level Unlock] Level ${levelId} is not controlled by environment tables`);
      return true;
    }
  } catch (err) {
    console.error(`[Level Unlock] Exception checking level ${levelId}:`, err);
    return false;
  }
}

/**
 * Get current environment information for debugging
 * @returns Object with environment details
 */
export function getEnvironmentInfo(): {
  environment: 'development' | 'production';
  hostname: string;
  isDev: boolean;
  isProd: boolean;
} {
  const hostname = window.location.hostname;
  const environment = getEnvironment();

  const isDev = import.meta.env.DEV ||
                import.meta.env.MODE === 'development' ||
                hostname === 'localhost' ||
                hostname === '127.0.0.1' ||
                hostname === 'fsqm.netlify.app' ||
                hostname === 'fsqmdev.rareminds.in';

  const isProd = hostname === 'fsqm.rareminds.i';

  return {
    environment,
    hostname,
    isDev,
    isProd
  };
}


