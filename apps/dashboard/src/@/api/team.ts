import "server-only";
import { API_SERVER_URL } from "@/constants/env";
import { getAuthToken } from "../../app/api/lib/getAuthToken";

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
  growthTrialEligible: boolean | null;
  enabledScopes: EnabledTeamScope[];
};

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
