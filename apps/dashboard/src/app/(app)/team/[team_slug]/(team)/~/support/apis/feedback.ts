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
    // Basic input validation first - fail fast on invalid input
    if (!ticketId?.trim()) {
      return { error: "ticketId is required." };
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return { error: "Rating must be an integer between 1 and 5." };
    }

    // Configuration validation after input validation
    const siwaUrl =
      process.env.SIWA_URL ?? process.env.NEXT_PUBLIC_SIWA_URL ?? "";

    if (!siwaUrl) {
      throw new Error("SIWA URL not configured");
    }

    const apiKey = process.env.SERVICE_AUTH_KEY_SIWA;

    if (!apiKey) {
      throw new Error("SERVICE_AUTH_KEY_SIWA not configured");
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
      const error = `API Server error: ${response.status} - ${errorText}`;
      return { error };
    }

    try {
      const data = await response.json();

      // Validate response structure
      if (typeof data !== "object" || data === null) {
        return { error: "Invalid response format from API" };
      }

      if (!data.success) {
        return { error: "API returned unsuccessful response" };
      }

      return { success: true };
    } catch (_jsonError) {
      return { error: "Invalid JSON response from API" };
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") return { error: "Request timeout" };
      if (error instanceof TypeError) return { error: "Network error" };
      return { error: error.message };
    }
    return { error: "Unknown error occurred" };
  }
}

export async function checkFeedbackStatus(
  ticketId: string,
): Promise<FeedbackStatusResult> {
  try {
    // Basic input validation first - fail fast on invalid input
    if (!ticketId?.trim()) {
      return { error: "ticketId is required." };
    }

    // Configuration validation after input validation
    const siwaUrl =
      process.env.SIWA_URL ?? process.env.NEXT_PUBLIC_SIWA_URL ?? "";

    if (!siwaUrl) {
      throw new Error("SIWA URL not configured");
    }

    const apiKey = process.env.SERVICE_AUTH_KEY_SIWA;

    if (!apiKey) {
      throw new Error("SERVICE_AUTH_KEY_SIWA not configured");
    }

    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 10_000);

    const response = await fetch(
      `${siwaUrl}/v1/csat/getCSATFeedback?ticket_id=${encodeURIComponent(
        ticketId.trim(),
      )}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "x-service-api-key": apiKey,
        },
        signal: ac.signal,
      },
    ).finally(() => clearTimeout(t));

    if (!response.ok) {
      const errorText = await response.text();
      const error = `API Server error: ${response.status} - ${errorText}`;
      return { error };
    }

    let data: {
      has_feedback: boolean;
      feedback_data: {
        id: string;
        rating: number | null;
        feedback: string | null;
        ticket_id: string | null;
        created_at: string;
      } | null;
    };

    try {
      data = await response.json();
    } catch (_jsonError) {
      return { error: "Invalid JSON response from API" };
    }

    // Comprehensive validation of the API response structure
    if (
      typeof data.has_feedback !== "boolean" ||
      (data.feedback_data != null &&
        (typeof data.feedback_data !== "object" ||
          typeof data.feedback_data.id !== "string" ||
          (data.feedback_data.rating != null &&
            typeof data.feedback_data.rating !== "number") ||
          (data.feedback_data.feedback != null &&
            typeof data.feedback_data.feedback !== "string") ||
          (data.feedback_data.ticket_id != null &&
            typeof data.feedback_data.ticket_id !== "string") ||
          typeof data.feedback_data.created_at !== "string"))
    ) {
      return { error: "Invalid response format from API" };
    }

    return { hasFeedback: data.has_feedback };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") return { error: "Request timeout" };
      if (error instanceof TypeError) return { error: "Network error" };
      return { error: error.message };
    }
    return { error: "Unknown error occurred" };
  }
}
