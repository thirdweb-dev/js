import {
  getBuyWithCryptoStatus,
  type BuyWithCryptoStatus,
} from "@thirdweb-dev/sdk";
import { wait } from "../../../../../utils/wait";

type ValidBuyWithCryptoStatus = Exclude<
  BuyWithCryptoStatus,
  { status: "NOT_FOUND" }
>;

type SwapTxInfo = {
  transactionHash: string;
  status: ValidBuyWithCryptoStatus["status"];
  subStatus?: ValidBuyWithCryptoStatus["subStatus"];
  source: {
    symbol: string;
    value: string;
    chainId: number;
  };
  destination: {
    symbol: string;
    value: string;
    chainId: number;
  };
};

export type Store<T> = {
  getValue(): T;
  setValue(newValue: T): void;
  subscribe(listener: () => void): () => void;
};

/**
 * Create a reactive value store
 * @param initialValue - The initial value to store
 * @example
 * ```ts
 * const store = createStore(0);
 * ```
 * @returns A store object
 * @internal
 */
export function createStore<T>(initialValue: T): Store<T> {
  type Listener = () => void;
  const listeners = new Set<Listener>();

  let value = initialValue;

  const notify = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  return {
    getValue() {
      return value;
    },
    setValue(newValue: T) {
      value = newValue;
      notify();
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

// array of transaction hashes
export const swapTransactionsStore = /* @__PURE__ */ createStore<SwapTxInfo[]>(
  [],
);

/**
 * @internal
 */
export const addPendingSwapTransaction = (
  clientId: string,
  txInfo: SwapTxInfo,
) => {
  const currentValue = swapTransactionsStore.getValue();
  const indexAdded = currentValue.length;

  // add it
  swapTransactionsStore.setValue([...currentValue, txInfo]);

  // poll for it's status and update the store when we know it's status
  const maxRetries = 50;
  let retryCount = 0;

  async function tryToGetStatus() {
    // keep polling for the transaction status every 5 seconds until maxRetries
    await wait(5000);
    try {
      retryCount++;
      const res = await getBuyWithCryptoStatus({
        clientId: clientId,
        transactionHash: txInfo.transactionHash,
      });

      if (res.status === "COMPLETED" || res.status === "FAILED") {
        const value = swapTransactionsStore.getValue();
        const updatedValue = [...value];
        const oldValue = value[indexAdded];
        if (oldValue) {
          const newValue = {
            ...oldValue,
            status: res.status,
            subStatus: res.subStatus,
          };
          updatedValue[indexAdded] = newValue;

          // in case - the destination token is different ( happens when tx is partially successful )
          if (res.destination) {
            newValue.destination = {
              symbol: res.destination.token.symbol || "",
              value: res.destination.amount,
              chainId: res.destination.token.chainId,
            };
          }

          swapTransactionsStore.setValue(updatedValue);
        }

        return; // stop
      }
    } catch {
      // ignore
    }

    if (retryCount < maxRetries) {
      await tryToGetStatus();
    }
  }

  tryToGetStatus();
};
