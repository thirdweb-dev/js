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

export function useSendCallsCore(
  {
    client,
    waitForResult = true,
  }: { client: ThirdwebClient; waitForResult?: boolean },
  wallet?: Wallet,
): UseMutationResult<
  GetCallsStatusResponse | WalletSendCallsId,
  Error,
  Omit<SendCallsOptions, "chain" | "wallet"> & { wallet?: Wallet } // Optional wallet override
> {
  const connectedWallet = wallet;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options) => {
      const { wallet = connectedWallet } = options;
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
      const chain = connectedWallet?.getChain();
      if (!_result || !connectedWallet || !chain) {
        return;
      }

      if (typeof _result === "string") {
        await waitForBundle({
          bundleId: _result,
          wallet: connectedWallet,
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
