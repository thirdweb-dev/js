"use server";
import "server-only";
import { getAuthToken } from "../../app/api/lib/getAuthToken";
import { API_SERVER_URL } from "../constants/env";

export async function sendTeamInvite(options: {
  teamId: string;
  email: string;
  role: "OWNER" | "MEMBER";
}) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("You are not authorized to perform this action");
  }

  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${options.teamId}/invites`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inviteEmail: options.email,
        inviteRole: options.role,
      }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to send invite");
  }

  return true;
}
