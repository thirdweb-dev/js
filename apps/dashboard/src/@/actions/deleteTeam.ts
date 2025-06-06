"use server";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

export async function deleteTeam(options: {
  teamId: string;
}): Promise<void> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("You are not authorized to perform this action");
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    throw new Error(await res.text());
  }
}
