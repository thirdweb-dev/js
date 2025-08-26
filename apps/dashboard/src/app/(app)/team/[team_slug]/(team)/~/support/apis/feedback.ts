import { z } from "zod";

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
    const serviceKey = process.env.SERVICE_AUTH_KEY_SIWA;
    if (!serviceKey) {
      return { error: "SERVICE_AUTH_KEY_SIWA not configured" };
    }

    const apiUrl = process.env.NEXT_PUBLIC_SIWA_URL;
    if (!apiUrl) {
      return { error: "NEXT_PUBLIC_SIWA_URL not configured" };
    }

    const response = await fetch(`${apiUrl}/v1/csat/saveCSATFeedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-service-api-key": serviceKey,
      },
      body: JSON.stringify({
        rating: input.rating,
        feedback: input.feedback,
        ticket_id: input.ticketId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CSAT feedback submission failed:", {
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
