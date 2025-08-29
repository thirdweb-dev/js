"use server";

type FeedbackSubmitResult = { success: true } | { error: string };
type FeedbackStatusResult = { hasFeedback: boolean } | { error: string };

export async function submitSupportFeedback({
  rating,
  feedback,
  ticketId,
}: {
  rating: number;
  feedback?: string;
  ticketId: string;
}): Promise<FeedbackSubmitResult> {
  try {
    // Fail fast on missing configuration
    const siwaUrl =
      process.env.SIWA_URL ?? process.env.NEXT_PUBLIC_SIWA_URL ?? "";

    if (!siwaUrl) {
      throw new Error("SIWA URL not configured");
    }

    const apiKey = process.env.SERVICE_AUTH_KEY_SIWA;

    if (!apiKey) {
      throw new Error("SERVICE_AUTH_KEY_SIWA not configured");
    }

    // Basic input validation/normalization
    if (!ticketId?.trim()) {
      return { error: "ticketId is required." };
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return { error: "Rating must be an integer between 1 and 5." };
    }

    const normalizedFeedback = (feedback ?? "")
      .toString()
      .trim()
      .slice(0, 1000); // hard cap length

    const payload = {
      rating: rating.toString(),
      feedback: normalizedFeedback,
      ticket_id: ticketId,
    };

    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 10_000);
    const response = await fetch(`${siwaUrl}/v1/csat/saveCSATFeedback`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "x-service-api-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: ac.signal,
    }).finally(() => clearTimeout(t));

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `API Server error: ${response.status} - ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Feedback submission error:", error);
    return { error: "Internal server error" };
  }
}

export async function checkFeedbackStatus(
  ticketId: string,
): Promise<FeedbackStatusResult> {
  try {
    // Basic input validation
    if (!ticketId?.trim()) {
      return { error: "ticketId is required." };
    }

    // Fail fast on missing configuration
    const siwaUrl =
      process.env.SIWA_URL ?? process.env.NEXT_PUBLIC_SIWA_URL ?? "";

    if (!siwaUrl) {
      throw new Error("SIWA URL not configured");
    }

    const apiKey = process.env.SERVICE_AUTH_KEY_SIWA;

    if (!apiKey) {
      throw new Error("SERVICE_AUTH_KEY_SIWA not configured");
    }

    const fullUrl = `${siwaUrl}/v1/csat/getCSATFeedback?ticket_id=${encodeURIComponent(ticketId)}`;

    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 10_000);
    const response = await fetch(fullUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "x-service-api-key": apiKey,
      },
      signal: ac.signal,
    }).finally(() => clearTimeout(t));

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `API Server error: ${response.status} - ${errorText}` };
    }

    const data = await response.json();
    return { hasFeedback: data.has_feedback };
  } catch (error) {
    console.error("Feedback status check error:", error);
    return { error: "Internal server error" };
  }
}
