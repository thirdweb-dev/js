import "server-only";
import type { TeamResponse } from "@thirdweb-dev/service-utils";
import { cookies } from "next/headers";
import { getValidAccount } from "@/api/account/get-account";
import { getAuthToken } from "@/api/auth-token";
import { LAST_USED_TEAM_ID } from "@/constants/cookie";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { API_SERVER_SECRET } from "@/constants/server-envs";
import { getMemberByAccountId } from "./team-members";

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

function getTeamById(id: string) {
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

/** @deprecated */
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

export async function getLastVisitedTeam() {
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

  return null;
}

export async function hasToCompleteTeamOnboarding(
  team: Team,
  pagePath: string,
) {
  // if the team is already onboarded, we don't need to check anything else here
  if (team.isOnboarded) {
    return false;
  }
  const account = await getValidAccount(pagePath);
  const teamMember = await getMemberByAccountId(team.slug, account.id);

  // if the team member is not an owner (or we cannot find them), they cannot complete onboarding anyways
  if (teamMember?.role !== "OWNER") {
    return false;
  }

  // if we get here the team is not onboarded and the team member is an owner, so we need to show the onboarding page
  return true;
}
