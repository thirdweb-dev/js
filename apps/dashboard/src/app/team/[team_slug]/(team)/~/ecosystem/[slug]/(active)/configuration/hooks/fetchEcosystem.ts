import { API_SERVER_URL } from "@/constants/env";
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
    `${API_SERVER_URL}/v1/teams/${teamIdOrSlug}/ecosystem-wallet/${slug}`,
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
