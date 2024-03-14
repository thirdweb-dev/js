import { track } from "../../../../../../analytics/track.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import type { SwapQuote } from "../../../../../../pay/quote/actions/getQuote.js";
import { getQuoteStatus } from "../../../../../../pay/quote/actions/getStatus.js";
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
  quote: SwapQuote,
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
      const res = await getQuoteStatus({
        client: client,
        transactionHash: txInfo.transactionHash,
      });

      if (res.status === "COMPLETED" || res.status === "FAILED") {
        track(client, {
          source: "ConnectButton",
          action:
            res.status === "COMPLETED"
              ? "swapStatus.success"
              : "swapStatus.failed",
          quote: quote,
          tx: {
            hash: txInfo.transactionHash,
          },
        });

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
    } else {
      track(client, {
        source: "ConnectButton",
        action: "swapStatus.timeout",
        quote: quote,
        tx: {
          hash: txInfo.transactionHash,
        },
      });
    }
  }

  tryToGetStatus();
};
