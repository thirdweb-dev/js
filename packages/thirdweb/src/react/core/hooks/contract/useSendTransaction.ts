import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { estimateGasCost } from "../../../../transaction/actions/estimate-gas-cost.js";
import { sendTransaction } from "../../../../transaction/actions/send-transaction.js";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { resolvePromisedValue } from "../../../../utils/promise/resolve-promised-value.js";
import {
  type GetWalletBalanceResult,
  getWalletBalance,
} from "../../../../wallets/utils/getWalletBalance.js";
import { fetchSwapSupportedChains } from "../../../web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import { useActiveAccount } from "../wallets/wallet-hooks.js";

type ShowModalData = {
  tx: PreparedTransaction;
  sendTx: () => void;
  rejectTx: () => void;
  totalCostWei: bigint;
  walletBalance: GetWalletBalanceResult;
};

/**
 * A hook to send a transaction.
 * @returns A mutation object to send a transaction.
 * @example
 * ```jsx
 * import { useSendTransaction } from "thirdweb/react";
 * const { mutate: sendTx, data: transactionResult } = useSendTransaction();
 *
 * // later
 * sendTx(tx);
 * ```
 * @internal
 */
export function useSendTransactionCore(
  showPayModal?: (data: ShowModalData) => void,
): UseMutationResult<WaitForReceiptOptions, Error, PreparedTransaction> {
  const account = useActiveAccount();

  return useMutation({
    mutationFn: async (tx) => {
      if (!account) {
        throw new Error("No active account");
      }

      if (!showPayModal) {
        return sendTransaction({
          transaction: tx,
          account,
        });
      }

      return new Promise<WaitForReceiptOptions>((resolve, reject) => {
        const sendTx = async () => {
          try {
            const res = await sendTransaction({
              transaction: tx,
              account,
            });

            resolve(res);
          } catch (e) {
            reject(e);
          }
        };

        (async () => {
          try {
            const swapSupportedChains = await fetchSwapSupportedChains(
              tx.client,
            );

            const isBuySupported = swapSupportedChains.find(
              (c) => c.id === tx.chain.id,
            );

            // buy not supported, can't show modal - send tx directly
            if (!isBuySupported) {
              sendTx();
              return;
            }

            //  buy supported, check if there is enouch balance - if not show modal to buy tokens

            const [walletBalance, totalCostWei] = await Promise.all([
              getWalletBalance({
                address: account.address,
                chain: tx.chain,
                client: tx.client,
              }),
              getTotalTxCostForBuy(tx),
            ]);

            const walletBalanceWei = walletBalance.value;

            // if enough balance, send tx
            if (totalCostWei < walletBalanceWei) {
              sendTx();
              return;
            }

            // if not enough balance - show modal
            showPayModal({
              tx,
              sendTx,
              rejectTx: () => {
                reject(new Error("Not enough balance"));
              },
              totalCostWei,
              walletBalance,
            });
          } catch (e) {
            console.error("Failed to estimate cost", e);
            // send it anyway?
            sendTx();
          }
        })();
      });
    },
  });
}

export async function getTotalTxCostForBuy(tx: PreparedTransaction) {
  // Must pass 0 otherwise it will throw on some chains
  const gasCost = await estimateGasCost({
    transaction: { ...tx, value: 0n },
  });

  const bufferCost = gasCost.wei / 10n;

  // Note: get tx.value AFTER estimateGasCost
  const txValue = await resolvePromisedValue(tx.value);

  // add 10% extra gas cost to the estimate to ensure user buys enough to cover the tx cost
  return gasCost.wei + bufferCost + (txValue || 0n);
}
