import type { ThirdwebClient } from "../../../../../../client/client.js";
import { getSwapStatus } from "../../../../../../pay/swap/actions/getStatus.js";
import { createStore } from "../../../../../../reactive/store.js";
import { wait } from "../../../../../../utils/promise/wait.js";

type SwapTxInfo = {
  transactionHash: string;
  txExplorerLink: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  from: {
    symbol: string;
    value: string;
  };
  to: {
    symbol: string;
    value: string;
  };
};

// todo: remove after testing
// const test = {
//   transactionHash:
//     "0x5242005d31ce3c77b3cd72e1a403c413226d08f3071a2c82b3cc4f0071519547",
//   txExplorerLink:
//     "https://example.com/tx/0x5242005d31ce3c77b3cd72e1a403c413226d08f3071a2c82b3cc4f0071519547",
//   status: "PENDING",
//   from: {
//     symbol: "ETH",
//     value: "1",
//     icon: "https://example.com/icon.png",
//   },
//   to: {
//     symbol: "BTC",
//     value: "0.1",
//     icon: "https://example.com/icon.png",
//   },
// } as const;

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
      const res = await getSwapStatus({
        client: client,
        transactionHash: txInfo.transactionHash,
      });

      if (res.status === "COMPLETED" || res.status === "FAILED") {
        const value = swapTransactionsStore.getValue();
        const updatedValue = [...value];
        const oldValue = value[indexAdded];
        if (oldValue) {
          updatedValue[indexAdded] = {
            ...oldValue,
            status: res.status,
          };

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
