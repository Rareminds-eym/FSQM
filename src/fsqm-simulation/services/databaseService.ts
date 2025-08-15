import { supabase } from "../../lib/supabase";
import type { Question } from "../HackathonData";
import type { AttemptDetail, GameAnswer, GameState } from "../types";
import { AuthService } from "./authService";

export class DatabaseService {
  /**
   * Debug function to check database connectivity and data
   */
  static async debugDatabase(email: string, sessionId: string): Promise<void> {
    try {
      console.log("🔧 DEBUG: Checking database connectivity...");

      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from("attempt_details")
        .select("count", { count: 'exact' });

      console.log("🔧 DEBUG: Basic connection test:", { testData, testError });

      // Check for any records with this email
      const { data: emailRecords, error: emailError } = await supabase
        .from("attempt_details")
        .select("*")
        .eq("email", email);

      console.log("🔧 DEBUG: Records for email:", { emailRecords, emailError });

      // Check for any records with this session_id
      const { data: sessionRecords, error: sessionError } = await supabase
        .from("attempt_details")
        .select("*")
        .eq("session_id", sessionId);

      console.log("🔧 DEBUG: Records for session_id:", { sessionRecords, sessionError });

      // Check table structure
      const { data: tableInfo, error: tableError } = await supabase
        .from("attempt_details")
        .select("*")
        .limit(1);

      console.log("🔧 DEBUG: Table structure sample:", { tableInfo, tableError });

    } catch (err) {
      console.error("🔧 DEBUG: Database debug failed:", err);
    }
  }
  /**
   * Saves individual attempt to the database
   */
  static async saveIndividualAttempt(
    email: string,
    sessionId: string,
    moduleNumber: number,
    score: number,
    completionTimeSec: number,
    teamName?: string,
    collegeCode?: string,
    fullName?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("individual_attempts").upsert([
        {
          email: email,
          session_id: sessionId,
          module_number: moduleNumber,
          score,
          completion_time_sec: completionTimeSec,
          team_name: teamName,
          college_code: collegeCode,
          full_name: fullName,
        },
      ], { onConflict: "email,session_id,module_number" });

      if (error) {
        console.error("Supabase upsert error:", error.message, error.details);
        if (error.message.includes("JWT") || error.message.includes("expired")) {
          return { success: false, error: "Session expired while saving. Please log in again." };
        } else {
          return { success: false, error: `Error saving attempt: ${error.message}` };
        }
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected error saving individual attempt:", err);
      return { success: false, error: "Unexpected error occurred while saving." };
    }
  }

