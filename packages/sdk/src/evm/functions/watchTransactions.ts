import type { SharedBlockParams } from "./getBlock";
import { watchBlockWithTransactions } from "./watchBlock";
import type { BlockWithTransactions } from "@ethersproject/abstract-provider";
import type { Transaction } from "ethers";

export type WatchTransactionsParams =
  | SharedBlockParams & {
      onTransactions: (transactions: Transaction[]) => void;
    } & { address: string };

export function watchTransactions(params: WatchTransactionsParams) {
  function onBlock(block: BlockWithTransactions) {
    const transactions = block.transactions.filter((tx) => {
      if (
        tx.to?.toLowerCase() === params.address.toLowerCase() ||
        tx.from?.toLowerCase() === params.address.toLowerCase()
      ) {
        return true;
      }
      // if neither matches we should filter it out
      return false;
    });
    if (transactions.length > 0) {
      params.onTransactions(transactions);
    }
  }

  return watchBlockWithTransactions({
    network: params.network,
    sdkOptions: params.sdkOptions,
    onBlock,
  });
}
