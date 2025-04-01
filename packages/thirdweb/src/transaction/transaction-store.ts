import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { type Store, createStore } from "../reactive/store.js";
import { getThirdwebDomains } from "../utils/domains.js";
import type { Hex } from "../utils/encoding/hex.js";
import { getClientFetch } from "../utils/fetch.js";

export type StoredTransaction = {
  transactionHash: Hex;
  chainId: number;
  receipt?: {
    status: "success" | "failed";
    to: string;
  };
};

const transactionsByAddress = new Map<string, Store<StoredTransaction[]>>();

/**
 * Retrieve the transaction store for a given address.
 * @param address - The address to retrieve the transaction store for.
 * @returns A store of transactions for the given account to subscribe to.
 * @transaction
 * @example
 * ```ts
 * import { getTransactionStore } from "thirdweb/transaction";
 *
 * const store = getTransactionStore("0x...");
 * store.subscribe((transactions) => {
 *   console.log(transactions);
 * });
 * ```
 */
export function getTransactionStore(
  address: string,
): Store<StoredTransaction[]> {
  const existingStore = transactionsByAddress.get(address);
  if (existingStore) {
    return existingStore;
  }

  const newStore = createStore<StoredTransaction[]>([]);
  transactionsByAddress.set(address, newStore);

  return newStore;
}

/**
 * @internal
 */
export function addTransactionToStore(options: {
  address: string;
  transactionHash: Hex;
  chainId: number;
}) {
  const { address, transactionHash, chainId } = options;
  const tranasctionStore = getTransactionStore(address);

  tranasctionStore.setValue([
    ...tranasctionStore.getValue(),
    { transactionHash, chainId },
  ]);

  transactionsByAddress.set(address, tranasctionStore);
}

/**
 * @internal for now
 */
export async function getPastTransactions(options: {
  walletAddress: string;
  chain: Chain;
  client: ThirdwebClient;
}): Promise<StoredTransaction[]> {
  const { walletAddress, chain, client } = options;
  const oneMonthsAgoInSeconds = Math.floor(
    (Date.now() - 1 * 30 * 24 * 60 * 60 * 1000) / 1000,
  );
  const url = new URL(
    `https://${getThirdwebDomains().insight}/v1/wallets/${walletAddress}/transactions`,
  );
  url.searchParams.set("limit", "10");
  url.searchParams.set("chain", chain.id.toString());
  url.searchParams.set(
    "filter_block_timestamp_gte",
    oneMonthsAgoInSeconds.toString(),
  );
  const clientFetch = getClientFetch(client);
  const result = await clientFetch(url.toString());
  const json = (await result.json()) as {
    data: {
      chain_id: number;
      hash: string;
      status: number;
      to_address: string;
    }[];
  };
  return json.data.map((tx) => ({
    transactionHash: tx.hash as Hex,
    chainId: tx.chain_id,
    receipt: {
      status: tx.status === 1 ? "success" : "failed",
      to: tx.to_address,
    },
  }));
}