  /**
   * Saves team attempt to the database
   */
  static async saveTeamAttempt(sessionId: string, moduleNumber: number): Promise<{ success: boolean; error?: string }> {
    try {
      // Ensure valid session before saving
      const sessionValid = await AuthService.ensureValidSession();
      if (!sessionValid) {
        return { success: false, error: "Invalid session" };
      }

      // Debug: Log query parameters and types
      console.log("[DEBUG] Querying individual_attempts with:", { sessionId, moduleNumber });
      console.log("[DEBUG] Type of sessionId:", typeof sessionId, "Value:", sessionId);
      console.log("[DEBUG] Type of moduleNumber:", typeof moduleNumber, "Value:", moduleNumber);

      // Try a broader query to see all attempts for this session_id
      const { data: allAttempts, error: allError } = await supabase
        .from("individual_attempts")
        .select("*")
        .eq("session_id", sessionId);
      console.log("[DEBUG] All attempts for sessionId:", allAttempts, allError);

      // Fetch all individual attempts for this session and module
      const { data: attempts, error } = await supabase
        .from("individual_attempts")
        .select("score, completion_time_sec, module_number, session_id, email")
        .eq("session_id", sessionId)
        .eq("module_number", moduleNumber);

      console.log("[DEBUG] Query result (sessionId + moduleNumber):", { attempts, error });

      if (error) {
        console.error("Supabase fetch error (individual_attempts):", error.message, error.details);
        if (error.message.includes("JWT") || error.message.includes("expired")) {
          return { success: false, error: "Session expired while loading team data. Please log in again." };
        }
        return { success: false, error: error.message };
      }

      if (!attempts || attempts.length === 0) {
        console.warn("No individual attempts found for team.");
        return { success: false, error: "No individual attempts found for team." };
      }

      // Fetch team_name, college_code, and full_name from teams table using session_id
      let teamName = null;
      let collegeCode = null;
      let fullName = null;

      if (attempts.length > 0) {
        // Use session_id instead of email for better performance (indexed)
        const { data: teamData, error: teamError } = await supabase
          .from("teams")
          .select("team_name, college_code, full_name")
          .eq("session_id", sessionId)
          .limit(1)
          .single();

        if (!teamError && teamData) {
          teamName = teamData.team_name;
          collegeCode = teamData.college_code;
          fullName = teamData.full_name;
        } else {
          console.warn("Could not fetch team data:", teamError);
        }
      }

      // Calculate average score, top scorer, and average time
      const scores = attempts.map(a => a.score || 0);
      const totalScore = scores.reduce((sum, s) => sum + s, 0);
      const avgScore = scores.length > 0 ? totalScore / scores.length : 0;
      const topScore = scores.length > 0 ? Math.max(...scores) : 0;
      const weightedAvgScore = (0.7 * avgScore + 0.3 * topScore).toFixed(2);

      const times = attempts.map(a => a.completion_time_sec || 0);
      const totalTime = times.reduce((sum, t) => sum + t, 0);
      const avgTimeSec = times.length > 0 ? totalTime / times.length : 0;

      console.log("Team attempt calculation:");
      console.log("  attempts:", attempts.length);
      console.log("  scores:", scores);
      console.log("  avgScore:", avgScore, "topScore:", topScore, "weightedAvgScore:", weightedAvgScore);

      const { error: insertError } = await supabase
        .from("team_attempts")
        .upsert([
          {
            session_id: sessionId,
            module_number: moduleNumber,
            weighted_avg_score: weightedAvgScore,
            avg_time_sec: avgTimeSec,
            team_name: teamName,
            college_code: collegeCode,
            full_name: fullName,
          },
        ], { onConflict: 'email,module_number' });

      if (insertError) {
        console.error("Supabase insert error (team_attempts):", insertError.message, insertError.details);
        if (insertError.message.includes("JWT") || insertError.message.includes("expired")) {
          return { success: false, error: "Session expired while saving team data. Please log in again." };
        }
        return { success: false, error: insertError.message };
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected error saving team attempt:", err);
      return { success: false, error: "Unexpected error occurred while saving team attempt." };
    }
  }

  /**
   * Loads saved progress for a user
   */
  static async loadSavedProgress(
    email: string,
    sessionId: string,
    moduleNumber: number
  ): Promise<{
    success: boolean;
    data?: AttemptDetail[];
    error?: string;
  }> {
    try {
      console.log("🔍 DatabaseService.loadSavedProgress called with:", {
        email,
        sessionId,
        moduleNumber
      });

      // Run debug check
      await DatabaseService.debugDatabase(email, sessionId);

      // First, let's check if there are any records at all for this email/session
      const { data: allRecords, error: allError } = await supabase
        .from("attempt_details")
        .select("*")
        .eq("email", email)
        .eq("session_id", sessionId);

      console.log("📊 All records for email/session:", { allRecords, allError });

      // Also check records by email only
      const { data: emailRecords, error: emailError } = await supabase
        .from("attempt_details")
        .select("email, session_id, module_number, question_index, created_at")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(10);

      console.log("📧 All records for email only:", { emailRecords, emailError });

      // Check records by session_id only
      const { data: sessionRecords, error: sessionError } = await supabase
        .from("attempt_details")
        .select("email, session_id, module_number, question_index, created_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(10);

      console.log("🔑 All records for session_id only:", { sessionRecords, sessionError });

      const { data: attemptDetails, error } = await supabase
        .from("attempt_details")
        .select("*")
        .eq("email", email)
        .eq("session_id", sessionId)
        .eq("module_number", moduleNumber)
        .order("question_index", { ascending: true });

      console.log("📥 Query result:", {
        attemptDetails,
        error,
        recordCount: attemptDetails?.length || 0
      });

      if (error) {
        console.error("❌ Error loading saved progress:", error);
        return { success: false, error: error.message };
      }

      console.log("✅ Returning saved progress:", {
        success: true,
        dataLength: attemptDetails?.length || 0
      });

      return { success: true, data: attemptDetails || [] };
    } catch (err) {
      console.error("💥 Unexpected error loading saved progress:", err);
      return { success: false, error: "Unexpected error occurred while loading progress." };
    }
  }

  /**
   * Saves current game position to database
   */
  static async saveCurrentPosition(
    email: string,
    sessionId: string,
    moduleNumber: number,
    questionIndex: number,
    question: Question | null,
    answer: GameAnswer | null,
    timeRemaining: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("💾 DatabaseService.saveCurrentPosition called with:", {
        email,
        sessionId,
        moduleNumber,
        questionIndex,
        hasQuestion: !!question,
        hasAnswer: !!answer,
        timeRemaining
      });

      const sessionValid = await AuthService.ensureValidSession();
      if (!sessionValid) {
        console.log("❌ Session validation failed");
        return { success: false, error: "Invalid session" };
      }

      const recordToSave = {
        email: email,
        session_id: sessionId,
        module_number: moduleNumber,
        question_index: questionIndex,
        question: question || null,
        answer: answer || null,
        time_remaining: timeRemaining,
      };

      console.log("📝 Saving record:", recordToSave);

      const { error } = await supabase.from("attempt_details").upsert(
        [recordToSave],
        { onConflict: "email,session_id,module_number,question_index" }
      );

      if (error) {
        console.error("❌ Error saving current position:", error);
        return { success: false, error: error.message };
      }

      console.log("✅ Successfully saved current position");
      return { success: true };
    } catch (err) {
      console.error("💥 Unexpected error saving current position:", err);
      return { success: false, error: "Unexpected error occurred while saving position." };
    }
  }

  /**
   * Clears saved progress for a fresh start
   */
  static async clearSavedProgress(
    email: string,
    sessionId: string,
    moduleNumber: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("attempt_details")
        .delete()
        .eq("email", email)
        .eq("session_id", sessionId)
        .eq("module_number", moduleNumber);

      if (error) {
        console.error("Error clearing saved progress:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected error clearing saved progress:", err);
      return { success: false, error: "Unexpected error occurred while clearing progress." };
    }
  }

  /**
   * Checks if team can access module 6
   */
  static async checkModule6Access(sessionId: string): Promise<{ success: boolean; canAccess?: boolean; error?: string }> {
    try {
      const { data } = await supabase
        .from("teams")
        .select("can_access_module6")
        .eq("session_id", sessionId)
        .single();

      return { success: true, canAccess: data?.can_access_module6 || false };
    } catch (err) {
      console.error("Error checking module 6 access:", err);
      return { success: false, error: "Error checking module access." };
    }
  }

  /**
   * Checks if team is complete for a module
   */
  static async checkTeamComplete(sessionId: string, moduleNumber: number): Promise<{ success: boolean; isComplete?: boolean; error?: string }> {
    try {
      const { data: isComplete, error } = await supabase.rpc('is_team_complete', {
        p_session_id: sessionId,
        p_module_number: moduleNumber
      });

      if (error) {
        console.error("Error checking team completion:", error);
        return { success: false, error: error.message };
      }

      return { success: true, isComplete: isComplete === true };
    } catch (err) {
      console.error("Unexpected error checking team completion:", err);
      return { success: false, error: "Unexpected error occurred while checking team completion." };
    }
  }
}
