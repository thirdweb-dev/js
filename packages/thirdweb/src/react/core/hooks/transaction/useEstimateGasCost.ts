import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import {
  type EstimateGasCostResult,
  estimateGasCost,
} from "../../../../transaction/actions/estimate-gas-cost.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";

export function useEstimateGasCost(
  account: Account | undefined,
): UseMutationResult<EstimateGasCostResult, Error, PreparedTransaction> {
  return useMutation({
    mutationFn: (transaction) => estimateGasCost({ transaction, account }),
  });
}
