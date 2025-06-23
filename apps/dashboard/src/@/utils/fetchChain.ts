import type { ChainMetadata } from "thirdweb/chains";

export async function fetchChain(
  chainIdOrSlug: string | number,
  headers = new Headers(),
): Promise<ChainMetadata | null> {
  // always fetch from prod for chains for now
  // TODO: re-visit this
  const res = await fetch(
    `https://api.thirdweb.com/v1/chains/${chainIdOrSlug}`,
    {
      headers,
    },
  );
  if (res.ok) {
    try {
      return (await res.json()).data as ChainMetadata;
    } catch {
      return null;
    }
  }
  return null;
}
