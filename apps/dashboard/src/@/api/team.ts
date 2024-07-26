import "server-only";
import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { cookies } from "next/headers";

const THIRDWEB_API_HOST =
  process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com";

export type Team = {
  name: string;
  slug: string;
  billingPlan: string;
  billingStatus: string;
};

export async function getTeamBySlug(slug: string) {
  const cookiesManager = cookies();
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const token = activeAccount
    ? cookiesManager.get(COOKIE_PREFIX_TOKEN + activeAccount)?.value
    : null;

  if (!token) {
    return null;
  }

  const teamRes = await fetch(`${THIRDWEB_API_HOST}/v1/teams/${slug}`, {
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
  const cookiesManager = cookies();
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const token = activeAccount
    ? cookiesManager.get(COOKIE_PREFIX_TOKEN + activeAccount)?.value
    : null;

  if (!token) {
    return [];
  }

  const teamsRes = await fetch(`${THIRDWEB_API_HOST}/v1/teams`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (teamsRes.ok) {
    return (await teamsRes.json())?.result as Team[];
  }
  return [];
}
