import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getAuthToken } from "./auth-token";

export type TeamInvite = {
  id: string;
  teamId: string;
  email: string;
  role: "OWNER" | "MEMBER";
  createdAt: string;
  status: "pending" | "accepted" | "expired";
  expiresAt: string;
};

export async function getTeamInvites(
  teamId: string,
  options: {
    count: number;
    start: number;
  },
) {
  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamId}/invites?skip=${options.start}&take=${options.count}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage);
  }

  const json = (await res.json()) as {
    result: TeamInvite[];
  };

  return json.result;
}
