import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import type { PreparedTransaction } from "../../../../../../../transaction/prepare-transaction.js";

export type BuyForTx = {
  cost: bigint;
  balance: bigint;
  tx: PreparedTransaction;
  tokenSymbol: string;
};

export type SelectedScreen =
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
    }
  | {
      id: "swap-flow";
      quote: BuyWithCryptoQuote;
    }
  | {
      id: "fiat-flow";
      quote: BuyWithFiatQuote;
      openedWindow: Window | null;
    }
  | {
      id: "connect-payer-wallet";
      backScreen: SelectedScreen;
    };
