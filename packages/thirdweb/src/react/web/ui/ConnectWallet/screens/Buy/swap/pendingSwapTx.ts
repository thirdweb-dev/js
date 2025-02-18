import { createStore } from "../../../../../../../reactive/store.js";

type PendingTxInfo =
  | {
      type: "swap";
      txHash: string;
      chainId: number;
    }
  | {
      type: "fiat";
      intentId: string;
    };

export const pendingTransactions = /* @__PURE__ */ createStore<PendingTxInfo[]>(
  [],
);

/**
 * @internal
 */
export const addPendingTx = (txInfo: PendingTxInfo) => {
  const currentValue = pendingTransactions.getValue();
  // prepend the new tx to list
  pendingTransactions.setValue([txInfo, ...currentValue]);
};
