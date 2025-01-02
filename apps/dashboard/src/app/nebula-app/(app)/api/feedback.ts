import { NEXT_PUBLIC_NEBULA_URL } from "@/constants/env";
import { fetchWithAuthToken } from "../../../../utils/fetchWithAuthToken";

export async function submitFeedback(params: {
  authToken: string;
  sessionId: string;
  requestId: string;
  rating: "good" | "bad" | "neutral";
}) {
  const res = await fetchWithAuthToken({
    method: "POST",
    endpoint: `${NEXT_PUBLIC_NEBULA_URL}/feedback`,
    body: {
      session_id: params.sessionId,
      request_id: params.requestId,
      feedback_rating:
        params.rating === "good" ? 1 : params.rating === "bad" ? -1 : 0,
    },
    authToken: params.authToken,
  });

  if (!res.ok) {
    throw new Error("Failed to submit feedback");
  }
}
