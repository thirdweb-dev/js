import type { Abi } from "abitype";
import type { ThirdwebContract } from "../../../contract/index.js";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { waitForReceipt } from "../../../transaction/index.js";
import type { TransactionReceipt } from "viem";
import type { TransactionOrUserOpHash } from "../../../transaction/types.js";

export type TransactionHashOptions<abi extends Abi> =
  TransactionOrUserOpHash & {
    contract: ThirdwebContract<abi>;
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
export function useWaitForReceipt<abi extends Abi>(
  options: TransactionHashOptions<abi> | undefined,
): UseQueryResult<TransactionReceipt> {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      options?.contract.chainId,
      "waitForReceipt",
      options?.transactionHash,
    ] as const,
    queryFn: async () => {
      if (!options?.transactionHash) {
        throw new Error("No transaction hash");
      }
      return waitForReceipt({
        contract: options.contract,
        transactionHash: options.transactionHash,
      });
    },
    enabled: !!options?.transactionHash,
  });
}
