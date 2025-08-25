"use server";

import { getVercelEnv } from "@/utils/vercel";

interface FeedbackData {
  rating: number;
  feedback: string;
  ticketId: string;
  teamId?: string;
}

export async function submitSupportFeedback(
  data: FeedbackData,
): Promise<{ success: true } | { error: string }> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID;
    if (!apiKey) {
      return { error: "NEXT_PUBLIC_DASHBOARD_CLIENT_ID not configured" };
    }

    // Use the main API host, not SIWA
    const apiHost = process.env.NEXT_PUBLIC_THIRDWEB_API_HOST;
    if (!apiHost) {
      return { error: "NEXT_PUBLIC_THIRDWEB_API_HOST not configured" };
    }

    const response = await fetch(`${apiHost}/v1/csat/saveCSATFeedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-service-api-key": apiKey,
      },
      body: JSON.stringify({
        rating: data.rating,
        feedback: data.feedback,
        ticket_id: data.ticketId,
      }),
    });

    if (!response.ok) {
      // Check if we're in a preview environment (Vercel preview deployments)
      const vercelEnv = getVercelEnv();
      const isPreview = vercelEnv === "preview" || vercelEnv === "development";
      if (response.status === 404 && isPreview) {
        // Only in preview/dev, simulate success if the endpoint isn't deployed yet
        console.debug(
          "CSAT endpoint not available; treating as success in preview/dev",
          {
            rating: data.rating,
            ticket_id: data.ticketId,
            vercel_env: vercelEnv,
          },
        );
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { success: true };
      }

      const errorText = await response.text();
      console.error("❌ CSAT endpoint error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return { error: `Failed to submit feedback: ${response.statusText}` };
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
