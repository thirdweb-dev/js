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
