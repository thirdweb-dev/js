import "server-only";
import { API_SERVER_URL } from "@/constants/env";
import { unstable_cache } from "next/cache";
import { getAuthToken } from "../../app/api/lib/getAuthToken";
import { teamsCacheTag } from "../constants/cacheTags";

type EnabledTeamScope =
  | "pay"
  | "storage"
  | "rpc"
  | "bundler"
  | "insight"
  | "embeddedWallets"
  | "relayer"
  | "chainsaw"
  | "nebula";

export type Team = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  bannedAt?: string;
  image?: string;
  billingPlan: "pro" | "growth" | "free" | "starter";
  billingStatus: "validPayment" | (string & {}) | null;
  billingEmail: string | null;
  growthTrialEligible: false;
  enabledScopes: EnabledTeamScope[];
};

export async function getTeamBySlug(teamSlug: string) {
  const authToken = await getAuthToken();

  if (!authToken) {
    return null;
  }

  const getCachedTeam = unstable_cache(
    getTeamBySlugForAuthToken,
    ["getTeamBySlug"],
    {
      tags: [teamsCacheTag(authToken)],
      revalidate: 3600, // 1 hour
    },
  );

  return getCachedTeam(teamSlug, authToken);
}

async function getTeamBySlugForAuthToken(teamSlug: string, authToken: string) {
  console.log("FETCHING TEAM ------------------------", teamSlug);

  const teamRes = await fetch(`${API_SERVER_URL}/v1/teams/${teamSlug}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (teamRes.ok) {
    return (await teamRes.json())?.result as Team;
  }
  return null;
}

export async function getTeams() {
  const authToken = await getAuthToken();

  if (!authToken) {
    return null;
  }

  const getCachedTeams = unstable_cache(getTeamsForAuthToken, ["getTeams"], {
    tags: [teamsCacheTag(authToken)],
    revalidate: 3600, // 1 hour
  });

  return getCachedTeams(authToken);
}

async function getTeamsForAuthToken(authToken: string) {
  console.log("FETCHING ALL TEAMs ------------------------");

  const teamsRes = await fetch(`${API_SERVER_URL}/v1/teams`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
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
  const authToken = await getAuthToken();

  if (!authToken) {
    return null;
  }

  const getCachedNebulaWaitlist = unstable_cache(
    getTeamNebulaWaitListForAuthToken,
    ["getTeamNebulaWaitList"],
    {
      tags: [teamsCacheTag(authToken)],
      revalidate: 3600, // 1 hour
    },
  );

  return getCachedNebulaWaitlist(teamSlug, authToken);
}

async function getTeamNebulaWaitListForAuthToken(
  teamSlug: string,
  authToken: string,
) {
  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${teamSlug}/waitlist?scope=nebula`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (res.ok) {
    return (await res.json()).result as TeamNebulaWaitList;
  }
  return null;
}
