import { supabase } from "../lib/supabase";

// Interface for game state that matches the component's gameState
interface GameState {
  answeredQuestions: string[];
  showResolution: boolean;
  selectedResolution: string[];
  completed: boolean;
  timeLeft: number;
  score: number;
  accuracy: number;
}

// Enhanced function to save game progress with proper data mapping
const saveGameProgress = async (
  userId: string,
  gameState: GameState,
  levelId: string,
  timeTaken?: number
) => {
  try {
    // Calculate time taken if not provided (total time - time left)
    const calculatedTimeTaken = timeTaken || (180 - gameState.timeLeft);
    
    // Prepare answers data as JSONB
    const answersData = {
      answeredQuestions: gameState.answeredQuestions,
      selectedResolution: gameState.selectedResolution,
      showResolution: gameState.showResolution
    };

    // Check if progress already exists
    const { data: existingProgress, error: fetchError } = await supabase
      .from("player_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("level_id", levelId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected for new records
      console.error("Error checking existing progress:", fetchError);
      return { success: false, error: fetchError };
    }

    const progressData = {
      user_id: userId,
      level_id: levelId,
      score: Math.round(gameState.score),
      accuracy: Math.round(gameState.accuracy * 100) / 100, // Round to 2 decimal places
      completed: gameState.completed,
      time_taken: calculatedTimeTaken,
      answers: answersData,
      updated_at: new Date().toISOString(),
    };

    if (existingProgress) {
      // Update existing progress
      const { error: updateError } = await supabase
        .from("player_progress")
        .update(progressData)
        .eq("user_id", userId)
        .eq("level_id", levelId);

      if (updateError) {
        console.error("Error updating game progress:", updateError);
        return { success: false, error: updateError };
      }
      
      console.log(`Updated progress for user ${userId}, level ${levelId}`);
    } else {
      // Insert new progress (add created_at for new records)
      const newProgressData = {
        ...progressData,
        created_at: new Date().toISOString(),
      };
      
      console.log(`Adding new progress for user ${userId}, level ${levelId}`);
      const { error: insertError } = await supabase
        .from("player_progress")
        .insert(newProgressData);

      if (insertError) {
        console.error("Error inserting game progress:", insertError);
        return { success: false, error: insertError };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error saving game progress:", error);
    return { success: false, error };
  }
};

// Legacy function for backward compatibility
const saveGameProgressLegacy = async (
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

// Function to convert database progress back to game state format
const convertProgressToGameState = (progress: any): GameState | null => {
  if (!progress) return null;
  
  try {
    const answers = progress.answers || {};
    return {
      answeredQuestions: answers.answeredQuestions || [],
      showResolution: answers.showResolution !== undefined ? answers.showResolution : true,
      selectedResolution: answers.selectedResolution || [],
      completed: progress.completed || false,
      timeLeft: progress.time_taken ? Math.max(0, 180 - progress.time_taken) : 180,
      score: progress.score || 0,
      accuracy: progress.accuracy || 0,
    };
  } catch (error) {
    console.error("Error converting progress to game state:", error);
    return null;
  }
};

// Function to save game completion data
const saveGameCompletion = async (
  userId: string,
  levelId: string,
  finalScore: number,
  finalAccuracy: number,
  timeTaken: number,
  answersData: any
) => {
  try {
    const completionData = {
      user_id: userId,
      level_id: levelId,
      score: Math.round(finalScore),
      accuracy: Math.round(finalAccuracy * 100) / 100,
      completed: true,
      time_taken: timeTaken,
      answers: answersData,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("player_progress")
      .upsert(completionData, { 
        onConflict: "user_id,level_id",
        ignoreDuplicates: false 
      });

    if (error) {
      console.error("Error saving game completion:", error);
      return { success: false, error };
    }

    console.log(`Game completion saved for user ${userId}, level ${levelId}`);
    return { success: true };
  } catch (error) {
    console.error("Error saving game completion:", error);
    return { success: false, error };
  }
};

// Function to get user's best score for a level
const getUserBestScore = async (userId: string, levelId: string) => {
  try {
    const { data: progress, error } = await supabase
      .from("player_progress")
      .select("score, accuracy, completed, time_taken")
      .eq("user_id", userId)
      .eq("level_id", levelId)
      .eq("completed", true)
      .order("score", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // No completed attempts found
      }
      console.error("Error fetching best score:", error);
      return null;
    }

    return progress;
  } catch (error) {
    console.error("Error fetching best score:", error);
    return null;
  }
};

// Function to get all user progress for analytics
const getAllUserProgress = async (userId: string) => {
  try {
    const { data: allProgress, error } = await supabase
      .from("player_progress")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching all user progress:", error);
      return [];
    }

    return allProgress || [];
  } catch (error) {
    console.error("Error fetching all user progress:", error);
    return [];
  }
};

// Function to update leaderboard with current game completion
const updateLeaderboardFromProgress = async (userId: string) => {
  try {
    // Get user stats
    const stats = await fetchUserStats(userId);
    if (!stats) {
      console.log("No stats found for user:", userId);
      return { success: false, error: "No stats found" };
    }

    // Get user details for username
    const userDetails = await fetchUserDetails(userId);
    const username = userDetails?.username || userDetails?.email || `User_${userId.slice(0, 8)}`;

    // Calculate average accuracy
    const avgAccuracy = stats.completedLevels > 0 ? stats.totalAccuracy / stats.completedLevels : 0;

    // Upload to leaderboard
    await uploadToLeaderboard(
      userId,
      username,
      stats.totalScore,
      avgAccuracy,
      stats.completedLevels
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating leaderboard from progress:", error);
    return { success: false, error };
  }
};

export {
  checkGameProgress, 
  deleteLeaderboardRecord, 
  deleteLevelRecords,
  fetchGameProgress,
  fetchUserDetails,
  fetchUserStats,
  saveGameProgress,
  saveGameProgressLegacy,
  uploadToLeaderboard,
  convertProgressToGameState,
  saveGameCompletion,
  getUserBestScore,
  getAllUserProgress,
  updateLeaderboardFromProgress
};

