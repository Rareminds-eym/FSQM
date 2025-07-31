import { supabase } from "../lib/supabase";

const fetchAllLevels = async () => {
  try {
    const { data: levels, error } = await supabase
      .from("scenarios")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching levels:", error);
      return [];
    }

    console.log("Levels fetched successfully:", levels);
    return levels || [];
  } catch (error) {
    console.error("Error fetching levels:", error);
    return [];
  }
};

const fetchLevelById = async (levelId: any) => {
  try {
    const { data: level, error } = await supabase
      .from("scenarios")
      .select("*")
      .eq("id", levelId)
      .single();

    if (error) {
      console.error("Error fetching level data:", error);
      return null;
    }

    if (level) {
      // console.log("Level data:", level);
      return level;
    } else {
      console.log("No such level document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching level data:", error);
    return null;
  }
};

const fetchTopLevel = async (userId: string) => {
  try {
    // Get all completed levels for the user
    const { data: completedLevels, error } = await supabase
      .from("player_progress")
      .select("level_id")
      .eq("user_id", userId)
      .eq("completed", true);

    if (error) {
      console.error("Error fetching level IDs:", error);
      throw error;
    }

    if (!completedLevels || completedLevels.length === 0) {
      return 0; // No completed levels
    }

    // Extracting the IDs and finding the maximum
    const maxLevelId = Math.max(
      ...completedLevels
        .map((level) => Number(level.level_id))
        .filter((id) => !isNaN(id))
    );

    return maxLevelId;
  } catch (error) {
    console.error("Error fetching level IDs:", error);
    throw error;
  }
};

export { fetchAllLevels, fetchLevelById, fetchTopLevel };
