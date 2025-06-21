import { useContext } from "react";
import { randomBytesHex } from "../../../../utils/random.js";
import {
  type SendTransactionConfig,
  type ShowModalData,
  useSendTransactionCore,
} from "../../../core/hooks/transaction/useSendTransaction.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { useSwitchActiveWalletChain } from "../../../core/hooks/wallets/useSwitchActiveWalletChain.js";
import { SetRootElementContext } from "../../../core/providers/RootElementContext.js";
import { TransactionModal } from "../../ui/TransactionButton/TransactionModal.js";

/**
 * A hook to send a transaction with from the user's connected wallet.
 *
 * You can send a transaction with a [prepared contract call](https://portal.thirdweb.com/references/typescript/v5/prepareContractCall), a [prepared transaction](https://portal.thirdweb.com/references/typescript/v5/prepareTransaction), or using a write [Extension](https://portal.thirdweb.com/react/v5/extensions).
 *
 * @returns A UseMutationResult object to send a transaction.
 * @param config Configuration for the `useSendTransaction` hook.
 * Refer to [`SendTransactionConfig`](https://portal.thirdweb.com/references/typescript/v5/SendTransactionConfig) for more details.
 * @example
 *
 * ### Sending a prepared contract call
 *
 * ```tsx
 * import { useSendTransaction } from "thirdweb/react";
 * import { getContract, prepareContractCall } from "thirdweb";
 * import { sepolia } from "thirdweb/chains";
 *
 * const contract = getContract({
 *   address: "0x...",
 *   chain: sepolia,
 *   client,
 * });
 *
 * const { mutate: sendTx, data: transactionResult } = useSendTransaction();
 *
 * const onClick = () => {
 *   const transaction = prepareContractCall({
 *     contract,
 *     method: "function transfer(address to, uint256 value)",
 *     params: [to, value],
 *   });
 *   sendTx(transaction);
 * };
 * ```
 *
 * ### Using a write extension
 *
 * ```tsx
 * import { useSendTransaction } from "thirdweb/react";
 * import { mintTo } from "thirdweb/extensions/erc721";
 *
 * const { mutate: sendTx, data: transactionResult } = useSendTransaction();
 *
 * const onClick = () => {
 *   const transaction = mintTo({
 *     contract,
 *     to: "0x...",
 *     nft: {
 *       name: "NFT Name",
 *       description: "NFT Description",
 *       image: "https://example.com/image.png",
 *     },
 *   });
 *   sendTx(transaction);
 * };
 * ```
 *
 * ### Sending a prepared transaction
 *
 * ```tsx
 * import { useSendTransaction } from "thirdweb/react";
 * import { prepareTransaction } from "thirdweb";
 * import { sepolia } from "thirdweb/chains";
 *
 * const { mutate: sendTx, data: transactionResult } = useSendTransaction();
 *
 * const onClick = () => {
 *   // Send 0.1 SepoliaETH to an address
 *   const transaction = prepareTransaction({
 *     to: "0x...",
 *     value: toWei("0.1"),
 *     chain: sepolia,
 *     client: thirdwebClient,
 *     // Specify a token required for the transaction
 *     erc20Value: {
 *       amountWei: toWei("0.1"),
 *       tokenAddress: "0x...",
 *     },
 *   });
 *   sendTx(transaction);
 * };
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
        client={data.tx.client}
        localeId={payModal?.locale || "en_US"}
        modalMode={data.mode}
        onClose={() => {
          setRootEl(null);
          data.rejectTx(
            new Error("User rejected transaction by closing modal"),
          );
        }}
        onComplete={data.sendTx}
        onTxSent={data.resolveTx}
        payOptions={{
          buyWithCrypto: payModal?.buyWithCrypto,
          buyWithFiat: payModal?.buyWithFiat,
          metadata: payModal?.metadata,
          mode: "transaction",
          onPurchaseSuccess: payModal?.onPurchaseSuccess,
          purchaseData: payModal?.purchaseData,
          showThirdwebBranding: payModal?.showThirdwebBranding,
          transaction: data.tx,
        }}
        supportedTokens={payModal?.supportedTokens}
        theme={payModal?.theme || "dark"}
        title={payModal?.metadata?.name || "Transaction"}
        tx={data.tx}
        txId={randomBytesHex()}
      />,
    );
  };

  return useSendTransactionCore({
    gasless: config.gasless,
    showPayModal:
      !payModalEnabled || payModal === false ? undefined : showPayModal,
    switchChain,
    wallet,
  });
}
