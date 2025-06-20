import { useQuery } from "@tanstack/react-query";
import type { routes as RoutesTypes } from "../../../bridge/Routes.js";
import { routes } from "../../../bridge/Routes.js";
import { ApiError } from "../../../bridge/types/Errors.js";
import { mapBridgeError } from "../errors/mapBridgeError.js";

/**
 * Parameters for the useBridgeRoutes hook
 */
export type UseBridgeRoutesParams = RoutesTypes.Options & {
  /**
   * Whether to enable the query. Useful for conditional fetching.
   * @default true
   */
  enabled?: boolean;
};

/**
 * Hook that fetches available bridge routes with caching and retry logic
 *
 * @param params - Parameters for fetching routes including client and filter options
 * @returns React Query result with routes data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: routes, isLoading, error } = useBridgeRoutes({
 *   client: thirdwebClient,
 *   originChainId: 1,
 *   destinationChainId: 137,
 *   originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
 * });
 * ```
 */
export function useBridgeRoutes(params: UseBridgeRoutesParams) {
  const { enabled = true, ...routeParams } = params;

  return useQuery({
    enabled: enabled && !!routeParams.client,
    gcTime: 10 * 60 * 1000,
    queryFn: () => routes(routeParams),
    queryKey: [
      "bridge-routes",
      {
        destinationChainId: routeParams.destinationChainId,
        destinationTokenAddress: routeParams.destinationTokenAddress,
        limit: routeParams.limit,
        maxSteps: routeParams.maxSteps,
        offset: routeParams.offset,
        originChainId: routeParams.originChainId,
        originTokenAddress: routeParams.originTokenAddress,
        sortBy: routeParams.sortBy,
      },
    ], // 5 minutes - routes are relatively stable
    retry: (failureCount, error) => {
      // Handle both ApiError and generic Error instances
      if (error instanceof ApiError) {
        const bridgeError = mapBridgeError(error);

        // Don't retry on client-side errors (4xx)
        if (
          bridgeError.statusCode &&
          bridgeError.statusCode >= 400 &&
          bridgeError.statusCode < 500
        ) {
          return false;
        }
      }

      // Retry up to 3 times for server errors or network issues
      return failureCount < 3;
    }, // 10 minutes garbage collection
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // Exponential backoff, max 30s
  });
}
