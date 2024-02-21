import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useActiveWallet } from "../../providers/wallet-provider.js";
import {
  estimateGas,
  type EstimateGasResult,
} from "../../../transaction/actions/estimate-gas.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";

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
  EstimateGasResult,
  Error,
  PreparedTransaction
> {
  const wallet = useActiveWallet();

  return useMutation({
    mutationFn: (transaction) => estimateGas({ transaction, wallet }),
  });
}
