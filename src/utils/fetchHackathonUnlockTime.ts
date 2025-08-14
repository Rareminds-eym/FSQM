import { supabase } from "../lib/supabase";

/**
 * Fetch unlock times for one or more hackathon levels
 * Returns a map: { [level_id]: Date | "unlocked" }
 * @param levelIds - Single ID or array of IDs
 */
export async function fetchHackathonUnlockTimes(levelIds: number | number[]) {
  const idsArray = Array.isArray(levelIds) ? levelIds : [levelIds];
  console.log("[Hackathon Unlock] Fetching for IDs:", idsArray);

  try {
    const { data, error } = await supabase
      .from("hackathon_unlocks")
      .select("level_id, unlock_time, force_unlock")
      .in("level_id", idsArray.map(Number));

    console.log("[Hackathon Unlock] Raw Supabase result:", { data, error });

    if (error) {
      console.error("[Hackathon Unlock] Error fetching:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn("[Hackathon Unlock] No unlock times found for:", idsArray);
      return null;
    }

    // Return a map: { [level_id]: Date or immediate unlock }
    const unlockMap = {};
    data.forEach(row => {
      if (row.force_unlock) {
        unlockMap[row.level_id] = "unlocked"; // or new Date() if you prefer
      } else {
        unlockMap[row.level_id] = new Date(row.unlock_time);
      }
    });

    return unlockMap;
  } catch (err) {
    console.error("[Hackathon Unlock] Exception:", err);
    return null;
  }
}
