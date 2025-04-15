"use server";
import type { ChainMetadata } from "thirdweb/chains";

export async function getChains() {
  const response = await fetch(
    "https://api.thirdweb.com/v1/chains",
    // revalidate every hour
    { next: { revalidate: 60 * 60 } },
  );

  if (!response.ok) {
    const error = await response.text().catch(() => null);
    throw new Error(
      `Failed to fetch chains: ${response.status} - ${response.statusText}: ${error || "unknown error"}`,
    );
  }

  return (await response.json()).data as ChainMetadata[];
}

export async function getChain(chainIdOrSlug: string): Promise<ChainMetadata> {
  const res = await fetch(
    `https://api.thirdweb.com/v1/chains/${chainIdOrSlug}`,
    // revalidate every 15 minutes
    { next: { revalidate: 15 * 60 } },
  );

  const result = await res.json();
  if (!result.data) {
    throw new Error("Failed to fetch chain");
  }

  return result.data as ChainMetadata;
}
