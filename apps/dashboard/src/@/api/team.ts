import "server-only";
import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { API_SERVER_URL } from "@/constants/env";
import { cookies } from "next/headers";
import { getAuthToken } from "../../app/api/lib/getAuthToken";

export type Team = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  bannedAt?: string;
  image?: string;
  billingPlan: "pro" | "growth" | "free";
  billingStatus: "validPayment" | (string & {}) | null;
  billingEmail: string | null;
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
  const cookiesManager = await cookies();
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const token = activeAccount
    ? cookiesManager.get(COOKIE_PREFIX_TOKEN + activeAccount)?.value
    : null;

  if (!token) {
    return [];
  }

  const teamsRes = await fetch(`${API_SERVER_URL}/v1/teams`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (teamsRes.ok) {
    return (await teamsRes.json())?.result as Team[];
  }
  return [];
}

type TeamNebulWaitList = {
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
    return (await res.json()).result as TeamNebulWaitList;
  }

  return null;
}
