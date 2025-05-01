"use server";

import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { API_SERVER_URL } from "../constants/env";

export async function reSubscribePlan(options: {
  teamId: string;
}): Promise<{ status: number }> {
  const token = await getAuthToken();
  if (!token) {
    return {
      status: 401,
    };
  }

  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${options.teamId}/checkout/resubscribe-plan`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    },
  );

  if (!res.ok) {
    return {
      status: res.status,
    };
  }

  return {
    status: 200,
  };
}
