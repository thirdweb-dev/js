"use server";

import { getAuthToken } from "../../app/api/lib/getAuthToken";
import { API_SERVER_URL } from "../constants/env";

export async function acceptInvite(options: {
  teamId: string;
  inviteId: string;
}) {
  const token = await getAuthToken();

  if (!token) {
    return {
      ok: false,
      errorMessage: "You are not authorized to perform this action",
    };
  }

  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${options.teamId}/invites/${options.inviteId}/accept`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    },
  );

  if (!res.ok) {
    let errorMessage = "Failed to accept invite";
    try {
      const result = (await res.json()) as {
        error: {
          code: string;
          message: string;
          statusCode: number;
        };
      };
      errorMessage = result.error.message;
    } catch {}

    return {
      ok: false,
      errorMessage,
    };
  }

  return {
    ok: true,
  };
}
