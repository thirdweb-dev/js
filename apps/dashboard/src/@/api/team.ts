import "server-only";
import { API_SERVER_URL, THIRDWEB_API_SECRET } from "@/constants/env";
import type { TeamResponse } from "@thirdweb-dev/service-utils";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";

export type Team = TeamResponse & { stripeCustomerId: string | null };

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

export async function service_getTeamBySlug(slug: string) {
  const teamRes = await fetch(`${API_SERVER_URL}/v1/teams/${slug}`, {
    headers: {
      "x-service-api-key": THIRDWEB_API_SECRET,
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

export async function getDefaultTeam() {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }

  const res = await fetch(`${API_SERVER_URL}/v1/teams/~`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return (await res.json())?.result as Team;
  }
  return null;
}
