import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { TransactionReceipt } from "viem";
import {
  type WaitForReceiptOptions,
  waitForReceipt,
} from "../../../../transaction/actions/wait-for-tx-receipt.js";

/**
 * A hook to wait for a transaction receipt.
 * @param options - The options for waiting for a transaction receipt.
 * @returns a query object.
 * @example
 * ```jsx
 * import { useWaitForReceipt } from "thirdweb/react";
 * const { data: receipt, isLoading } = useWaitForReceipt({client, chain, transactionHash});
 * ```
 * @transaction
 */
export function useWaitForReceipt(
  options:
    | (WaitForReceiptOptions & { queryOptions?: { enabled?: boolean } })
    | undefined,
): UseQueryResult<TransactionReceipt> {
  return useQuery({
    enabled:
      !!options?.transactionHash && (options?.queryOptions?.enabled ?? true),
    queryFn: async () => {
      if (!options?.transactionHash) {
        throw new Error("No transaction hash or user op hash provided");
      }
      return waitForReceipt(options);
    },
    queryKey: [
      "waitForReceipt",
      // TODO: here chain can be undfined so we go to a `-1` chain but this feels wrong
      options?.chain.id || -1,
      options?.transactionHash,
    ] as const,
    retry: false,
  });
}
