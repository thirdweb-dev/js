import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { TransactionReceipt } from "viem";
import {
  waitForReceipt,
  type WaitForReceiptOptions,
} from "../../../transaction/actions/wait-for-tx-receipt.js";

/**
 * A hook to wait for a transaction receipt.
 * @param options - The options for waiting for a transaction receipt.
 * @returns a query object.
 * @example
 * ```jsx
 * import { useWaitForReceipt } from "thirdweb/react";
 * const { data: receipt, isLoading } = useWaitForReceipt({contract, transactionHash});
 * ```
 */
export function useWaitForReceipt(
  options: WaitForReceiptOptions | undefined,
): UseQueryResult<TransactionReceipt> {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      "waitForReceipt",
      // TODO: here chain can be undfined so we go to a `-1` chain but this feels wrong
      options?.transaction.chain.id || -1,
      options?.transactionHash || options?.userOpHash,
    ] as const,
    queryFn: async () => {
      if (!options?.transactionHash && !options?.userOpHash) {
        throw new Error("No transaction hash or user op hash provided");
      }
      return waitForReceipt(options);
    },
    enabled: !!options?.transactionHash || !!options?.userOpHash,
    retry: false,
  });
}
