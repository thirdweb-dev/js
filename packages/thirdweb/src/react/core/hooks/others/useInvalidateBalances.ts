import { useQueryClient } from "@tanstack/react-query";
import { invalidateWalletBalance } from "../../providers/invalidateWalletBalance.js";

/**
 * Invalidate the balances for a given chainId. If no chainId is provided, invalidate all balances.
 * @example
 * ```ts
 * const invalidateBalances = useInvalidateBalances();
 * invalidateBalances();
 * ```
 */
export function useInvalidateBalances() {
  const queryClient = useQueryClient();

  return ({ chainId }: { chainId?: number }) => {
    invalidateWalletBalance(queryClient, chainId);
  };
}
