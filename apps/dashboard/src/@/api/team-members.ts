import "server-only";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";

const TeamAccountRole = {
  OWNER: "OWNER",
  MEMBER: "MEMBER",
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
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamSlug}/members`,
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

export async function getMemberById(teamSlug: string, memberId: string) {
  const token = await getAuthToken();

  if (!token) {
    return undefined;
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamSlug}/members/${memberId}`,
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
