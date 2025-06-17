import { fetchChain } from "@/utils/fetchChain";
import { unstable_cache } from "next/cache";
import type { ChainMetadata } from "thirdweb/chains";

export const getChainsForNebula = unstable_cache(
  async (chainNamesOrIds: string[] | string | undefined) => {
    if (!chainNamesOrIds) {
      return [];
    }

    const chains: ChainMetadata[] = [];

    const chainNames =
      typeof chainNamesOrIds === "string" ? [chainNamesOrIds] : chainNamesOrIds;

    const chainResults = await Promise.allSettled(
      chainNames.map((x) => fetchChain(x)),
    );

    for (const chainResult of chainResults) {
      if (chainResult.status === "fulfilled" && chainResult.value) {
        chains.push(chainResult.value);
      }
    }

    return chains;
  },
  ["getChainsForNebula"],
  {
    revalidate: 60 * 60 * 24, // 24 hours
  },
);
