"use server";
import assert from "node:assert";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/env";

export interface NebulaMessageResponse {
  message: string;
  session_id: string;
  request_id: string;
}

export async function sendNebulaMessage(args: {
  sessionId: string;
  message: string;
}) {
  try {
    const { NEXT_PUBLIC_NEBULA_URL } = process.env;
    assert(NEXT_PUBLIC_NEBULA_URL, "NEXT_PUBLIC_NEBULA_URL is not set");
    const { sessionId, message } = args;

    const response = await fetch(`${NEXT_PUBLIC_NEBULA_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DASHBOARD_THIRDWEB_SECRET_KEY}`,
      },
      body: JSON.stringify({
        session_id: sessionId,
        message,
        stream: false,
      }),
    });
    if (!response.ok) {
      throw new Error(
        `Unexpected status ${response.status}: ${await response.text()}`,
      );
    }

    return (await response.json()) as NebulaMessageResponse;
  } catch (error) {
    console.error("Error creating Nebula session:", error);
    throw error;
  }
}
