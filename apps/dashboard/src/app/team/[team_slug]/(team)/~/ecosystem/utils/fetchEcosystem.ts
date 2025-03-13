import { API_SERVER_URL } from "@/constants/env";
import type { Ecosystem } from "../types";

export async function fetchEcosystem(
  slug: string,
  authToken: string,
  teamIdOrSlug: string,
) {
  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${teamIdOrSlug}/ecosystem-wallet/${slug}`,
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
