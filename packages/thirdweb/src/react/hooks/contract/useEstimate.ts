import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useActiveAccount } from "../../providers/wallet-provider.js";
import type { PreparedTransaction } from "../../../transaction/transaction.js";
import { estimateGas } from "../../../transaction/actions/estimate-gas.js";

/**
 * A hook to estimate the gas for a given transaction.
 * @returns A mutation object to estimate gas.
 * @example
 * ```jsx
 * import { useEstimateGas } from "thirdweb/react";
 * const { mutate: estimateGas, data: gasEstimate } = useEstimateGas();
 *
 * // later
 * const estimatedGas = await estimateGas(tx);
 * ```
 */
export function useEstimateGas(): UseMutationResult<
  bigint,
  Error,
  PreparedTransaction
> {
  const account = useActiveAccount();

  return useMutation({
    mutationFn: (transaction) => estimateGas({ transaction, account }),
  });
}
