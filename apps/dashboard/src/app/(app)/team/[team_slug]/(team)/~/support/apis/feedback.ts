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
    // Enhanced logging for production debugging
    console.log("🔍 Debug - Feedback submission attempt:", {
      hasSupabase: !!supabase,
      data: data,
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      },
      timestamp: new Date().toISOString(),
    });

    if (!supabase) {
      const error = "Supabase client not initialized. Please check your environment variables.";
      console.error("❌ Supabase client error:", error);
      throw new Error(error);
    }

    // Test the connection first with more detailed logging
    console.log("🔍 Testing Supabase connection...");
    const { data: testData, error: testError } = await supabase
      .from("support_feedback")
      .select("id")
      .limit(1);

    console.log("🔍 Debug - Supabase connection test:", {
      testData,
      testError,
      hasTestData: !!testData,
      testDataLength: testData?.length || 0,
    });

    if (testError) {
      console.error("❌ Supabase connection test failed:", testError);
      return { error: `Connection test failed: ${testError.message}` };
    }

    // Attempt to insert the feedback
    console.log("🔍 Attempting to insert feedback data:", {
      rating: data.rating,
      feedbackLength: data.feedback?.length || 0,
    });

    const { data: insertData, error } = await supabase.from("support_feedback").insert({
      rating: data.rating,
      feedback: data.feedback,
    });

    console.log("🔍 Debug - Insert result:", {
      insertData,
      error,
      hasInsertData: !!insertData,
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

    console.log("✅ Feedback submitted successfully:", insertData);
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
