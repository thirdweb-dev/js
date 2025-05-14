"use server";

import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

export async function sendTeamInvites(options: {
  teamId: string;
  invites: Array<{ email: string; role: "OWNER" | "MEMBER" }>;
}): Promise<
  | {
      ok: true;
      results: Array<"fulfilled" | "rejected">;
    }
  | {
      ok: false;
      errorMessage: string;
    }
> {
  const token = await getAuthToken();

  if (!token) {
    return {
      ok: false,
      errorMessage: "You are not authorized to perform this action",
    };
  }

  const results = await Promise.allSettled(
    options.invites.map((invite) => sendInvite(options.teamId, invite, token)),
  );

  return {
    ok: true,
    results: results.map((x) => x.status),
  };
}

async function sendInvite(
  teamId: string,
  invite: { email: string; role: "OWNER" | "MEMBER" },
  token: string,
) {
  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamId}/invites`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inviteEmail: invite.email,
        inviteRole: invite.role,
      }),
    },
  );

  if (!res.ok) {
    const errorMessage = await res.text();
    return {
      email: invite.email,
      ok: false,
      errorMessage,
    };
  }

  return {
    email: invite.email,
    ok: true,
  };
}
