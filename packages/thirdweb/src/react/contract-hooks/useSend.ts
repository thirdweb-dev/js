import type { AbiFunction } from "abitype";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { Transaction } from "../../transaction/transaction.js";
import { useActiveWallet } from "../providers/wallet-provider.js";
import type { Hex } from "viem";

export function useSendTransaction<
  const abiFn extends AbiFunction,
>(): UseMutationResult<Awaited<Hex>, Error, Transaction<abiFn>> {
  const wallet = useActiveWallet();

  return useMutation({
    mutationFn: async (tx) => {
      if (!wallet) {
        throw new Error("No active wallet");
      }
      return await wallet.sendTransaction(tx);
    },
  });
}
