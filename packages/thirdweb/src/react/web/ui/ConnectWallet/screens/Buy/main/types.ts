import type { ChainMetadata } from "../../../../../../../chains/types.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import { Buy } from "../../../../../../../bridge/index.js";
import type { GetWalletBalanceResult } from "../../../../../../../wallets/utils/getWalletBalance.js";
import type { TokenInfo } from "../../../../../../core/utils/defaultTokens.js";

export type TransactionCostAndData = {
  token: TokenInfo;
  decimals: number;
  walletBalance: GetWalletBalanceResult;
  transactionValueWei: bigint;
  gasCostWei: bigint;
  chainMetadata: ChainMetadata;
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
      quote: Buy.prepare.Result;
    }
  | {
      id: "fiat-flow";
      quote: BuyWithFiatQuote;
    }
  | {
      id: "transfer-flow";
    }
  | {
      id: "connect-payer-wallet";
      backScreen: SelectedScreen;
    };
