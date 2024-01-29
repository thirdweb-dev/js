import { useState, useEffect } from "react";
import type { ThirdwebClient } from "../../../index.js";
import { watchBlockNumber } from "../../../rpc/watchBlockNumber.js";

export function useWatchBlockNumber({
  client,
  chainId,
  enabled = true,
}: {
  client: ThirdwebClient;
  chainId: number;
  enabled?: boolean;
}) {
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
