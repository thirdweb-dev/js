import type { AbiFunction } from "abitype";

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { execute } from "../../transaction/index.js";
import type { Transaction } from "../../transaction/transaction.js";
import { useActiveWallet } from "../providers/wallet-provider.js";

export function useSend<const abiFn extends AbiFunction>(): UseMutationResult<
  Awaited<ReturnType<typeof execute>>,
  Error,
  Transaction<abiFn>
> {
  const wallet = useActiveWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tx) => {
      if (!wallet) {
        throw new Error("No active wallet");
      }
      return await execute({ tx, wallet });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSettled: async (result, _error, variables) => {
      if (result?.wait) {
        await result.wait();
        // TODO: do something with the receipt that we return from wait?
      }
      // then invalidate the queryClient cache for this contract
      return queryClient.invalidateQueries({
        queryKey: [
          variables.contract.chainId,
          variables.contract.address,
        ] as const,
      });
    },
  });
}
