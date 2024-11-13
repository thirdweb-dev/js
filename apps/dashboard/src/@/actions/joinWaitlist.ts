"use server";

import { getAuthToken } from "../../app/api/lib/getAuthToken";
import { API_SERVER_URL } from "../constants/env";

export async function joinTeamWaitlist(options: {
  teamSlug: string;
  // currently only 'nebula' is supported
  scope: "nebula";
}) {
  const { teamSlug, scope } = options;
  const token = await getAuthToken();

  if (!token) {
    throw new Error("No Auth token");
  }

  const res = await fetch(`${API_SERVER_URL}/v1/teams/${teamSlug}/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      scope,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to join waitlist");
  }

  return true;
}
