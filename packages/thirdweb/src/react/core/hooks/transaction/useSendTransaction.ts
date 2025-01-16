import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { trackPayEvent } from "../../../../analytics/track/pay.js";
import type { Chain } from "../../../../chains/types.js";
import type { BuyWithCryptoStatus } from "../../../../pay/buyWithCrypto/getStatus.js";
import type { BuyWithFiatStatus } from "../../../../pay/buyWithFiat/getStatus.js";
import type { FiatProvider } from "../../../../pay/utils/commonTypes.js";
import type { GaslessOptions } from "../../../../transaction/actions/gasless/types.js";
import { sendTransaction } from "../../../../transaction/actions/send-transaction.js";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { getTransactionGasCost } from "../../../../transaction/utils.js";
import type { Hex } from "../../../../utils/encoding/hex.js";
import { resolvePromisedValue } from "../../../../utils/promise/resolve-promised-value.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { getTokenBalance } from "../../../../wallets/utils/getTokenBalance.js";
import { getWalletBalance } from "../../../../wallets/utils/getWalletBalance.js";
import { fetchBuySupportedDestinations } from "../../../web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import type { LocaleId } from "../../../web/ui/types.js";
import type { Theme } from "../../design-system/index.js";
import type { SupportedTokens } from "../../utils/defaultTokens.js";
import { hasSponsoredTransactionsEnabled } from "../../utils/wallet.js";

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
      metadata?: {
        name?: string;
        image?: string;
      };
      locale?: LocaleId;
      supportedTokens?: SupportedTokens;
      theme?: Theme | "light" | "dark";
      buyWithCrypto?:
        | false
        | {
            testMode?: boolean;
          };
      buyWithFiat?:
        | false
        | {
            prefillSource?: {
              currency?: "USD" | "CAD" | "GBP" | "EUR" | "JPY";
            };
            testMode?: boolean;
            preferredProvider?: FiatProvider;
          };
      purchaseData?: object;
      /**
       * Callback to be called when the user successfully completes the purchase.
       */
      onPurchaseSuccess?: (
        info:
          | {
              type: "crypto";
              status: BuyWithCryptoStatus;
            }
          | {
              type: "fiat";
              status: BuyWithFiatStatus;
            }
          | {
              type: "transaction";
              chainId: number;
              transactionHash: Hex;
            },
      ) => void;
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

export type ShowModalData = {
  tx: PreparedTransaction;
  sendTx: () => void;
  rejectTx: (reason: Error) => void;
  resolveTx: (data: WaitForReceiptOptions) => void;
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
        trackPayEvent({
          client: tx.client,
          walletAddress: account.address,
          walletType: wallet?.id,
          dstChainId: tx.chain.id,
          event: "pay_transaction_modal_disabled",
        });
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
            const [_nativeValue, _erc20Value, supportedDestinations] =
              await Promise.all([
                resolvePromisedValue(tx.value),
                resolvePromisedValue(tx.erc20Value),
                fetchBuySupportedDestinations(tx.client).catch((err) => {
                  trackPayEvent({
                    client: tx.client,
                    walletAddress: account.address,
                    walletType: wallet?.id,
                    dstChainId: tx.chain.id,
                    event: "pay_transaction_modal_pay_api_error",
                    error: err?.message,
                  });
                  return null;
                }),
              ]);

            if (!supportedDestinations) {
              // could not fetch supported destinations, just send the tx
              sendTx();
              return;
            }

            if (
              !supportedDestinations
                .map((x) => x.chain.id)
                .includes(tx.chain.id) ||
              (_erc20Value &&
                !supportedDestinations.some(
                  (x) =>
                    x.chain.id === tx.chain.id &&
                    x.tokens.find(
                      (t) =>
                        t.address.toLowerCase() ===
                        _erc20Value.tokenAddress.toLowerCase(),
                    ),
                ))
            ) {
              trackPayEvent({
                client: tx.client,
                walletAddress: account.address,
                walletType: wallet?.id,
                dstChainId: tx.chain.id,
                event: "pay_transaction_modal_chain_token_not_supported",
                error: `chain ${tx.chain.id} ${_erc20Value ? `/ token ${_erc20Value?.tokenAddress}` : ""} not supported`,
              });
              // chain/token not supported, just send the tx
              sendTx();
              return;
            }

            const nativeValue = _nativeValue || 0n;
            const erc20Value = _erc20Value?.amountWei || 0n;

            const [nativeBalance, erc20Balance, gasCost] = await Promise.all([
              getWalletBalance({
                client: tx.client,
                address: account.address,
                chain: tx.chain,
              }),
              _erc20Value?.tokenAddress
                ? getTokenBalance({
                    client: tx.client,
                    account,
                    chain: tx.chain,
                    tokenAddress: _erc20Value.tokenAddress,
                  })
                : undefined,
              getTransactionGasCost(tx, account.address),
            ]);

            const gasSponsored = hasSponsoredTransactionsEnabled(wallet);
            const txGasCost = gasSponsored ? 0n : gasCost;
            const nativeCost = nativeValue + txGasCost;

            const shouldShowModal =
              (erc20Value > 0n &&
                erc20Balance &&
                erc20Balance.value < erc20Value) ||
              (nativeCost > 0n && nativeBalance.value < nativeCost);

            if (shouldShowModal) {
              showPayModal({
                tx,
                sendTx,
                rejectTx: reject,
                resolveTx: resolve,
              });
            } else {
              trackPayEvent({
                client: tx.client,
                walletAddress: account.address,
                walletType: wallet?.id,
                dstChainId: tx.chain.id,
                event: "pay_transaction_modal_has_enough_funds",
              });
              sendTx();
            }
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
