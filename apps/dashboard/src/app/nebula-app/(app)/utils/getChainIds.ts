import { unstable_cache } from "next/cache";
import type { ChainMetadata } from "thirdweb/chains";
import { fetchChain } from "../../../../utils/fetchChain";

export const getChains = unstable_cache(
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
  ["nebula_getChains"],
  {
    revalidate: 60 * 60 * 24, // 24 hours
  },
);
