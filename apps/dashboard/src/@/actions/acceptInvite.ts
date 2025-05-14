"use server";

import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

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
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamId}/invites/${options.inviteId}/accept`,
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
