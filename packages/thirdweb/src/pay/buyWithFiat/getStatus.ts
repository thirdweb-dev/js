import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import { getPayBuyWithFiatStatusEndpoint } from "../utils/definitions.js";
import type {
  PayOnChainTransactionDetails,
  PayTokenInfo,
} from "../utils/commonTypes.js";
// TODO: VERIFY THE TYPES !!!!

// TODO: add JSDoc description for all properties

/**
 * TODO
 */
export type GetBuyWithFiatStatusParams = {
  client: ThirdwebClient;
  intentId: string;
};

export const OnRampStatus = {
  NONE: "NONE",
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  PENDING_ON_RAMP_TRANSFER: "PENDING_ON_RAMP_TRANSFER",
  ON_RAMP_TRANSFER_IN_PROGRESS: "ON_RAMP_TRANSFER_IN_PROGRESS",
  ON_RAMP_TRANSFER_COMPLETED: "ON_RAMP_TRANSFER_COMPLETED",
  ON_RAMP_TRANSFER_FAILED: "ON_RAMP_TRANSFER_FAILED",
  CRYPTO_SWAP_REQUIRED: "CRYPTO_SWAP_REQUIRED",
  CRYPTO_SWAP_COMPLETED: "CRYPTO_SWAP_COMPLETED",
  CRYPTO_SWAP_IN_PROGRESS: "CRYPTO_SWAP_IN_PROGRESS",
  CRYPTO_SWAP_FAILED: "CRYPTO_SWAP_FAILED",
};
export type OnRampStatus = (typeof OnRampStatus)[keyof typeof OnRampStatus];

export type FiatCurrencyInfo = {
  amount: string;
  amountUnits: string;
  decimals: number;
  currencySymbol: string;
};

// convert the above JSON schema to TypeScript types
export type BuyWithFiatStatus =
  | {
      status: "NOT_FOUND";
    }
  | {
      intentId: string;
      status: OnRampStatus;
      toAddress: string;
      quote: {
        estimatedOnRampAmount: string;
        estimatedOnRampAmountWei: string;

        estimatedToTokenAmount: string;
        estimatedToTokenAmountWei: string;

        fromCurrency: FiatCurrencyInfo;
        onRampToken: PayTokenInfo;
        toToken: PayTokenInfo;
        createdAt: string;
      };
      source?: PayOnChainTransactionDetails;
      destination?: PayOnChainTransactionDetails;
      failureMessage?: string;
    };

/**
 * TODO
 * @buyFiat
 */
export async function getBuyWithFiatStatus(
  params: GetBuyWithFiatStatusParams,
): Promise<BuyWithFiatStatus> {
  try {
    const queryParams = new URLSearchParams({
      intentId: params.intentId,
    });

    const queryString = queryParams.toString();
    const url = `${getPayBuyWithFiatStatusEndpoint()}?${queryString}`;

    const response = await getClientFetch(params.client)(url);

    if (!response.ok) {
      const errorObj = await response.json();
      if (
        errorObj &&
        "error" in errorObj &&
        typeof errorObj.error === "object" &&
        "message" in errorObj.error
      ) {
        throw new Error(errorObj.error.message);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()).result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
