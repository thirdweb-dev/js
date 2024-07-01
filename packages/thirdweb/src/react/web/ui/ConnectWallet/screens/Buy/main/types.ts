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
      id: "fiatFlow";
      quote: BuyWithFiatQuote;
    }
  | {
      id: "swapFlow";
      quote: BuyWithCryptoQuote;
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
