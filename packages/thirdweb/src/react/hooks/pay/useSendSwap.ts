import { useState } from "react";
import { useSwapStatus, type SwapStatusParams } from "./useSwapStatus.js";
import { useMutation } from "@tanstack/react-query";
import { useActiveWallet } from "../../providers/wallet-provider.js";
import type { SwapRoute } from "../../../pay/swap/actions/getSwap.js";
import { sendSwap } from "../../../pay/swap/actions/sendSwap.js";

export type { SwapStatusParams, SwapStatus } from "./useSwapStatus.js";

export type { SwapRoute } from "./useSwapRoute.js";

/**
 * A hook to get a swap route
 * @returns a swap route object to perform a swap
 * @example
 * ```jsx
 * import { useSendSwap } from "thirdweb/react";
 * const { sendSwap, swapStatus, sendStatus, isFetching,  error } = useSendSwap();
 *
 * // later
 * await sendSwap(swapParams);
 *
 * console.log(swapStatus); // this will update with swap status
 * ```
 */
export function useSendSwap() {
  const wallet = useActiveWallet();
  const [swapStatusParams, setSwapStatusParams] = useState<
    SwapStatusParams | undefined
  >(undefined);

  // Use the useSwapStatus hook for polling
  const {
    swapStatus,
    isFetching,
    error: pollError,
  } = useSwapStatus(swapStatusParams);

  const {
    mutate: sendSwapMutation,
    status: sendStatus,
    error: sendError,
  } = useMutation<SwapStatusParams, Error, SwapRoute>({
    mutationFn: async (swapRoute: SwapRoute) => {
      if (!wallet) {
        throw new Error("Wallet not found");
      }
      const swapStatusParams_ = await sendSwap(wallet, swapRoute);

      setSwapStatusParams(swapStatusParams_);
      return swapStatusParams_;
    },
  });

  const combinedError = sendError || pollError;

  return {
    sendSwap: sendSwapMutation,
    swapStatus,
    sendStatus,
    isFetching,
    error: combinedError,
  };
}
