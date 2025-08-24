import React, { useEffect, useState } from "react";
import { useDeviceLayout } from "../../hooks/useOrientation";
import BriefPopup from "./components/BriefPopup";
import LoadingScreen from "./components/LoadingScreen";
import { supabase } from "../../lib/supabase";
import { hackathonData } from "../HackathonData";
import Level2SolutionCard from "./Level2SolutionCard";
import { restoreHL2Progress, saveHL2Progress, markScreenCompleteWithTimer } from "./level2Services";


interface Level2Screen2Props {
  onProceedConfirmed?: () => void;
  timer: number;
}


const Level2Screen2: React.FC<Level2Screen2Props> = ({ onProceedConfirmed, timer }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoredTimer, setRestoredTimer] = useState<number>(timer);
  const [showBrief, setShowBrief] = useState(false);
  const { isMobile, isHorizontal } = useDeviceLayout();
  const isMobileHorizontal = isMobile && isHorizontal;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchProgressAndCase = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user || !user.id) throw new Error("User not authenticated");
        // Restore progress
        const progress = await restoreHL2Progress(user.id);
        console.log('[Level2Screen2] Restored progress:', progress);
        if (progress) {
          setRestoredTimer(progress.timer);
        }
        // Fetch selected case as before
        const { data, error } = await supabase
          .from("selected_cases")
          .select("case_id")
          .eq("email", user.email)
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          setSelectedCaseId(null);
        } else {
          setSelectedCaseId(data.case_id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch selected case");
      } finally {
        timeoutId = setTimeout(() => setLoading(false), 500);
      }
    };
    fetchProgressAndCase();
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, []);


  // Show brief automatically in mobile horizontal mode
  useEffect(() => {
    if (isMobileHorizontal && !showBrief && selectedCaseId != null) {
      setShowBrief(true);
    }
    // Hide brief if not in mobile horizontal
    if (!isMobileHorizontal && showBrief) {
      setShowBrief(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileHorizontal, selectedCaseId]);

// Example: Save progress when proceeding (call this in your navigation logic)
  const handleProceed = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || !user.id) throw new Error("User not authenticated");
      
      // Get existing progress to merge completed screens
      const existingProgress = await restoreHL2Progress(user.id);
      const existingCompletedScreens = existingProgress?.completed_screens || [];
      
      // Merge current screen with existing completed screens
      const completedScreens = [...existingCompletedScreens];
      if (!completedScreens.includes(2)) {
        completedScreens.push(2);
      }
      
      const progressToSave = {
        user_id: user.id,
        current_screen: 3, // Move to next screen
        completed_screens: completedScreens,
        timer: restoredTimer,
      };
      console.log('[Level2Screen2] Saving progress:', progressToSave);
      await saveHL2Progress(progressToSave);
      if (onProceedConfirmed) onProceedConfirmed();
    } catch (err: any) {
      console.error('[Level2Screen2] Error saving progress:', err);
      setError("Failed to save progress: " + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };


  if (loading) return (
    <LoadingScreen
      title="SOLUTION QUEST"
      message="Preparing selected case for solution round..."
      isMobileHorizontal={isMobileHorizontal}
    />
  );
  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (selectedCaseId == null) return <div className="p-6 text-yellow-300">No case selected.</div>;

  // Find the question data for the selected case
  const question = hackathonData.find(q => q.id === selectedCaseId);
  if (!question) return <div className="p-6 text-red-400">Selected case not found.</div>;

  return (
    <>
      {/* Mobile Brief Popup (only in mobile horizontal) */}
      <BriefPopup
        show={showBrief}
        description={question.caseFile}
        isMobileHorizontal={isMobileHorizontal}
        onClose={() => setShowBrief(false)}
      />
      <Level2SolutionCard question={question} onProceedConfirmed={handleProceed} timer={restoredTimer} />
    </>
  );
};

export default Level2Screen2;
