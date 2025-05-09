import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { Ecosystem } from "../types";

export async function fetchEcosystem(
  slug: string,
  authToken: string,
  teamIdOrSlug: string,
) {
  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamIdOrSlug}/ecosystem-wallet/${slug}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  if (!res.ok) {
    const data = await res.json();
    console.error(data);
    return null;
  }

  const data = (await res.json()) as { result: Ecosystem };
  return data.result;
}
