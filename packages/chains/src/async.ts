import type { Chain } from "./types";

type FetchChainResponse = {
  data: Chain;
  error: unknown;
};
// cache of chainId -> Chain
const chainCache: Record<number, Chain> = {};
// cache of slug -> chainId
const slugToChainId: Record<string, keyof typeof chainCache> = {};
export async function fetchChain(chainIdOrSlug: number | string) {
  if (typeof chainIdOrSlug === "string" && chainIdOrSlug in slugToChainId) {
    return chainCache[slugToChainId[chainIdOrSlug]];
  } else if (typeof chainIdOrSlug === "number" && chainIdOrSlug in chainCache) {
    return chainCache[chainIdOrSlug];
  }
  const res = await fetch(
    `https://api.thirdweb.com/v1/chains/${chainIdOrSlug}`,
  );
  if (!res.ok) {
    console.debug("[chains] fetchChain() failed", res.status, res.statusText);
    return null;
  }
  try {
    const json = (await res.json()) as FetchChainResponse;
    if (json.error) {
      console.debug("[chains] fetchChain() error", json.error);
      return null;
    }
    const chain = json.data;
    // store the chain in chainCache
    chainCache[chain.chainId] = chain;
    // store the slug<->chainId in slugToChainId
    slugToChainId[chain.slug] = chain.chainId;
    return json.data;
  } catch (err) {
    console.debug("[chains] fetchChain() failed", err);
    return null;
  }
}

type FetchChainsResponse = {
  data: Chain[];
  error: unknown;
};

const fetchChainsCache: Record<string, Chain[]> = {};
export async function fetchChains(options?: {
  limit?: number;
  offset?: number;
}) {
  // cache key is based on limit and offset (options)
  const cacheKey = `l:${options?.limit ?? 0}o:${options?.offset ?? 0}`;
  if (cacheKey in fetchChainsCache) {
    return fetchChainsCache[cacheKey];
  }
  const url = new URL(`https://api.thirdweb.com/v1/chains`);
  if (options?.limit && options.limit >= 1) {
    url.searchParams.append("limit", options.limit.toString());
  }
  if (options?.offset && options.offset >= 1) {
    url.searchParams.append("offset", options.offset.toString());
  }
  const res = await fetch(url);
  if (!res.ok) {
    console.debug("[chains] fetchChain() failed", res.status, res.statusText);
    return null;
  }
  try {
    const json = (await res.json()) as FetchChainsResponse;
    if (json.error) {
      console.debug("[chains] fetchChain() error", json.error);
      return null;
    }
    fetchChainsCache[cacheKey] = json.data;
    return json.data;
  } catch (err) {
    console.debug("[chains] fetchChain() failed", err);
    return null;
  }
}

/**
 *
 * @param chainId - the chainId of the chain to resolve
 * @returns a Promise that resolves to the Chain object
 * @throws if the chainId is not found
 */
export async function getChainByChainIdAsync(chainId: number): Promise<Chain> {
  const chain = await fetchChain(chainId);
  if (!chain) {
    throw new Error(`Chain with chainId "${chainId}" not found`);
  }

  return chain;
}

/**
 *
 * @param slug - the slug of the chain to resolve
 * @returns a Promise that resolves to the Chain object
 * @throws if the slug is not found
 */
export async function getChainBySlugAsync(slug: string): Promise<Chain> {
  const chain = await fetchChain(slug);
  if (!chain) {
    throw new Error(`Chain with slug "${slug}" not found`);
  }
  return chain;
}
