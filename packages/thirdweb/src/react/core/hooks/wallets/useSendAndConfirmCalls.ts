import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { sendAndConfirmCalls } from "../../../../wallets/eip5792/send-and-confirm-calls.js";
import type { SendCallsOptions } from "../../../../wallets/eip5792/send-calls.js";
import type { GetCallsStatusResponse } from "../../../../wallets/eip5792/types.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { invalidateWalletBalance } from "../../providers/invalidateWalletBalance.js";
import { useActiveWallet } from "./useActiveWallet.js";

/**
 * A hook to send [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to a wallet.
 * This hook works with all Thirdweb wallets (in-app and smart) and certain injected wallets that already support EIP-5792.
 * Transactions will be batched and sponsored when those capabilities are supported, otherwise they will be sent as individual transactions.
 *
 * When calls are sent, all contracts that are interacted with will have their corresponding reads revalidated via React Query.
 *
 * This hook is dependent on the wallet's support for EIP-5792 and could fail.
 * The mutation function will use your currently connected wallet by default, but you can pass it a specific wallet to use if you'd like.
 *
 * @returns A React Query mutation object to interact with {@link sendAndConfirmCalls}
 * @throws an error if the wallet does not support EIP-5792.
 * @returns The ID of the bundle of the calls.
 *
 * @beta
 * @example
 * ```tsx
 * import { useSendCalls } from "thirdweb/react";
 *
 * const sendTx1 = approve({
      contract: USDT_CONTRACT,
      amount: 100,
      spender: "0x33d9B8BEfE81027E2C859EDc84F5636cbb202Ed6",
    });
 * const sendTx2 = approve({
      contract: USDT_CONTRACT,
      amount: 100,
      spender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
    });
 * const { mutate: sendCalls, data: result } = useSendAndConfirmCalls();
 * await sendCalls({
 *   client,
 *   calls: [sendTx1, sendTx2],
 * });
 * 
 * console.log("Transaction hash:", result.receipts?.[0]?.transactionHash);
 * ```

 * Sponsor transactions with a paymaster:
 * ```ts
 * const { mutate: sendAndConfirmCalls, data: id } = useSendAndConfirmCalls();
 * const result = await sendAndConfirmCalls({
 *   client,
 *   calls: [sendTx1, sendTx2],
 *   capabilities: {
 *     paymasterService: {
 *       url: `https://${CHAIN.id}.bundler.thirdweb.com/${client.clientId}`
 *     }
 *   }
 * });
 * console.log("Transaction hash:", result.receipts?.[0]?.transactionHash);
 * ```
 *
 *  We recommend proxying any paymaster calls via an API route you setup and control.
 * @extension EIP5792
 */
export function useSendAndConfirmCalls(args?: {
  maxBlocksWaitTime?: number;
}): UseMutationResult<
  GetCallsStatusResponse,
  Error,
  Omit<SendCallsOptions, "chain" | "wallet"> & { wallet?: Wallet } // Optional wallet override
> {
  const activeWallet = useActiveWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options) => {
      const { wallet = activeWallet } = options;
      if (!wallet) {
        throw new Error(
          "Failed to send transactions, no connected wallet found.",
        );
      }

      return sendAndConfirmCalls({
        ...options,
        maxBlocksWaitTime: args?.maxBlocksWaitTime,
        wallet,
      });
    },
    onSettled: async (_result, _error, variables) => {
      // Attempt to invalidate any reads related to the sent transactions
      const call = variables.calls[0];
      if (!call) {
        return;
      }
      const chain = call.__contract?.chain || call.chain;

      for (const call of variables.calls) {
        queryClient.invalidateQueries({
          queryKey: [
            "readContract",
            call.__contract?.chain.id || call.chain.id,
            call.__contract?.address || call.to,
          ],
        });
      }
      invalidateWalletBalance(queryClient, chain.id);
    },
  });
}
