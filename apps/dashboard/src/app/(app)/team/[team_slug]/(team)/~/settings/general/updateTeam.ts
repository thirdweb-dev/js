"use server";

import type { Team } from "@/api/team";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";

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
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(params.value),
    },
  );

  if (!res.ok) {
    return {
      ok: false as const,
      error: await res.text(),
    };
  }

  const data = (await res.json()) as {
    result: Team;
  };

  return {
    ok: true as const,
    data: data.result,
  };
}
