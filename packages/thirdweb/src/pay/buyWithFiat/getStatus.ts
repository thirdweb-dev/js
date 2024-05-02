import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import type {
  PayOnChainTransactionDetails,
  PayTokenInfo,
} from "../utils/commonTypes.js";
import { getPayBuyWithFiatStatusEndpoint } from "../utils/definitions.js";

/**
 * TODO
 */
export type GetBuyWithFiatStatusParams = {
  client: ThirdwebClient;
  intentId: string;
};

export type FiatCurrencyInfo = {
  amount: string;
  amountUnits: string;
  decimals: number;
  currencySymbol: string;
};

export type ValidBuyWithFiatStatus = Exclude<
  BuyWithFiatStatus,
  { status: "NOT_FOUND" }
>;

export type BuyWithFiatStatus =
  | {
      status: "NOT_FOUND";
    }
  | {
      intentId: string;
      status:
        | "NONE"
        | "PENDING_PAYMENT"
        | "PAYMENT_FAILED"
        | "PENDING_ON_RAMP_TRANSFER"
        | "ON_RAMP_TRANSFER_IN_PROGRESS"
        | "ON_RAMP_TRANSFER_COMPLETED"
        | "ON_RAMP_TRANSFER_FAILED"
        | "CRYPTO_SWAP_REQUIRED"
        | "CRYPTO_SWAP_COMPLETED"
        | "CRYPTO_SWAP_FALLBACK"
        | "CRYPTO_SWAP_IN_PROGRESS"
        | "CRYPTO_SWAP_FAILED";
      toAddress: string;
      quote: {
        estimatedOnRampAmount: string;
        estimatedOnRampAmountWei: string;

        estimatedToTokenAmount: string;
        estimatedToTokenAmountWei: string;

        fromCurrency: FiatCurrencyInfo;
        fromCurrencyWithFees: FiatCurrencyInfo;
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
