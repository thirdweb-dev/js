"use server";

import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

export async function acceptInvite(options: {
  teamId: string;
  inviteId: string;
}) {
  const token = await getAuthToken();

  if (!token) {
    return {
      errorMessage: "You are not authorized to perform this action",
      ok: false,
    };
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamId}/invites/${options.inviteId}/accept`,
    {
      body: JSON.stringify({}),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
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
      errorMessage,
      ok: false,
    };
  }

  return {
    ok: true,
  };
}
