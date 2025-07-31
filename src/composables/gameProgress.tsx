import { supabase } from "../lib/supabase";

const saveGameProgress = async (
  userId: string,
  progress: any,
  level: string
) => {
  try {
    // Check if progress already exists
    const { data: existingProgress, error: fetchError } = await supabase
      .from("player_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("level_id", level)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected for new records
      console.error("Error checking existing progress:", fetchError);
      return;
    }

    const progressData = {
      user_id: userId,
      level_id: level,
      ...progress,
      updated_at: new Date().toISOString(),
    };

    if (existingProgress) {
      // Update existing progress
      const { error: updateError } = await supabase
        .from("player_progress")
        .update(progressData)
        .eq("user_id", userId)
        .eq("level_id", level);

      if (updateError) {
        console.error("Error updating game progress:", updateError);
      }
    } else {
      // Insert new progress
      console.log(`Adding new progress for user ${userId}, level ${level}`);
      const { error: insertError } = await supabase
        .from("player_progress")
        .insert(progressData);

      if (insertError) {
        console.error("Error inserting game progress:", insertError);
      }
    }
  } catch (error) {
    console.error("Error saving game progress:", error);
  }
};

const fetchGameProgress = async (userId: string, level: string) => {
  try {
    const { data: progress, error } = await supabase
      .from("player_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("level_id", level)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No data found
        console.log(
          `No progress found for user with ID: ${userId}, level: ${level}`
        );
        return null;
      } else {
        console.error("Error fetching game progress:", error);
        throw error;
      }
    }

    // console.log("Fetched game progress:", progress);
    return progress;
  } catch (error) {
    console.error("Error fetching game progress:", error);
    throw error; // Re-throw the error for higher-level handling
  }
};

const checkGameProgress = async (userId: string) => {
  try {
    console.log("Fetching progress for userId:", userId);

    const { data: progress, error } = await supabase
      .from("player_progress")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching game progress:", error);
      return false;
    }

    if (progress && progress.length > 0) {
      console.log("User progress found:", progress);
      return true; // Progress exists
    } else {
      console.log("No progress found for userId:", userId);
      return false; // No progress
    }
  } catch (error) {
    console.error("Error fetching game progress:", error);
    return false; // Handle errors
  }
};

const deleteLevelRecords = async (userId: string) => {
  try {
    const { error } = await supabase
      .from("player_progress")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting levels:", error);
    } else {
      console.log("All levels deleted successfully.");
    }
  } catch (error) {
    console.error("Error deleting levels:", error);
  }
};

const uploadToLeaderboard = async (
  userId: string,
  username: string,
  totalScore: Number,
  accuracy: Number,
  completedLevels: Number
) => {
  try {
    const leaderboardData = {
      user_id: userId,
      username: username,
      totalScore: totalScore,
      accuracy: accuracy,
      completedLevels: completedLevels,
      updated_at: new Date().toISOString(),
    };

    // Use upsert to create or update
    const { error } = await supabase
      .from("leaderboard")
      .upsert(leaderboardData, { onConflict: "user_id" });

    if (error) {
      console.error("Error adding/updating leaderboard entry:", error);
    } else {
      console.log(`Leaderboard entry added/updated for user: ${userId}`);
    }
  } catch (error) {
    console.error("Error adding/updating leaderboard entry:", error);
  }
};

const fetchUserDetails = async (userId: string) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.log("No such user!");
        return null;
      } else {
        console.error("Error fetching user details:", error);
        return null;
      }
    }

    return user; // Returns the user document data
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

const fetchUserStats = async (userId: string) => {
  try {
    const { data: userProgress, error } = await supabase
      .from("player_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", true);

    if (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }

    let totalScore = 0;
    let totalAccuracy = 0;
    let completedLevels = 0;

    if (userProgress) {
      userProgress.forEach((progress) => {
        totalScore += progress.score || 0;
        totalAccuracy += progress.accuracy || 0;
        completedLevels++;
      });
    }

    console.log(totalScore, totalAccuracy, completedLevels);
    return { totalScore, totalAccuracy, completedLevels };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }
};

const deleteLeaderboardRecord = async (userId: string) => {
  try {
    const { error } = await supabase
      .from("leaderboard")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting leaderboard record:", error);
    } else {
      console.log(
        `Leaderboard record for user ${userId} deleted successfully.`
      );
    }
  } catch (error) {
    console.error("Error deleting leaderboard record:", error);
  }
};

export {
  checkGameProgress, deleteLeaderboardRecord, deleteLevelRecords,
  fetchGameProgress,
  fetchUserDetails,
  fetchUserStats,
  saveGameProgress,
  uploadToLeaderboard
};

