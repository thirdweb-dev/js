import { z } from "zod";
import { getVercelEnv } from "@/utils/vercel";

type SupportFeedbackInput = {
  ticketId: string;
  rating: number;
  feedback?: string;
  teamId?: string;
};

const SupportFeedbackSchema = z.object({
  ticketId: z.string().min(1, "Missing ticketId"),
  rating: z.number().int().min(1).max(5),
  feedback: z.string().trim().max(1000).optional().default(""),
  teamId: z.string().optional(),
});

export async function submitSupportFeedback(
  data: SupportFeedbackInput,
): Promise<{ success: true } | { error: string }> {
  "use server";

  const parsed = SupportFeedbackSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }
  const input = parsed.data;

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

    const vercelEnv = getVercelEnv();
    const isPreview = vercelEnv === "preview" || vercelEnv === "development";

    const response = await fetch(`${apiHost}/v1/csat/saveCSATFeedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-service-api-key": apiKey,
      },
      body: JSON.stringify({
        rating: input.rating,
        feedback: input.feedback,
        ticket_id: input.ticketId,
      }),
    });

    if (!response.ok) {
      if (response.status === 404 && isPreview) {
        // Only in preview/dev, simulate success if the endpoint isn't deployed yet
        console.debug(
          "CSAT endpoint not available; treating as success in preview/dev",
          {
            rating: input.rating,
            ticket_id: input.ticketId,
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
