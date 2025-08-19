"use server";

import { supabase } from "@/lib/supabase";

interface FeedbackData {
  rating: number;
  feedback: string;
}

export async function submitSupportFeedback(
  data: FeedbackData,
): Promise<{ success: true } | { error: string }> {
  try {
    console.log("🔍 Debug - Feedback submission attempt:", {
      hasSupabase: !!supabase,
      data: data,
    });

    if (!supabase) {
      throw new Error(
        "Supabase client not initialized. Please check your environment variables.",
      );
    }

    // Test the connection first
    const { data: testData, error: testError } = await supabase
      .from("support_feedback")
      .select("id")
      .limit(1);

    console.log("🔍 Debug - Supabase connection test:", {
      testData,
      testError,
    });

    const { error } = await supabase.from("support_feedback").insert({
      rating: data.rating,
      feedback: data.feedback,
    });

    if (error) {
      console.error("Supabase error:", error);
      return { error: `Failed to submit feedback: ${error.message}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Feedback submission error:", error);
    return {
      error: `Failed to submit feedback: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
