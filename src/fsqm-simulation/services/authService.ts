import { supabase } from "../../lib/supabase";
import type { TeamInfo } from "../types";

export class AuthService {
  /**
   * Ensures the current session is valid, refreshing if necessary
   */
  static async ensureValidSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        // Try to refresh the session
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          throw new Error("Session expired. Please log in again.");
        }
      }

      return true;
    } catch (err) {
      console.error("Session validation failed:", err);
      return false;
    }
  }

  /**
   * Fetches team information for the current authenticated user
   */
  static async fetchTeamInfo(): Promise<{
    success: boolean;
    data?: TeamInfo;
    error?: string;
  }> {
    try {
      // First, try to refresh the session if it's expired
      const { error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        console.warn("Session refresh failed:", refreshError.message);
      }

      // Get current user's email from Supabase Auth
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError) {
        console.error("Auth error:", authError);
        if (authError.message.includes("JWT") || authError.message.includes("expired")) {
          return { success: false, error: "Session expired. Please log in again." };
        } else {
          return { success: false, error: "Authentication error. Please log in." };
        }
      }

      if (!session || !session.user || !session.user.email) {
        return { success: false, error: "User session not found. Please log in." };
      }

      const userEmail = session.user.email;

      // Directly fetch team records for this email (more efficient than count + select)
      const { data: teamRecords, error: fetchError } = await supabase
        .from("teams")
        .select("session_id, team_name, college_code, full_name")
        .eq("email", userEmail)
        .limit(5); // Limit to prevent excessive data transfer

      if (fetchError) {
        console.error("Database fetch error:", fetchError);
        if (fetchError.message.includes("JWT") || fetchError.message.includes("expired")) {
          return { success: false, error: "Session expired. Please log in again." };
        } else {
          return { success: false, error: "Database connection error. Please try again later." };
        }
      }

      const actualRecordCount = teamRecords?.length || 0;
      console.log(`Found ${actualRecordCount} team records for email: ${userEmail}`);

      if (actualRecordCount === 0) {
        console.error(`❌ No team records found for email: ${userEmail}`);
        return { success: false, error: "No team registration found for your account. Please complete team registration first." };
      }

      if (actualRecordCount > 1) {
        console.warn(`Multiple team records found for email: ${userEmail}. Using the first one.`);
      }

      // Use the first record (we already have the data from the previous query)
      const firstRecord = teamRecords[0];

      if (!firstRecord || !firstRecord.session_id) {
        return { success: false, error: "Invalid team data found. Please contact support." };
      }

      console.log("Using session_id from record:", firstRecord.session_id);
      return {
        success: true,
        data: {
          session_id: firstRecord.session_id,
          email: userEmail,
          teamName: firstRecord.team_name,
          collegeCode: firstRecord.college_code,
          fullName: firstRecord.full_name,
        },
      };

      // This code block is no longer needed since we handle everything above
    } catch (err) {
      console.error("Unexpected error in fetchTeamInfo:", err);
      if (err instanceof Error) {
        if (err.message.includes("fetch")) {
          return { success: false, error: "Network connection error. Please check your internet connection and try again." };
        } else if (err.message.includes("timeout")) {
          return { success: false, error: "Request timed out. Please try again." };
        } else {
          return { success: false, error: `Unexpected error: ${err.message}. Please try again or contact support.` };
        }
      } else {
        return { success: false, error: "An unexpected error occurred. Please refresh the page and try again." };
      }
    }
  }
}
