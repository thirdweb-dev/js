import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  type SwapStatus,
  type SwapStatusParams,
  getSwapStatus,
} from "../../../pay/swap/actions/getStatus.js";

// TODO: use the estimate to vary the polling interval
const DEFAULT_POLL_INTERVAL = 5000;

// reexport needed types
export type {
  SwapStatus,
  SwapStatusParams,
} from "../../../pay/swap/actions/getStatus.js";

/**
 * A hook to get a swap status
 * @param swapStatusParams - the swap status params to query a swap transaction
 * @returns a swap status object
 * @example
 * ```jsx
 * import { useSwapStatus } from "thirdweb/react";
 * const { swapStatus, isFetching, error } = useSwapStatus(swapStatusParams);
 *
 * // later
 * console.log(swapStatus);
 * ```
 */
export function useSwapStatus(swapStatusParams: SwapStatusParams | undefined) {
  const [refetchInterval, setRefetchInterval] = useState<number>(
    DEFAULT_POLL_INTERVAL,
  );

  const {
    data: swapStatus,
    isFetching,
    error,
  } = useQuery<SwapStatus, Error>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      "swapStatus",
      swapStatusParams?.transactionId,
      swapStatusParams?.transactionHash,
    ] as const,
    queryFn: async () => {
      if (!swapStatusParams) {
        throw new Error("Missing swap status params");
      }

      const swapStatus_ = await getSwapStatus(swapStatusParams);
      if (swapStatus_.status === "DONE") {
        setRefetchInterval(0);
      }
      return swapStatus_;
    },
    enabled: !!swapStatusParams,
    refetchInterval: refetchInterval,
    refetchIntervalInBackground: true,
    retry: true,
  });

  return { swapStatus, isFetching, error };
}
