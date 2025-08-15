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
 */
export const environmentUnlockConfig: Record<string, EnvironmentConfig> = {
  production: {
    training: false,
    hl_1: true,
    hl_2: false,
  },
  development: {
    training: true,
    hl_1: true,
    hl_2: false,
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
