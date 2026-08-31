import "server-only";
import { unstable_cache } from "next/cache";

type ChainSeo = {
  title: string;
  description: string;
  og: {
    title: string;
    description: string;
    site_name: string;
    url: string;
  };
  faqs: Array<{
    title: string;
    description: string;
  }>;
  chain: {
    chainId: number;
    name: string;
    slug: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    testnet: boolean;
    is_deprecated: boolean;
  };
};

async function fetchChainSeoUncached(
  chainId: number,
): Promise<ChainSeo | undefined> {
  const url = new URL(`https://seo-pages.thirdweb.xyz/chain/${chainId}`);

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  // 4xx means this chain simply has no SEO entry -- a stable answer worth caching.
  if (res.status >= 400 && res.status < 500) {
    return undefined;
  }

  // 5xx (or any other non-OK) is transient. Throw so unstable_cache does not
  // persist the failure and starve the page of SEO for a full day.
  if (!res.ok) {
    throw new Error(`chain SEO fetch failed: ${res.status}`);
  }

  return (await res.json()) as ChainSeo;
}

const fetchChainSeoCached = unstable_cache(
  fetchChainSeoUncached,
  ["chain-seo"],
  { revalidate: 60 * 60 * 24 }, // 24 hours
);

export async function fetchChainSeo(
  chainId: number,
): Promise<ChainSeo | undefined> {
  // SEO copy is decorative: a failure must never take the page down. A transient
  // error propagates out of the cache uncached, and we degrade to undefined here.
  try {
    return await fetchChainSeoCached(chainId);
  } catch {
    return undefined;
  }
}
