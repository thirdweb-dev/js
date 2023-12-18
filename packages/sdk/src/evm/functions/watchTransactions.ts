import type { SharedBlockParams } from "./getBlock";
import { watchBlockWithTransactions } from "./watchBlock";
import type { BlockWithTransactions } from "@ethersproject/abstract-provider";
import type { Transaction } from "ethers";

export type WatchTransactionsParams = SharedBlockParams & {
  onTransactions: (transactions: Transaction[]) => void;
} & { address: string };

/**
 * Watch for transactions to or from a given address.
 *
 * @example
 * ```javascript
 * // this will log out the new transactions every time a new block is finalized
 * const unsubscribe = watchTransactions({
 *   network: "ethereum",
 *   address: "0x1234",
 *   onTransactions: (transactions) => {
 *     console.log("new transactions", transactions);
 *   }
 * });
 * // later on you can call unsubscribe to stop listening for new transactions
 * unsubscribe();
 * ```
 *
 * @returns An unsubscribe function that will stop listening for new transactions when called
 * @public
 */
export function watchTransactions({
  address,
  onTransactions,
  ...sharedBlockParams
}: WatchTransactionsParams) {
  // compute the toLowerCase address once so we don't have to do it on every block / transaction
  const lcAddress = address.toLowerCase();
  function onBlock(block: BlockWithTransactions) {
    const transactions = block.transactions.filter((tx) => {
      // match on from first because it's guaranteed to exist
      if (tx.from.toLowerCase() === lcAddress) {
        // if we have a from address match on that then return true and early exit
        return true;
      }
      // if we have a to address match on that and if it doesn't match then we want to return false anyways :)
      return tx.to?.toLowerCase() === lcAddress;
    });
    // only call the callback if we have transactions to report
    if (transactions.length > 0) {
      onTransactions(transactions);
    }
  }

  return watchBlockWithTransactions({
    ...sharedBlockParams,
    onBlock,
  });
}
