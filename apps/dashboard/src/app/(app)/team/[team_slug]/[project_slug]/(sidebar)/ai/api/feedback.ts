"use server";

import type { Project } from "@/api/project/projects";
import { NEXT_PUBLIC_THIRDWEB_AI_HOST } from "@/constants/public-envs";
import { fetchWithAuthToken } from "./fetchWithAuthToken";

export async function submitFeedback(params: {
  project: Project;
  sessionId: string;
  requestId: string;
  rating: "good" | "bad" | "neutral";
}) {
  const res = await fetchWithAuthToken({
    body: {
      feedback_rating:
        params.rating === "good" ? 1 : params.rating === "bad" ? -1 : 0,
      request_id: params.requestId,
      session_id: params.sessionId,
    },
    endpoint: `${NEXT_PUBLIC_THIRDWEB_AI_HOST}/feedback`,
    method: "POST",
    project: params.project,
  });

  if (!res.ok) {
    throw new Error("Failed to submit feedback");
  }
}
