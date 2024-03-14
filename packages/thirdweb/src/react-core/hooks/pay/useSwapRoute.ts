import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import {
  getSwapRoute,
  type SwapRoute,
  type SwapRouteParams,
} from "../../../pay/swap/actions/getSwap.js";

export type {
  SwapRoute,
  SwapRouteParams,
} from "../../../pay/swap/actions/getSwap.js";

/**
 * A hook to get a swap route
 * @returns a swap route object to perform a swap
 * @example
 * ```jsx
 * import { useSwapRoute } from "thirdweb/react";
 * const { mutate: getSwapRoute, data: swapRoute } = useSwapRoute();
 *
 * // later
 * const swapRoute = await getSwapRoute(swapParams);
 * ```
 */
export function useSwapRoute(): UseMutationResult<
  SwapRoute,
  Error,
  SwapRouteParams
> {
  return useMutation({
    mutationFn: async (routeParams) => {
      return await getSwapRoute(routeParams);
    },
  });
}
