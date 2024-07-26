import { useContext } from "react";
import {
  type SendTransactionConfig,
  type ShowModalData,
  useSendTransactionCore,
} from "../../../core/hooks/transaction/useSendTransaction.js";
import { SetRootElementContext } from "../../../core/providers/RootElementContext.js";
import { TransactionModal } from "../../ui/TransactionButton/TransactionModal.js";
import { useActiveWallet } from "../wallets/useActiveWallet.js";
import { useSwitchActiveWalletChain } from "../wallets/useSwitchActiveWalletChain.js";

/**
 * A hook to send a transaction.
 * @returns A mutation object to send a transaction.
 * @param config Configuration for the `useSendTransaction` hook.
 * Refer to [`SendTransactionConfig`](https://portal.thirdweb.com/references/typescript/v5/SendTransactionConfig) for more details.
 * @example
 * ```tsx
 * import { useSendTransaction } from "thirdweb/react";
 * const { mutate: sendTx, data: transactionResult } = useSendTransaction();
 *
 * // later
 * sendTx(tx);
 * ```
 *
 * @transaction
 */
export function useSendTransaction(config: SendTransactionConfig = {}) {
  const switchChain = useSwitchActiveWalletChain();
  const wallet = useActiveWallet();
  const setRootEl = useContext(SetRootElementContext);
  const payModal = config.payModal;

  let payModalEnabled = true;

  if (payModal === false || config.gasless) {
    payModalEnabled = false;
  }

  const showPayModal = (data: ShowModalData) => {
    if (payModal === false) return;
    setRootEl(
      <TransactionModal
        title={payModal?.metadata?.name || "Transaction"}
        tx={data.tx}
        onComplete={data.sendTx}
        onClose={() => {
          setRootEl(null);
          data.rejectTx(
            new Error("User rejected transaction by closing modal"),
          );
        }}
        onTxSent={data.resolveTx}
        client={data.tx.client}
        localeId={payModal?.locale || "en_US"}
        supportedTokens={payModal?.supportedTokens}
        theme={payModal?.theme || "dark"}
        payOptions={{
          buyWithCrypto: payModal?.buyWithCrypto,
          buyWithFiat: payModal?.buyWithFiat,
          purchaseData: payModal?.purchaseData,
          mode: "transaction",
          transaction: data.tx,
          metadata: payModal?.metadata,
        }}
      />,
    );
  };

  return useSendTransactionCore({
    showPayModal:
      !payModalEnabled || payModal === false ? undefined : showPayModal,
    gasless: config.gasless,
    switchChain,
    wallet,
  });
}
