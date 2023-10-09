import { Chain } from "@thirdweb-dev/chains";
import { FSDataCacheWithTTL, cacheDir } from "../../../utils/filesystem";

import { join } from "path";
import { z } from "zod";

const chainCachePath = join(cacheDir, "/chains.json");

const MAX_CACHE_AGE_MS = 1000 * 60 * 60 * 24; // 1 day

const cache = new FSDataCacheWithTTL<Chain[]>(chainCachePath, MAX_CACHE_AGE_MS);

const getChainsOptionSchema = z.object({
  noCache: z.boolean().default(false),
});

// TODO make this work with account based chains
export async function getChains(
  options: z.input<typeof getChainsOptionSchema>,
): Promise<Chain[]> {
  const { noCache } = getChainsOptionSchema.parse(options);
  if (!noCache) {
    // if we have the chains in memory, return them
    const cachedData = await cache.get();
    if (cachedData) {
      return cachedData;
    }
  }
  // if we don't have the chains in the cache load them from the api
  let chains = await getAllPaginatedChains();
  chains = chains.map((c) => ({ ...c, chainId: parseInt(`${c.chainId}`) }));
  await cache.set(chains);
  return chains;
}

// helper function to get all chains
async function getAllPaginatedChains(
  chains: Chain[] = [],
  pathname = "/v1/chains",
): Promise<Chain[]> {
  const url = new URL("https://api.thirdweb.com");
  url.pathname = pathname;
  const res = await fetch(decodeURIComponent(url.toString()));
  const json = await res.json();

  if (json.error) {
    console.error("Failed to fully load chains from DB", json.error);
    return chains;
  }
  if (json.next) {
    return getAllPaginatedChains([...chains, ...json.data], json.next);
  }
  return [...chains, ...json.data];
}
