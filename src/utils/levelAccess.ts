import { Level } from "../types/game";

export interface PlayerPermissions {
  userId: string;
  hasSpecialAccess: boolean;
  allowedRestrictedLevels: string[];
}

/**
 * Check if a player can access a specific level
 * @param level - The level to check access for
 * @param playerPermissions - The player's permissions
 * @returns boolean indicating if the player can access the level
 */
export function canAccessLevel(level: Level, playerPermissions?: PlayerPermissions): boolean {
  // If the level is disabled, no one can access it
  if (!level.isEnabled) {
    return false;
  }

  // If it's a public level, everyone can access it
  if (level.accessType === "public") {
    return true;
  }

  // If it's a restricted level, check player permissions
  if (level.accessType === "restricted" && level.requiresSpecialPermission) {
    if (!playerPermissions) {
      return false;
    }

    // Check if player has special access and the level is in their allowed list
    return playerPermissions.hasSpecialAccess && 
           playerPermissions.allowedRestrictedLevels.includes(level.id.toString());
  }

  return false;
}

/**
 * Filter levels based on player access permissions
 * @param levels - Array of all levels
 * @param playerPermissions - The player's permissions
 * @returns Array of levels the player can access
 */
export function getAccessibleLevels(levels: Level[], playerPermissions?: PlayerPermissions): Level[] {
  return levels.filter(level => canAccessLevel(level, playerPermissions));
}

/**
 * Enable HL-2 level for specific players
 * @param playerIds - Array of player IDs to grant access
 * @returns PlayerPermissions array for the specified players
 */
export function enableHL2ForPlayers(playerIds: string[]): PlayerPermissions[] {
  return playerIds.map(userId => ({
    userId,
    hasSpecialAccess: true,
    allowedRestrictedLevels: ["HL-2"]
  }));
}

/**
 * Check if a level is a special level (HL-1 or HL-2)
 * @param levelId - The level ID to check
 * @returns boolean indicating if it's a special level
 */
export function isSpecialLevel(levelId: string | number): boolean {
  return levelId.toString().startsWith("HL-");
}

/**
 * Get the status of special levels
 * @returns Object with status of HL-1 and HL-2
 */
export function getSpecialLevelsStatus() {
  return {
    "HL-1": {
      enabled: true,
      accessType: "public",
      description: "Available to all players"
    },
    "HL-2": {
      enabled: false,
      accessType: "restricted",
      description: "Available to selected players only"
    }
  };
}
