import type { AbiFunction } from "abitype";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { estimateGas } from "../../../transaction/index.js";
import type { Transaction } from "../../../transaction/transaction.js";
import { useActiveWallet } from "../../providers/wallet-provider.js";

export function useEstimateGas<
  const abiFn extends AbiFunction,
>(): UseMutationResult<bigint, Error, Transaction<abiFn>> {
  const wallet = useActiveWallet();

  return useMutation({
    mutationFn: (tx) =>
      estimateGas(tx, wallet?.address ? { from: wallet.address } : undefined),
  });
}
