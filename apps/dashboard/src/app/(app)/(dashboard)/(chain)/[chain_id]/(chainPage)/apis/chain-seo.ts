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
    const url = new URL(`https://seo-pages.thirdweb.xyz/chain/${chainId}`);

    // SEO copy is decorative -- never let a fetch failure take down the page.
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        return undefined;
      }

      return (await res.json()) as ChainSeo;
    } catch {
      return undefined;
    }
  },
  ["chain-seo"],
  { revalidate: 60 * 60 * 24 }, // 24 hours
);
