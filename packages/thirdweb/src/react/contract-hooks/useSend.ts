import type { AbiFunction } from "abitype";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { execute } from "../../transaction/index.js";
import type { Transaction } from "../../transaction/transaction.js";
import { useActiveWallet } from "../providers/wallet-provider.js";

export function useSendTransaction<
  const abiFn extends AbiFunction,
>(): UseMutationResult<
  Awaited<ReturnType<typeof execute>>,
  Error,
  Transaction<abiFn>
> {
  const wallet = useActiveWallet();

  return useMutation({
    mutationFn: async (tx) => {
      if (!wallet) {
        throw new Error("No active wallet");
      }
      return await execute({ tx, wallet });
    },
  });
}
