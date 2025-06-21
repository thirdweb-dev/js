import {
  type SendTransactionConfig,
  useSendTransactionCore,
} from "../../../core/hooks/transaction/useSendTransaction.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { useSwitchActiveWalletChain } from "../../../core/hooks/wallets/useSwitchActiveWalletChain.js";

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
 * ### Gasless usage with [thirdweb Engine](https://portal.thirdweb.com/engine)
 * ```tsx
 * import { useSendTransaction } from "thirdweb/react";
 * const mutation = useSendTransaction({
 *   gasless: {
 *     provider: "engine",
 *     relayerUrl: "https://thirdweb.engine-***.thirdweb.com/relayer/***",
 *     relayerForwarderAddress: "0x...",
 *   }
 * });
 * ```
 *
 * ### Gasless usage with OpenZeppelin
 * ```tsx
 * import { useSendTransaction } from "thirdweb/react";
 * const mutation = useSendTransaction({
 *   gasless: {
 *     provider: "openzeppelin",
 *     relayerUrl: "https://...",
 *     relayerForwarderAddress: "0x...",
 *   }
 * });
 * @transaction
 */
export function useSendTransaction(config: SendTransactionConfig = {}) {
  void config; // TODO native pay modal
  const wallet = useActiveWallet();
  const switchChain = useSwitchActiveWalletChain();
  return useSendTransactionCore({
    switchChain,
    wallet,
  });
}
