import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

export async function getRecommendedMembers(params: {
  teamId: string;
  authToken: string;
}) {
  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${params.teamId}/members/recommended`,
    {
      headers: {
        Authorization: `Bearer ${params.authToken}`,
        "Content-Type": "application/json",
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
