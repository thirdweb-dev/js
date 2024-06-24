import type { PreparedTransaction } from "../../../../../../../transaction/prepare-transaction.js";

export type BuyForTx = {
  cost: bigint;
  balance: bigint;
  tx: PreparedTransaction;
  tokenSymbol: string;
};

export type SelectedScreen =
  | {
      id: "node";
      node: React.ReactNode;
    }
  | {
      id:
        | "main"
        | "select-payment-method"
        | "buy-with-fiat"
        | "buy-with-crypto";
    }
  | {
      id: "select-from-token";
      backScreen: SelectedScreen;
    }
  | {
      id: "select-to-token";
      backScreen: SelectedScreen;
    }
  | {
      id: "select-currency";
      backScreen: SelectedScreen;
    };
