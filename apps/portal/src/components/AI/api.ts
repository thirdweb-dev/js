"use server";

import { headers } from "next/headers";

const secretKey = process.env.THIRDWEB_AI_SECRET_KEY as string;
const apiUrl = process.env.THIRDWEB_AI_URL || "https://api.thirdweb.com/ai";
const clientId = process.env.THIRDWEB_AI_CLIENT_ID as string;

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

async function withinRateLimit() {
  const key = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!key) {
    return true;
  }

  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) {
        hits.delete(k);
      }
    }
  }

  return recent.length <= MAX_PER_WINDOW;
}

export const getChatResponse = async (
  userMessage: string,
  sessionId: string | undefined,
) => {
  try {
    if (!(await withinRateLimit())) {
      return {
        conversationId: sessionId,
        data: "You're sending messages too quickly. Please wait a moment and try again.",
        requestId: undefined,
      };
    }

    const response = await fetch(`${apiUrl}/chat`, {
      body: JSON.stringify({
        context: { session_id: sessionId },
        messages: [{ content: userMessage, role: "user" }],
        stream: false,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-secret-key": secretKey,
      },
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Failed to get chat response: ${response.status} - ${error}`,
      );
    }

    const data = (await response.json()) as {
      message: string;
      session_id: string;
      request_id: string;
    };

    return {
      conversationId: data.session_id,
      data: data.message,
      requestId: data.request_id,
    };
  } catch (error) {
    console.error(
      "Chat API error:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return null;
  }
};

export const sendFeedback = async (
  conversationId: string,
  requestId: string,
  feedbackRating: 1 | -1,
) => {
  try {
    const response = await fetch(`${apiUrl}/feedback`, {
      body: JSON.stringify({
        feedback_rating: feedbackRating,
        request_id: requestId,
        session_id: conversationId,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-secret-key": secretKey,
      },
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send feedback: ${response.status} - ${error}`);
    }
    return true;
  } catch (error) {
    console.error(
      "Feedback API error:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return false;
  }
};
