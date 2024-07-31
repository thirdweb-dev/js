import type { ChainMetadata } from "thirdweb/chains";

export async function fetchChain(
  chainIdOrSlug: string | number,
): Promise<ChainMetadata | null> {
  // always fetch from prod for chains for now
  // TODO: re-visit this
  const res = await fetch(
    `https://api.thirdweb.com/v1/chains/${chainIdOrSlug}`,
  );
  if (res.ok) {
    try {
      return (await res.json()).data as ChainMetadata;
    } catch (err) {
      return null;
    }
  }
  return null;
}

export async function fetchAllChains() {
  // always fetch from prod for chains for now
  // TODO: re-visit this
  const res = await fetch("https://api.thirdweb.com/v1/chains");
  if (res.ok) {
    try {
      return (await res.json()).data as ChainMetadata[];
    } catch (err) {
      return [];
    }
  }
  return [];
}
