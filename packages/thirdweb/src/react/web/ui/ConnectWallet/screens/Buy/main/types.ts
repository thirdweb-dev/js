import type { PreparedTransaction } from "../../../../../../../transaction/prepare-transaction.js";

export type BuyForTx = {
  cost: string;
  balance: string;
  tokenSymbol: string;
  token?: {
    name: string;
    symbol: string;
    address: string;
    icon?: string;
  };
  tx: PreparedTransaction;
  isCostOverridden: boolean;
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
    };
