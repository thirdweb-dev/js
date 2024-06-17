import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import {
  type EstimateGasResult,
  estimateGas,
} from "../../../../transaction/actions/estimate-gas.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";

export function useEstimateGasCore(
  account: Account | undefined,
): UseMutationResult<EstimateGasResult, Error, PreparedTransaction> {
  return useMutation({
    mutationFn: (transaction) => estimateGas({ transaction, account }),
  });
}
