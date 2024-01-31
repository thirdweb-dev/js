import { useState, useEffect } from "react";
import type { ThirdwebClient } from "../../../index.js";
import { watchBlockNumber } from "../../../rpc/watchBlockNumber.js";
import type { Chain } from "../../../chain/index.js";

export type UseWatchBlockNumberOptions = {
  client: ThirdwebClient;
  chain: Chain;
  enabled?: boolean;
};

/**
 * Hook that watches for changes in the block number on a given chain.
 * @param options - The {@link UseWatchBlockNumberOptions | options} for the hook.
 * @returns The latest block number.
 * @example
 * ```jsx
 * import { useWatchBlockNumber } from "thirdweb/react";
 * const blockNumber = useWatchBlockNumber({client, chainId});
 * ```
 */
export function useWatchBlockNumber(options: UseWatchBlockNumberOptions) {
  const { client, chain, enabled = true } = options;
  const [blockNumber, setBlockNumber] = useState<bigint | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      // don't watch if not enabled
      return;
    }
    return watchBlockNumber({
      client,
      chain,
      onNewBlockNumber: setBlockNumber,
    });
  }, [client, chain, enabled]);

  return blockNumber;
}
