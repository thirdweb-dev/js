import type { PreparedTransaction } from "../../../../../../../transaction/prepare-transaction.js";

export type BuyForTx = {
  cost: bigint;
  balance: bigint;
  tx: PreparedTransaction;
  tokenSymbol: string;
};

export type SelectedScreen =
  | {
      type: "node";
      node: React.ReactNode;
    }
  | {
      type: "screen-id";
      name: "select-from-token" | "select-to-token" | "select-currency";
    }
  | {
      type: "main";
    }
  | {
      type: "select-currency";
    };
