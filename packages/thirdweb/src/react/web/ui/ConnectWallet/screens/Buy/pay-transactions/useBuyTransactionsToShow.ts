import type { ValidBuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import type { ValidBuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";

export type TxStatusInfo =
  | {
      type: "swap";
      status: ValidBuyWithCryptoStatus;
    }
  | {
      type: "fiat";
      status: ValidBuyWithFiatStatus;
    };
