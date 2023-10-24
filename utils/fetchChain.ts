import type { Chain } from "@thirdweb-dev/chains";
import { THIRDWEB_API_HOST } from "constants/urls";

export async function fetchChain(
  chainIdOrSlug: string | number,
): Promise<Chain | null> {
  const res = await fetch(`${THIRDWEB_API_HOST}/v1/chains/${chainIdOrSlug}`);
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
  const res = await fetch(`${THIRDWEB_API_HOST}/v1/chains`);
  if (res.ok) {
    try {
      return (await res.json()).data as Chain[];
    } catch (err) {
      return [];
    }
  }
  return [];
}
