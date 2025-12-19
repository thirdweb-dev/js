import { useQuery } from "@tanstack/react-query";
import { chains } from "../../../../../bridge/index.js";
import type { ThirdwebClient } from "../../../../../client/client.js";

export function useBridgeChains(options: chains.Options) {
  return useQuery({
    queryKey: ["bridge-chains", options],
    queryFn: async () => {
      const data = await chains(options);
      const dataCopy = [...data];
      // sort by name, but if name starts with number, put it at the end

      return dataCopy.sort((a, b) => {
        const aStartsWithNumber = a.name[0]?.match(/^\d/);
        const bStartsWithNumber = b.name[0]?.match(/^\d/);

        if (aStartsWithNumber && !bStartsWithNumber) {
          return 1;
        }

        if (!aStartsWithNumber && bStartsWithNumber) {
          return -1;
        }

        return a.name.localeCompare(b.name);
      });
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useBridgeChain({
  chainId,
  client,
}: {
  chainId: number | undefined;
  client: ThirdwebClient;
}) {
  const chainQuery = useBridgeChains({ client });
  return {
    data: chainQuery.data?.find((chain) => chain.chainId === chainId),
    isPending: chainQuery.isPending,
  };
}

/**
 * type=origin: Returns all chains that can be used as origin
 * type=destination: Returns all chains that can be used as destination
 * originChainId=X: Returns destination chains reachable from chain X
 * destinationChainId=X: Returns origin chains that can reach chain X
 */

// for fetching "buy" (destination) chains:
// if a "sell" (origin) chain is selected, set originChainId to fetch all "buy" (destination) chains that support given originChainId
// else - set type="destination"

// for fetching "sell" (origin) chains:
// if a "buy" (destination) chain is selected, set destinationChainId to fetch all "sell" (origin) chains that support given destinationChainId
// else - set type="origin"

export function useBridgeChainsWithFilters(options: {
  client: ThirdwebClient;
  buyChainId: number | undefined;
  sellChainId: number | undefined;
  type: "buy" | "sell";
}) {
  return useBridgeChains({
    client: options.client,
    ...(options.type === "buy"
      ? // type = buy
        options.sellChainId
        ? { originChainId: options.sellChainId }
        : { type: "destination" }
      : // type = sell
        options.buyChainId
        ? { destinationChainId: options.buyChainId }
        : { type: "origin" }),
  });
}
