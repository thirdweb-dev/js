"use server";

const serviceKey = process.env.SIWA_SERVICE_KEY as string;
const apiUrl = process.env.SIWA_URL;

export const getChatResponse = async (
  userMessage: string,
  sessionId: string | undefined,
) => {
  try {
    const payload = {
      message: userMessage,
      conversationId: sessionId,
      source: "portal",
    };
    const response = await fetch(`${apiUrl}/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-service-api-key": serviceKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Failed to get chat response: ${response.status} - ${error}`,
      );
    }

    const data = (await response.json()) as {
      data: string;
      conversationId: string;
    };
    return data;
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
  feedbackRating: 1 | -1,
) => {
  try {
    const response = await fetch(`${apiUrl}/v1/chat/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-service-api-key": serviceKey,
      },
      body: JSON.stringify({ conversationId, feedbackRating }),
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
