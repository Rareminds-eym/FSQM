/**
 * Test utilities for the enhanced level locking system
 * This file provides functions to test the level locking logic
 */

import { checkLevelUnlockStatus, isTrainingEnabled, fetchEnvironmentConfig, clearEnvironmentConfigCache } from "../components/game/levels/levelUnlock";

/**
 * Test all level unlock statuses
 */
export async function testAllLevels(): Promise<void> {
  console.log('🧪 Testing Enhanced Level Locking System');
  console.log('==========================================');

  try {
    // Clear cache to ensure fresh data
    clearEnvironmentConfigCache();

    // Get environment configuration
    const config = await fetchEnvironmentConfig();
    console.log('📊 Environment Configuration:', config);

    // Test training status
    const trainingEnabled = await isTrainingEnabled();
    console.log('🎯 Training Enabled:', trainingEnabled);

    console.log('\n📋 Level Unlock Status:');
    console.log('------------------------');

    // Test levels 1-17
    for (let levelId = 1; levelId <= 17; levelId++) {
      try {
        const isUnlocked = await checkLevelUnlockStatus(levelId);
        const levelType = levelId <= 15 ? 'Training' : levelId === 16 ? 'HL1' : 'HL2';
        console.log(`Level ${levelId.toString().padStart(2)} (${levelType.padEnd(8)}): ${isUnlocked ? '🔓 UNLOCKED' : '🔒 LOCKED'}`);
      } catch (error) {
        console.error(`❌ Error testing level ${levelId}:`, error);
      }
    }

    console.log('\n🔍 Logic Summary:');
    console.log('------------------');
    if (!config) {
      console.log('❌ No configuration found - all levels locked by default');
    } else {
      console.log(`Training (levels 1-15): ${config.training ? '✅ Enabled' : '❌ Disabled'}`);
      console.log(`HL1 (level 16): ${config.hl_1 ? '✅ Enabled' : '❌ Disabled'} (independent of training)`);
      console.log(`HL2 (level 17): ${config.hl_2 ? '✅ Enabled' : '❌ Disabled'} (independent of training)`);

      console.log('\n📋 Level Control:');
      if (!config.training) {
        console.log('🚫 Training levels (1-15) are locked');
      } else {
        console.log('✅ Training levels (1-15) are unlocked');
      }
      console.log(`${config.hl_1 ? '✅' : '❌'} HL1 (level 16) ${config.hl_1 ? 'unlocked' : 'locked'} - independent control`);
      console.log(`${config.hl_2 ? '✅' : '❌'} HL2 (level 17) ${config.hl_2 ? 'unlocked' : 'locked'} - independent control`);
    }

  } catch (error) {
    console.error('❌ Error during testing:', error);
  }

  console.log('\n🏁 Test completed');
}

/**
 * Test specific level
 */
export async function testLevel(levelId: number): Promise<boolean> {
  try {
    console.log(`🧪 Testing Level ${levelId}`);
    const isUnlocked = await checkLevelUnlockStatus(levelId);
    console.log(`Level ${levelId}: ${isUnlocked ? '🔓 UNLOCKED' : '🔒 LOCKED'}`);
    return isUnlocked;
  } catch (error) {
    console.error(`❌ Error testing level ${levelId}:`, error);
    return false;
  }
}

/**
 * Test training status
 */
export async function testTrainingStatus(): Promise<boolean> {
  try {
    console.log('🧪 Testing Training Status');
    const enabled = await isTrainingEnabled();
    console.log(`Training: ${enabled ? '✅ ENABLED' : '❌ DISABLED'}`);
    return enabled;
  } catch (error) {
    console.error('❌ Error testing training status:', error);
    return false;
  }
}

/**
 * Simulate different environment configurations for testing
 */
export function simulateEnvironmentConfig(config: { training: boolean; hl_1: boolean; hl_2: boolean }): void {
  console.log('🎭 Simulating Environment Configuration:', config);
  console.log('Note: This is for testing purposes only. Actual configuration comes from the database.');
  
  // This would require mocking the database response in a real test environment
  // For now, it just logs what the configuration would be
}

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).testLevelLocking = {
    testAllLevels,
    testLevel,
    testTrainingStatus,
    simulateEnvironmentConfig,
  };
  
  console.log('🧪 Level Locking Test Utils loaded. Use window.testLevelLocking to test.');
}
