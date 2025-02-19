import "server-only";
import { API_SERVER_URL } from "@/constants/env";
import type { TeamResponse } from "@thirdweb-dev/service-utils";
import { getAuthToken } from "../../app/api/lib/getAuthToken";

export type Team = TeamResponse;
export async function getTeamBySlug(slug: string) {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const teamRes = await fetch(`${API_SERVER_URL}/v1/teams/${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (teamRes.ok) {
    return (await teamRes.json())?.result as Team;
  }
  return null;
}

export function getTeamById(id: string) {
  return getTeamBySlug(id);
}

export async function getTeams() {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }

  const teamsRes = await fetch(`${API_SERVER_URL}/v1/teams`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (teamsRes.ok) {
    return (await teamsRes.json())?.result as Team[];
  }
  return null;
}

type TeamNebulaWaitList = {
  onWaitlist: boolean;
  createdAt: null | string;
};

export async function getTeamNebulaWaitList(teamSlug: string) {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${teamSlug}/waitlist?scope=nebula`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.ok) {
    return (await res.json()).result as TeamNebulaWaitList;
  }

  return null;
}
