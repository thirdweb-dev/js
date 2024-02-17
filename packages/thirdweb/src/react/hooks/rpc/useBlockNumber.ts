import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Chain } from "../../../chains/index.js";
import {
  eth_blockNumber,
  getRpcClient,
  watchBlockNumber,
} from "../../../rpc/index.js";

export type UseBlockNumberOptions = {
  client: ThirdwebClient;
  chain: Chain;
  enabled?: boolean;
  watch?: boolean;
};

/**
 * Hook that watches for changes in the block number on a given chain.
 * @param options - The options for the hook.
 * @returns The latest block number.
 * @example
 * ```jsx
 * import { useBlockNumber } from "thirdweb/react";
 * const blockNumber = useBlockNumber({client, chain});
 * ```
 */
export function useBlockNumber(options: UseBlockNumberOptions) {
  const { client, chain, enabled = true, watch = true } = options;

  const queryClient = useQueryClient();

  const queryKey = useMemo(() => [chain.id, "blockNumber"] as const, [chain]);
  const query = useQuery({
    // TODO: technically client should be part of the queryKey here...
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey,
    queryFn: async () => {
      const rpcRequest = getRpcClient({ client, chain });
      return await eth_blockNumber(rpcRequest);
    },
    enabled,
  });

  useEffect(() => {
    if (!enabled || !watch) {
      // don't watch if not enabled or not watching
      return;
    }
    return watchBlockNumber({
      client,
      chain,
      onNewBlockNumber: (newBlockNumber) => {
        queryClient.setQueryData(queryKey, newBlockNumber);
      },
    });
  }, [client, chain, enabled, queryClient, queryKey, watch]);

  return query.data;
}
