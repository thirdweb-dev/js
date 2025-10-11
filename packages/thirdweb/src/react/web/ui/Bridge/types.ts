import type { Quote, TokenWithPrices } from "../../../../bridge/index.js";
import type { SupportedFiatCurrency } from "../../../../pay/convert/type.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";

export type DirectPaymentInfo = {
  sellerAddress: `0x${string}`;
  token: TokenWithPrices;
  amount: string;
  feePayer?: "sender" | "receiver";
};

export type ModeInfo =
  | {
      mode: "direct_payment";
      paymentInfo: DirectPaymentInfo;
    }
  | {
      mode: "transaction";
      transaction: PreparedTransaction;
    }
  | {
      mode: "fund_wallet";
    };

export type RequiredParams<T extends object, keys extends keyof T> = T & {
  [K in keys]-?: T[K];
};

/**
 * Payment method types with their required data
 */
export type PaymentMethod =
  | {
      type: "wallet";
      action: "buy" | "sell";
      payerWallet: Wallet;
      originToken: TokenWithPrices;
      balance: bigint;
      quote: Quote;
    }
  | {
      type: "fiat";
      payerWallet?: Wallet;
      currency: SupportedFiatCurrency;
      onramp: "stripe" | "coinbase" | "transak";
    };
