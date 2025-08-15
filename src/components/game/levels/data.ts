import { Turtle } from "lucide-react";

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  training: boolean;
  hl_1: boolean;
  hl_2: boolean;
}

/**
 * Environment unlock configuration
 * This replaces the database-based level unlock system
 *
 * IMPORTANT: true = LOCKED, false = UNLOCKED
 * - training: true = training levels (1-15) are LOCKED
 * - hl_1: true = HL1 level (16) is LOCKED
 * - hl_2: true = HL2 level (17) is LOCKED
 */
export const environmentUnlockConfig: Record<string, EnvironmentConfig> = {
  production: {
    training: false,  // false = training levels UNLOCKED
    hl_1: true,       // true = HL1 level LOCKED
    hl_2: false,      // false = HL2 level UNLOCKED
  },
  development: {
    training: false,  // false = training levels UNLOCKED (for development)
    hl_1: true,       // true = HL1 level LOCKED
    hl_2: true,      // false = HL2 level UNLOCKED
  }
};


/**
 * Get environment configuration based on environment ID
 * @param environmentId - 'production' or 'development'
 * @returns EnvironmentConfig or null if not found
 */
export function getEnvironmentConfig(environmentId: string): EnvironmentConfig | null {
  return environmentUnlockConfig[environmentId] || null;
}
