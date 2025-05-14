import "server-only";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { API_SERVER_SECRET } from "@/constants/server-envs";
import type { TeamResponse } from "@thirdweb-dev/service-utils";
import { cookies } from "next/headers";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { LAST_USED_TEAM_ID } from "../../constants/cookies";

export type Team = TeamResponse & { stripeCustomerId: string | null };

export async function getTeamBySlug(slug: string) {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const teamRes = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${slug}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (teamRes.ok) {
    return (await teamRes.json())?.result as Team;
  }
  return null;
}

export async function service_getTeamBySlug(slug: string) {
  const teamRes = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${slug}`,
    {
      headers: {
        "x-service-api-key": API_SERVER_SECRET,
      },
    },
  );

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

  const teamsRes = await fetch(`${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams`, {
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

  const res = await fetch(`${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/~`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return (await res.json())?.result as Team;
  }
  return null;
}

export async function getLastVisitedTeamOrDefaultTeam() {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }

  const cookiesStore = await cookies();
  const lastVisitedTeamId = cookiesStore.get(LAST_USED_TEAM_ID)?.value;

  if (lastVisitedTeamId) {
    const team = await getTeamById(lastVisitedTeamId);
    if (team) {
      return team;
    }
  }

  return getDefaultTeam();
}
