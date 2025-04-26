import { API_SERVER_URL } from "@/constants/env";

export async function getRecommendedMembers(params: {
  teamId: string;
  authToken: string;
}) {
  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${params.teamId}/members/recommended`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.authToken}`,
      },
    },
  );

  if (!res.ok) {
    console.error("Failed to fetch recommended members", await res.text());
    return [];
  }

  const data = (await res.json()) as {
    result: {
      email: string;
      name: string | null;
      image: string | null;
      emailConfirmedAt: string;
    }[];
  };

  return data.result;
}
