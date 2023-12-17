import {
  watchTransactions,
  WatchTransactionsParams,
} from "@thirdweb-dev/sdk/evm/functions";
import type { Transaction } from "ethers";
import { useEffect, useState } from "react";

/**
 * @others
 */
export type UseWatchTransactionsParams = Partial<
  Omit<WatchTransactionsParams, "onTransactions">
> & { limit?: number };

/**
 * Hook that listens to transactions on a given chain for a given address.
 *
 * ```javascript
 * import { useWatchTransactions } from "@thirdweb-dev/react"
 * ```
 *
 * @example
 * ```js
 * const transactions = useWatchTransactions({
 *  address: "0x1234",
 *  network: "ethereum",
 * });
 * ```
 *
 * @param watchTransactionParams - Options for watching transactions
 *
 * ### address
 *
 * The address to watch transactions for
 *
 * ### network
 *
 * The network to watch transactions on
 *
 * ### sdkOptions
 *
 * Options to pass to the thirdweb SDK
 *
 * @returns an array of `Transaction` objects
 * @others
 */
export function useWatchTransactions(
  watchTransactionParams: UseWatchTransactionsParams,
) {
  const {
    address,
    network,
    sdkOptions,
    // default to 1000, max 10k
    limit: paramLimit = 1000,
  } = watchTransactionParams;
  // max limit of 10k transactions to let the array grow to, then we'll start dropping the oldest ones
  const limit = Math.min(paramLimit, 10000);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    if (!address || !network) {
      // cant run yet
      return;
    }
    // since this already returns a function to unsubscribe, we can just return it
    return watchTransactions({
      address,
      network,
      sdkOptions,
      onTransactions: (newTransactions) => {
        setTransactions((prevTransactions) => {
          const mergedTxns = [...newTransactions, ...prevTransactions];
          // only keep the latest transactions
          return mergedTxns.slice(0, limit);
        });
      },
    });
  }, [address, limit, network, sdkOptions]);

  return transactions;
}
