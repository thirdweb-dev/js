"use server";

import type { Team } from "@/api/team";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getAuthToken } from "../../../../../../../../@/api/auth-token";

export async function updateTeam(params: {
  teamId: string;
  value: Partial<Team>;
}) {
  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("No auth token");
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${params.teamId}`,
    {
      body: JSON.stringify(params.value),
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
    },
  );

  if (!res.ok) {
    return {
      error: await res.text(),
      ok: false as const,
    };
  }

  const data = (await res.json()) as {
    result: Team;
  };

  return {
    data: data.result,
    ok: true as const,
  };
}
