import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import type { Chain } from "../../../../chains/types.js";
import { estimateGasCost } from "../../../../transaction/actions/estimate-gas-cost.js";
import type { GaslessOptions } from "../../../../transaction/actions/gasless/types.js";
import { sendTransaction } from "../../../../transaction/actions/send-transaction.js";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { resolvePromisedValue } from "../../../../utils/promise/resolve-promised-value.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  type GetWalletBalanceResult,
  getWalletBalance,
} from "../../../../wallets/utils/getWalletBalance.js";
import type { SupportedTokens } from "../../../web/ui/ConnectWallet/defaultTokens.js";
import { fetchBuySupportedDestinations } from "../../../web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import type { LocaleId } from "../../../web/ui/types.js";
import type { Theme } from "../../design-system/index.js";

/**
 * Configuration for the "Pay Modal" that opens when the user doesn't have enough funds to send a transaction.
 * Set `payModal: false` to disable the "Pay Modal" popup
 *
 * This configuration object includes the following properties to configure the "Pay Modal" UI:
 *
 * ### `locale`
 * The language to use for the "Pay Modal" UI. Defaults to `"en_US"`.
 *
 * ### `supportedTokens`
 * An object of type [`SupportedTokens`](https://portal.thirdweb.com/references/typescript/v5/SupportedTokens) to configure the tokens to show for a chain.
 *
 * ### `theme`
 * The theme to use for the "Pay Modal" UI. Defaults to `"dark"`.
 *
 * It can be set to `"light"` or `"dark"` or an object of type [`Theme`](https://portal.thirdweb.com/references/typescript/v5/Theme) for a custom theme.
 *
 * Refer to [`lightTheme`](https://portal.thirdweb.com/references/typescript/v5/lightTheme)
 * or [`darkTheme`](https://portal.thirdweb.com/references/typescript/v5/darkTheme) helper functions to use the default light or dark theme and customize it.
 */
export type SendTransactionPayModalConfig =
  | {
      locale?: LocaleId;
      supportedTokens?: SupportedTokens;
      theme?: Theme | "light" | "dark";
      buyWithCrypto?: false;
      buyWithFiat?:
        | false
        | {
            testMode?: boolean;
          };
      purchaseData?: object;
    }
  | false;

/**
 * Configuration for the `useSendTransaction` hook.
 */
export type SendTransactionConfig = {
  /**
   * Refer to [`SendTransactionPayModalConfig`](https://portal.thirdweb.com/references/typescript/v5/SendTransactionPayModalConfig) for more details.
   */
  payModal?: SendTransactionPayModalConfig;

  /**
   * Configuration for gasless transactions.
   * Refer to [`GaslessOptions`](https://portal.thirdweb.com/references/typescript/v5/GaslessOptions) for more details.
   */
  gasless?: GaslessOptions;
};

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
export function useSendTransactionCore(args: {
  showPayModal?: (data: ShowModalData) => void;
  gasless?: GaslessOptions;
  wallet: Wallet | undefined;
  switchChain: (chain: Chain) => Promise<void>;
}): UseMutationResult<WaitForReceiptOptions, Error, PreparedTransaction> {
  const { showPayModal, gasless, wallet, switchChain } = args;
  let _account = wallet?.getAccount();

  return useMutation({
    mutationFn: async (tx) => {
      // switch chain if needed
      if (wallet && tx.chain.id !== wallet.getChain()?.id) {
        await switchChain(tx.chain);
        // in smart wallet case, account may change after chain switch
        _account = wallet.getAccount();
      }

      const account = _account;

      if (!account) {
        throw new Error("No active account");
      }

      if (!showPayModal) {
        return sendTransaction({
          transaction: tx,
          account,
          gasless,
        });
      }

      return new Promise<WaitForReceiptOptions>((resolve, reject) => {
        const sendTx = async () => {
          try {
            const res = await sendTransaction({
              transaction: tx,
              account,
              gasless,
            });

            resolve(res);
          } catch (e) {
            reject(e);
          }
        };

        (async () => {
          try {
            const destinations = await fetchBuySupportedDestinations(tx.client);

            const isBuySupported = destinations.find(
              (c) => c.chain.id === tx.chain.id,
            );

            // buy not supported, can't show modal - send tx directly
            if (!isBuySupported) {
              sendTx();
              return;
            }

            //  buy supported, check if there is enough balance - if not show modal to buy tokens
            const [walletBalance, totalCostWei] = await Promise.all([
              getWalletBalance({
                address: account.address,
                chain: tx.chain,
                client: tx.client,
              }),
              getTotalTxCostForBuy(tx, account?.address),
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

export async function getTotalTxCostForBuy(
  tx: PreparedTransaction,
  from?: string,
) {
  try {
    const gasCost = await estimateGasCost({
      transaction: tx,
      from,
    });

    const bufferCost = gasCost.wei / 10n;

    // Note: get tx.value AFTER estimateGasCost
    const txValue = await resolvePromisedValue(tx.value);

    // add 10% extra gas cost to the estimate to ensure user buys enough to cover the tx cost
    return gasCost.wei + bufferCost + (txValue || 0n);
  } catch (e) {
    if (from) {
      // try again without passing from
      return await getTotalTxCostForBuy(tx);
    }
    // fallback if both fail, use the tx value + 1% buffer
    const value = await resolvePromisedValue(tx.value);
    if (!value) {
      return 0n;
    }
    return value + value / 100n;
  }
}
