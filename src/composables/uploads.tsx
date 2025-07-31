import { scenarios } from '../data/diagnosticScenarios';
import { supabase } from '../lib/supabase';

const uploadLevelData = async () => {
    try {
      for (const scenario of scenarios) {
        // Check if scenario already exists
        const { data: existingScenario, error: fetchError } = await supabase
          .from("scenarios")
          .select("*")
          .eq("id", scenario.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error(`Error checking scenario ${scenario.id}:`, fetchError);
          continue;
        }

        const scenarioData = {
          id: scenario.id,
          title: scenario.title,
          description: scenario.description,
          symptoms: scenario.symptoms,
          clues: scenario.clues,
          questions: scenario.questions,
          resolutionQuestion: scenario.resolutionQuestion
        };

        if (existingScenario) {
          // Document exists, update it
          console.log(`Updating document with ID: ${scenario.id}`);
          const { error: updateError } = await supabase
            .from("scenarios")
            .update(scenarioData)
            .eq("id", scenario.id);

          if (updateError) {
            console.error(`Error updating scenario ${scenario.id}:`, updateError);
          }
        } else {
          // Document does not exist, create a new one
          console.log(`Adding new document with ID: ${scenario.id}`);
          const { error: insertError } = await supabase
            .from("scenarios")
            .insert(scenarioData);

          if (insertError) {
            console.error(`Error inserting scenario ${scenario.id}:`, insertError);
          }
        }
      }
    } catch (e) {
      console.error("Error uploading data: ", e);
    }
  };

export { uploadLevelData };
