import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { Ecosystem } from "../../../../types";

/**
 * Fetches ecosystem data from the server
 */
export async function fetchEcosystem(args: {
  teamIdOrSlug: string;
  slug: string;
  authToken: string;
}): Promise<Ecosystem> {
  const { teamIdOrSlug, slug, authToken } = args;
  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamIdOrSlug}/ecosystem-wallet/${slug}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      next: {
        revalidate: 0,
      },
    },
  );

  if (!res.ok) {
    const data = await res.json();
    console.error(data);
    throw new Error(
      data?.message ?? data?.error?.message ?? "Failed to fetch ecosystem",
    );
  }

  return (await res.json()).result as Ecosystem;
}
