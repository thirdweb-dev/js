import { type Store, createStore } from "../reactive/store.js";
import type { Hex } from "../utils/encoding/hex.js";

type StoredTransaction = {
  transactionHash: Hex;
  chainId: number;
};

const transactionsByAddress = new Map<string, Store<StoredTransaction[]>>();

/**
 * Retrieve the transaction store for a given address.
 * @param address - The address to retrieve the transaction store for.
 * @returns A store of transactions for the given account to subscribe to.
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
