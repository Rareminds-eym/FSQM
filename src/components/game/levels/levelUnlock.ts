import { supabase } from "../../../lib/supabase";

/**
 * Environment configuration interface
 */
interface EnvironmentConfig {
  training: boolean;
  hl_1: boolean;
  hl_2: boolean;
}

/**
 * Cached environment config to avoid repeated database calls
 */
let cachedEnvironmentConfig: EnvironmentConfig | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 1 minute cache

/**
 * Determine if we're in development or production environment
 * @returns 'development' | 'production'
 */
function getEnvironment(): 'development' | 'production' {
  // Check if we're in development mode
  const isDev = import.meta.env.DEV ||
                import.meta.env.MODE === 'development' ||
                window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1';
  return isDev ? 'development' : 'production';
}

/**
 * Get the appropriate table name based on environment
 * @returns 'development' | 'production'
 */
function getEnvironmentTableName(): string {
  return getEnvironment();
}

/**
 * Map level ID to the corresponding column name
 * @param levelId - The level ID to map
 * @returns The column name or null if not a special level
 */
function getLevelColumnName(levelId: number): keyof EnvironmentConfig | null {
  if (levelId >= 1 && levelId <= 15) {
    return 'training';
  } else if (levelId === 16) {
    return 'hl_1';
  } else if (levelId === 17) {
    return 'hl_2';
  }
  return null;
}

/**
 * Fetch the complete environment configuration from the database
 * @returns Promise<EnvironmentConfig | null> - The environment configuration or null if error
 */
export async function fetchEnvironmentConfig(): Promise<EnvironmentConfig | null> {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedEnvironmentConfig && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('[Environment Config] Using cached configuration');
      return cachedEnvironmentConfig;
    }

    const tableName = getEnvironmentTableName();
    console.log(`[Environment Config] Fetching configuration from ${tableName} table`);

    const { data, error } = await supabase
      .from(tableName)
      .select('training, hl_1, hl_2')
      .single();

    if (error) {
      console.error(`[Environment Config] Error fetching from ${tableName} table:`, error);
      return null;
    }

    if (!data) {
      console.log(`[Environment Config] No data found in ${tableName} table`);
      return null;
    }

    const config: EnvironmentConfig = {
      training: !!data.training,
      hl_1: !!data.hl_1,
      hl_2: !!data.hl_2,
    };

    // Update cache
    cachedEnvironmentConfig = config;
    cacheTimestamp = now;

    console.log('[Environment Config] Fetched configuration:', config);
    return config;
  } catch (err) {
    console.error('[Environment Config] Exception fetching configuration:', err);
    return null;
  }
}

/**
 * Check if training levels should be accessible (affects GameProgressContext usage)
 * @returns Promise<boolean> - Whether training is enabled
 */
export async function isTrainingEnabled(): Promise<boolean> {
  const config = await fetchEnvironmentConfig();
  return config?.training ?? false; // Default to false (locked) if error
}

/**
 * Enhanced level unlock check with complete locking logic
 * @param levelId - The level ID to check
 * @returns Promise<boolean> - Whether the level is unlocked
 */
export async function checkLevelUnlockStatus(levelId: number): Promise<boolean> {
  try {
    const config = await fetchEnvironmentConfig();

    // If we can't fetch config, default to locked for security
    if (!config) {
      console.log(`[Level Unlock] No config available, locking level ${levelId}`);
      return false;
    }

    // Apply locking logic based on requirements:
    if (levelId >= 1 && levelId <= 15) {
      // Training levels (1-15) are controlled ONLY by training column
      // If training is false, lock all training levels including level 1
      console.log(`[Level Unlock] Training level ${levelId} - training: ${config.training}, unlocked: ${config.training}`);
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
 * Clear the cached environment configuration (useful for testing or manual refresh)
 */
export function clearEnvironmentConfigCache(): void {
  cachedEnvironmentConfig = null;
  cacheTimestamp = 0;
  console.log('[Environment Config] Cache cleared');
}
