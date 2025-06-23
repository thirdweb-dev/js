import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import {
  type EstimateGasResult,
  estimateGas,
} from "../../../../transaction/actions/estimate-gas.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { useActiveAccount } from "../wallets/useActiveAccount.js";

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
 * @transaction
 */
export function useEstimateGas(): UseMutationResult<
  EstimateGasResult,
  Error,
  PreparedTransaction
> {
  const account = useActiveAccount();
  return useMutation({
    mutationFn: (transaction) => estimateGas({ account, transaction }),
  });
}
