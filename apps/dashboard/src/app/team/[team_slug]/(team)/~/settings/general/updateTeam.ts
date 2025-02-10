"use server";

import type { Team } from "@/api/team";
import { teamsCacheTag } from "@/constants/cacheTags";
import { API_SERVER_URL } from "@/constants/env";
import { revalidateTag } from "next/cache";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";

export async function updateTeam(params: {
  teamId: string;
  value: Partial<Team>;
}) {
  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("No auth token");
  }

  const res = await fetch(`${API_SERVER_URL}/v1/teams/${params.teamId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(params.value),
  });

  if (!res.ok) {
    throw new Error("failed to update team");
  }

  revalidateTag(teamsCacheTag(authToken));
}
