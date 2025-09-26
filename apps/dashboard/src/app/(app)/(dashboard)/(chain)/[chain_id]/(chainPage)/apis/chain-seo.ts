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

export const fetchChainSeo = unstable_cache(
  async (chainId: number) => {
    const url = new URL(
      `https://seo-pages-generator-5814.zeet-nftlabs.zeet.app/chain/${chainId}`,
    );
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return undefined;
    }

    return res.json() as Promise<ChainSeo>;
  },
  ["chain-seo"],
  { revalidate: 60 * 60 * 24 }, // 24 hours
);
