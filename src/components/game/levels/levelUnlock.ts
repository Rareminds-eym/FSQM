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
 * Note: In the config, true = locked, false = unlocked
 */
export function isTrainingEnabled(): boolean {
  const config = getEnvironmentConfigSync();
  return !(config?.training ?? true); // Invert: true in config means locked, so return false for enabled
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
    // Note: In config, true = locked, false = unlocked, so we need to invert
    if (levelId >= 1 && levelId <= 15) {
      // Training levels (1-15) are controlled ONLY by training column
      // If training is true in config, lock all training levels including level 1
      const environment = getEnvironment();
      const unlocked = !config.training; // Invert: true in config means locked
      console.log(`[Level Unlock] Training level ${levelId} - environment: ${environment}, training config: ${config.training} (locked), unlocked: ${unlocked}`);
      return unlocked;
    } else if (levelId === 16) {
      // HL1 level (16) - controlled ONLY by hl_1 column (independent of training)
      const unlocked = !config.hl_1; // Invert: true in config means locked
      console.log(`[Level Unlock] HL1 level ${levelId} - hl_1 config: ${config.hl_1} (locked), unlocked: ${unlocked}`);
      return unlocked;
    } else if (levelId === 17) {
      // HL2 level (17) - controlled ONLY by hl_2 column (independent of training)
      const unlocked = !config.hl_2; // Invert: true in config means locked
      console.log(`[Level Unlock] HL2 level ${levelId} - hl_2 config: ${config.hl_2} (locked), unlocked: ${unlocked}`);
      return unlocked;
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

  const isProd = hostname === 'fsqm.rareminds.in';

  return {
    environment,
    hostname,
    isDev,
    isProd
  };
}

/**
 * Debug function to log all environment and configuration details
 * Call this from browser console to debug training level locking issues
 */
export function debugEnvironmentConfig(): void {
  console.log('🔍 DEBUGGING ENVIRONMENT CONFIGURATION');
  console.log('=====================================');
  console.log('📝 NOTE: In config, true = LOCKED, false = UNLOCKED');
  console.log('');

  const envInfo = getEnvironmentInfo();
  console.log('🌍 Environment Info:', envInfo);

  console.log('🔧 Environment Variables:');
  console.log('  - import.meta.env.DEV:', import.meta.env.DEV);
  console.log('  - import.meta.env.MODE:', import.meta.env.MODE);
  console.log('  - window.location.hostname:', window.location.hostname);
  console.log('  - window.location.href:', window.location.href);

  const config = getEnvironmentConfigSync();
  console.log('⚙️ Retrieved Configuration (true=locked, false=unlocked):', config);

  if (config) {
    console.log('📊 Configuration Interpretation:');
    console.log(`  - Training levels (1-15): config.training=${config.training} → ${config.training ? 'LOCKED 🔒' : 'UNLOCKED ✅'}`);
    console.log(`  - HL1 level (16): config.hl_1=${config.hl_1} → ${config.hl_1 ? 'LOCKED 🔒' : 'UNLOCKED ✅'}`);
    console.log(`  - HL2 level (17): config.hl_2=${config.hl_2} → ${config.hl_2 ? 'LOCKED 🔒' : 'UNLOCKED ✅'}`);
  }

  const trainingEnabled = isTrainingEnabled();
  console.log('🎯 Training Enabled (after inversion):', trainingEnabled);

  console.log('📋 Level Unlock Status (1-17):');
  for (let i = 1; i <= 17; i++) {
    const unlocked = checkLevelUnlockStatus(i);
    console.log(`  Level ${i}: ${unlocked ? '✅ Unlocked' : '🔒 Locked'}`);
  }

  console.log('=====================================');
}

// Make debug function available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).debugEnvironmentConfig = debugEnvironmentConfig;
}


