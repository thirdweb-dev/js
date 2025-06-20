import { NEXT_PUBLIC_NEBULA_URL } from "@/constants/public-envs";
import { fetchWithAuthToken } from "./fetchWithAuthToken";

export async function submitFeedback(params: {
  authToken: string;
  sessionId: string;
  requestId: string;
  rating: "good" | "bad" | "neutral";
}) {
  const res = await fetchWithAuthToken({
    authToken: params.authToken,
    body: {
      feedback_rating:
        params.rating === "good" ? 1 : params.rating === "bad" ? -1 : 0,
      request_id: params.requestId,
      session_id: params.sessionId,
    },
    endpoint: `${NEXT_PUBLIC_NEBULA_URL}/feedback`,
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to submit feedback");
  }
}
