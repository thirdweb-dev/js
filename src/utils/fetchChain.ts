import type { Chain } from "@thirdweb-dev/chains";

export async function fetchChain(
  chainIdOrSlug: string | number,
): Promise<Chain | null> {
  // always fetch from prod for chains for now
  // TODO: re-visit this
  const res = await fetch(
    `https://api.thirdweb.com/v1/chains/${chainIdOrSlug}`,
  );
  if (res.ok) {
    try {
      return (await res.json()).data as Chain;
    } catch (err) {
      return null;
    }
  }
  return null;
}

export async function fetchAllChains() {
  // always fetch from prod for chains for now
  // TODO: re-visit this
  const res = await fetch(`https://api.thirdweb.com/v1/chains`);
  if (res.ok) {
    try {
      return (await res.json()).data as Chain[];
    } catch (err) {
      return [];
    }
  }
  return [];
}
