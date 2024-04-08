import type { ThirdwebClient } from "../../../../../../../client/client.js";
import {
  type BuyWithCryptoStatuses,
  type BuyWithCryptoSubStatuses,
  getBuyWithCryptoStatus,
} from "../../../../../../../pay/buyWithCrypto/actions/getStatus.js";
import { createStore } from "../../../../../../../reactive/store.js";
import { wait } from "../../../../../../../utils/promise/wait.js";

type SwapTxInfo = {
  transactionHash: string;
  status: BuyWithCryptoStatuses;
  subStatus?: BuyWithCryptoSubStatuses;
  from: {
    symbol: string;
    value: string;
    chainId: number;
  };
  to: {
    symbol: string;
    value: string;
  };
};

// array of transaction hashes
export const swapTransactionsStore = /* @__PURE__ */ createStore<SwapTxInfo[]>(
  [],
);

/**
 * @internal
 */
export const addPendingSwapTransaction = (
  client: ThirdwebClient,
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
        client: client,
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
            newValue.to = {
              symbol: res.destination.token.symbol || "",
              value: res.destination.amount,
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
