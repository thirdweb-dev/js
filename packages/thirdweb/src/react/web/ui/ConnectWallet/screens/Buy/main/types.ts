import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import type { GetWalletBalanceResult } from "../../../../../../../wallets/utils/getWalletBalance.js";
import type { Currency } from "../../../../../../core/hooks/connection/ConnectButtonProps.js";

export type TransactionCostAndData = {
  currency: Currency;
  walletBalance: GetWalletBalanceResult;
  transactionValueWei: bigint;
  gasCostWei: bigint;
};

export type SelectedScreen =
  | {
      id: "main" | "select-payment-method" | "buy-with-fiat";
    }
  | {
      id: "buy-with-crypto";
      payDisabled?: boolean;
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
