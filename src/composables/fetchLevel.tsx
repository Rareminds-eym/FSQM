import { supabase } from "../lib/supabase";
import { scenarios } from "../data/diagnosticScenarios";

const fetchAllLevels = async () => {
  try {
    const { data: levels, error } = await supabase
      .from("scenarios")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching levels from Supabase:", error);
      console.log("Falling back to local data");
      console.log("Local scenarios count:", scenarios.length);
      return scenarios;
    }

    console.log("Levels fetched successfully from Supabase:", levels);
    return levels || scenarios;
  } catch (error) {
    console.error("Error fetching levels from Supabase:", error);
    console.log("Falling back to local data");
    console.log("Local scenarios count:", scenarios.length);
    return scenarios;
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
      console.error("Error fetching level data from Supabase:", error);
      console.log("Falling back to local data for level:", levelId);
      // Fall back to local data
      const localLevel = scenarios.find(scenario => scenario.id === Number(levelId));
      return localLevel || null;
    }

    if (level) {
      // console.log("Level data:", level);
      return level;
    } else {
      console.log("No such level document in Supabase, checking local data");
      // Fall back to local data
      const localLevel = scenarios.find(scenario => scenario.id === Number(levelId));
      return localLevel || null;
    }
  } catch (error) {
    console.error("Error fetching level data from Supabase:", error);
    console.log("Falling back to local data for level:", levelId);
    // Fall back to local data
    const localLevel = scenarios.find(scenario => scenario.id === Number(levelId));
    return localLevel || null;
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
      console.error("Error fetching level IDs from Supabase:", error);
      console.log("Falling back to local progress tracking");
      // When Supabase is not available, return 0 to allow starting from level 1
      return 0;
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
    console.error("Error fetching level IDs from Supabase:", error);
    console.log("Falling back to local progress tracking");
    // When Supabase is not available, return 0 to allow starting from level 1
    return 0;
  }
};

export { fetchAllLevels, fetchLevelById, fetchTopLevel };
