import { checkLevelUnlockStatus } from "../data/levels";

/**
 * Fetch unlock status for one or more hackathon levels using the new environment-based system
 * Returns a map: { [level_id]: "unlocked" | "locked" }
 * @param levelIds - Single ID or array of IDs
 */
export async function fetchHackathonUnlockTimes(levelIds: number | number[]) {
  const idsArray = Array.isArray(levelIds) ? levelIds : [levelIds];
  console.log("[Level Unlock] Fetching unlock status for IDs:", idsArray);

  try {
    const unlockMap: { [key: number]: "unlocked" | "locked" } = {};

    // Check each level's unlock status using the new system
    for (const levelId of idsArray) {
      const isUnlocked = await checkLevelUnlockStatus(levelId);
      unlockMap[levelId] = isUnlocked ? "unlocked" : "locked";
    }

    console.log("[Level Unlock] Unlock status map:", unlockMap);
    return unlockMap;
  } catch (err) {
    console.error("[Level Unlock] Exception:", err);
    return null;
  }
}
