"use server";
import "server-only";

import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

export async function submitProductFeedback(request: {
  feedback: string;
  source: "desktop" | "mobile";
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getAuthToken();
  if (!token) {
    return { error: "You are not logged in", ok: false };
  }

  const res = await fetch(
    new URL("/v1/account/feedback", NEXT_PUBLIC_THIRDWEB_API_HOST),
    {
      body: JSON.stringify(request),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!res.ok) {
    return {
      error:
        res.status === 429
          ? "Too many requests, please try again in a minute"
          : "Failed to submit feedback, please try again later",
      ok: false,
    };
  }

  return { ok: true };
}
