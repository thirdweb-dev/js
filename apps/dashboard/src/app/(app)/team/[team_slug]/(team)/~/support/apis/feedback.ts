"use server";

import { supabase } from "@/lib/supabase";

interface FeedbackData {
  rating: number;
  feedback: string;
  ticketId: string;
}

export async function submitSupportFeedback(
  data: FeedbackData,
): Promise<{ success: true } | { error: string }> {
  try {
    if (!supabase) {
      const error =
        "Supabase client not initialized. Please check your environment variables.";
      console.error("❌ Supabase client error:", error);
      throw new Error(error);
    }

    // Insert the feedback
    const { error } = await supabase.from("support_feedback").insert({
      rating: data.rating,
      feedback: data.feedback,
      ticket_id: data.ticketId,
    });

    if (error) {
      console.error("❌ Supabase insert error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return { error: `Failed to submit feedback: ${error.message}` };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Feedback submission error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      error: `Failed to submit feedback: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
