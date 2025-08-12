import "server-only";
import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

const TeamAccountRole = {
  MEMBER: "MEMBER",
  OWNER: "OWNER",
} as const;

export type TeamAccountRole =
  (typeof TeamAccountRole)[keyof typeof TeamAccountRole];

export type TeamMember = {
  account: {
    creatorWalletAddress: string;
    name: string;
    email: string | null;
    image: string | null;
  };
  deletedAt: string | null;
  accountId: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  role: TeamAccountRole;
};

export async function getMembers(teamSlug: string) {
  const token = await getAuthToken();

  if (!token) {
    return undefined;
  }

  const teamsRes = await fetch(
    new URL(`/v1/teams/${teamSlug}/members`, NEXT_PUBLIC_THIRDWEB_API_HOST),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (teamsRes.ok) {
    return (await teamsRes.json())?.result as TeamMember[];
  }

  return undefined;
}

export async function getMemberByAccountId(
  teamSlug: string,
  accountId: string,
) {
  const token = await getAuthToken();

  if (!token) {
    return undefined;
  }

  const res = await fetch(
    new URL(
      `/v1/teams/${teamSlug}/members/${accountId}`,
      NEXT_PUBLIC_THIRDWEB_API_HOST,
    ),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.ok) {
    return (await res.json())?.result as TeamMember;
  }

  return undefined;
}
