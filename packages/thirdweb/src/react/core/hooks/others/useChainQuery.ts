import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Chain } from "../../../../chains/types.js";
import { getChainMetadata } from "../../../../chains/utils.js";
import { pLimit } from "../../../../utils/promise/p-limit.js";

function getQueryOptions(chain?: Chain) {
  return {
    queryKey: ["chain", chain],
    enabled: !!chain,
    staleTime: 1000 * 60 * 60, // 1 hour
  } as const;
}

/**
 * @internal
 */
export function useChainQuery(chain?: Chain) {
  return useQuery({
    ...getQueryOptions(chain),
    queryFn: async () => {
      if (!chain) {
        throw new Error("chainId is required");
      }
      return getChainMetadata(chain);
    },
  });
}

/**
 * @param chains - array of `Chains`
 * @param maxConcurrency - maximum number of concurrent requests to make
 * @internal
 */
export function useChainsQuery(chains: Chain[], maxConcurrency: number) {
  const queryList = useMemo(() => {
    const limit = pLimit(maxConcurrency);
    return chains.map((chain) => {
      return {
        ...getQueryOptions(chain),
        queryFn: () => limit(() => getChainMetadata(chain)),
      };
    });
  }, [chains, maxConcurrency]);

  return useQueries({
    queries: queryList,
  });
}
