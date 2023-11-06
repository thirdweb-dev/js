import type { Chain } from "./types";

type FetchChainResponse = {
  data: Chain;
  error: unknown;
};

export async function fetchChain(chainIdOrSlug: number | string) {
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

export async function fetchChains(options?: {
  limit?: number;
  offset?: number;
}) {
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
    return json.data;
  } catch (err) {
    console.debug("[chains] fetchChain() failed", err);
    return null;
  }
}
