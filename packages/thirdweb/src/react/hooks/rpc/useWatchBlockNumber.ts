import { useState, useEffect } from "react";
import type { ThirdwebClient } from "../../../index.js";
import { watchBlockNumber } from "../../../rpc/watchBlockNumber.js";

export type UseWatchBlockNumberOptions = {
  client: ThirdwebClient;
  chainId: number;
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
  const { client, chainId, enabled = true } = options;
  const [blockNumber, setBlockNumber] = useState<bigint | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      // don't watch if not enabled
      return;
    }
    return watchBlockNumber({
      client,
      chainId,
      onNewBlockNumber: setBlockNumber,
    });
  }, [client, chainId, enabled]);

  return blockNumber;
}
