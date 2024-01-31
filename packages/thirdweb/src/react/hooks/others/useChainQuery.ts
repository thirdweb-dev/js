import { useQuery } from "@tanstack/react-query";
import type { ChainMeta } from "../../types/chain.js";

/**
 *
 * @internal
 */
export function useChainQuery(chainId?: bigint) {
  const chainIdStr = chainId?.toString();
  return useQuery({
    queryKey: ["chain", chainIdStr],
    queryFn: async () => {
      const res = await fetch(
        `https://api.thirdweb.com/v1/chains/${chainIdStr}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const json = await res.json();
      return json.data as ChainMeta;
    },
    enabled: !!chainId,
  });
}

// TODO - add an endpoint to get an array of chains at once

/**
 *
 * @internal
 */
export function useChainsQuery(chainIds: bigint[]) {
  const key = chainIds.join(",");
  return useQuery({
    queryKey: ["chains", key],
    queryFn: async () => {
      return Promise.all(
        chainIds.map(async (chainId) => {
          const res = await fetch(
            `https://api.thirdweb.com/v1/chains/${chainId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          const json = await res.json();
          return json.data as ChainMeta;
        }),
      );
    },
  });
}
