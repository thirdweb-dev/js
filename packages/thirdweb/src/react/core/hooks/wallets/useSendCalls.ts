import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  type SendCallsOptions,
  sendCalls,
} from "../../../../wallets/eip5792/send-calls.js";
import type {
  GetCallsStatusResponse,
  WalletSendCallsId,
} from "../../../../wallets/eip5792/types.js";
import { waitForBundle } from "../../../../wallets/eip5792/wait-for-bundle.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { invalidateWalletBalance } from "../../providers/invalidateWalletBalance.js";
import { useActiveWallet } from "./useActiveWallet.js";

/**
 * A hook to send [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to a wallet.
 * This hook works with all Thirdweb wallets (in-app and smart) and certain injected wallets that already support EIP-5792.
 * Transactions will be bundled and sponsored when those capabilities are supported, otherwise they will be sent as individual transactions.
 *
 * When calls are sent, all contracts that are interacted with will have their corresponding reads revalidated via React Query.
 *
 *  This hook is dependent on the wallet's support for EIP-5792 and could fail.
 *  The mutatuon function will use your currently connected wallet by default, but you can pass it a specific wallet to use if you'd like.
 *
 * @returns A React Query mutatuon object to interact with {@link sendCalls}
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
 * const { mutate: sendCalls, data: bundleId } = useSendCalls({ client });
 * await sendCalls({
 *   wallet,
 *   client,
 *   calls: [sendTx1, sendTx2],
 * });
 * ```
 * Await the bundle's full confirmation:
 * ```tsx
 * const { mutate: sendCalls, data: bundleId } = useSendCalls({ client, waitForResult: true });
 * await sendCalls({
 *   wallet,
 *   client,
 *   calls: [sendTx1, sendTx2],
 * });
 * ```
 * Sponsor transactions with a paymaster:
 * ```ts
 * const { mutate: sendCalls, data: bundleId } = useSendCalls();
 * await sendCalls({
 *   client,
 *   calls: [sendTx1, sendTx2],
 *   capabilities: {
 *     paymasterService: {
 *       url: `https://${CHAIN.id}.bundler.thirdweb.com/${client.clientId}`
 *     }
 *   }
 * });
 * ```
 *
 *  We recommend proxying any paymaster calls via an API route you setup and control.
 * @extension EIP5792
 */
export function useSendCalls({
  client,
  waitForResult = true,
}: { client: ThirdwebClient; waitForResult?: boolean }): UseMutationResult<
  GetCallsStatusResponse | WalletSendCallsId,
  Error,
  Omit<SendCallsOptions, "chain" | "wallet"> & { wallet?: Wallet } // Optional wallet override
> {
  const activeWallet = useActiveWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options) => {
      const { wallet = activeWallet } = options;
      const chain = wallet?.getChain();
      if (!wallet || !chain) {
        throw new Error(
          "Failed to send transactions, no connected wallet found.",
        );
      }

      const callsPromise = sendCalls({ ...options, wallet });
      if (!waitForResult) {
        return callsPromise;
      }

      const result = await waitForBundle({
        bundleId: await callsPromise,
        wallet,
        client,
        chain,
      });
      return result;
    },
    onSettled: async (_result, _error, variables) => {
      // Attempt to invalidate any reads related to the sent transactions
      const chain = activeWallet?.getChain();
      if (!_result || !activeWallet || !chain) {
        return;
      }

      if (typeof _result === "string") {
        await waitForBundle({
          bundleId: _result,
          wallet: activeWallet,
          client,
          chain,
        }).catch((error) => {
          console.error(
            "Failed to confirm sent bundle and invalidate queries",
            _result,
            error,
          );
          return undefined;
        });
      }

      for (const call of variables.calls) {
        queryClient.invalidateQueries({
          queryKey: [
            "readContract",
            call.__contract?.chain.id,
            call.__contract?.address,
          ],
        });
      }
      invalidateWalletBalance(queryClient, chain.id);
    },
  });
}
