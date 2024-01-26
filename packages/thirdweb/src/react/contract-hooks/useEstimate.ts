import type { AbiFunction } from "abitype";
import { useMutation } from "@tanstack/react-query";
import { estimateGas } from "../../transaction/index.js";
import type { Transaction } from "../../transaction/transaction.js";
import { useActiveWallet } from "../providers/wallet-provider.js";

export function useEstimateGas<const abiFn extends AbiFunction>() {
  const wallet = useActiveWallet();

  return useMutation<bigint, Error, Transaction<abiFn>>({
    mutationFn: (tx) => estimateGas(tx, wallet ?? undefined),
  });
}
