import "server-only";
import { API_SERVER_URL } from "@/constants/env";
import { getAuthToken } from "../../app/api/lib/getAuthToken";

const TeamAccountRole = {
  OWNER: "OWNER",
  MEMBER: "MEMBER",
} as const;

export type TeamAccountRole =
  (typeof TeamAccountRole)[keyof typeof TeamAccountRole];

export type TeamMember = {
  account: {
    name: string;
    email: string | null;
  };
} & {
  deletedAt: Date | null;
  accountId: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
  role: TeamAccountRole;
};

export async function getMembers(teamSlug: string) {
  const token = getAuthToken();

  if (!token) {
    return undefined;
  }

  const teamsRes = await fetch(
    `${API_SERVER_URL}/v1/teams/${teamSlug}/members`,
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
