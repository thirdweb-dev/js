import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { TransactionReceipt } from "viem";
import type { TransactionOrUserOpHash } from "../../../transaction/types.js";
import { getChainIdFromChain } from "../../../chain/index.js";
import { waitForReceipt } from "../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../transaction/index.js";

export type TransactionHashOptions = TransactionOrUserOpHash & {
  transaction: PreparedTransaction;
  transactionHash?: string;
};

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
  options: TransactionHashOptions | undefined,
): UseQueryResult<TransactionReceipt> {
  // TODO: here contract can be undfined so we go to a `-1` chain but this feels wrong
  const chainId = getChainIdFromChain(
    options?.transaction.chain ?? -1,
  ).toString();
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["waitForReceipt", chainId, options?.transactionHash] as const,
    queryFn: async () => {
      if (!options?.transactionHash) {
        throw new Error("No transaction hash");
      }
      return waitForReceipt({
        transaction: options.transaction,
        transactionHash: options.transactionHash,
      });
    },
    enabled: !!options?.transactionHash,
  });
}
