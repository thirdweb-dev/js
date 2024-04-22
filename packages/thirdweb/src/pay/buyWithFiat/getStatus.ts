import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import { getPayBuyWithFiatStatusEndpoint } from "../buyWithCrypto/utils/definitions.js";

// TODO: VERIFY THE TYPES !!!!

// TODO: add JSDoc description for all properties

/**
 * TODO
 */
export type GetBuyWithFiatStatusParams = {
  client: ThirdwebClient;
  intentId: string;
};

// convert the above JSON schema to TypeScript types
export type BuyWithFiatStatus =
  | {
      status: "NOT_FOUND";
    }
  | {
      status:
        | "PENDING_CRYPTO_SWAP"
        | "ON_RAMP_TRANSFER_COMPLETED"
        | "NONE"
        | "PENDING_PAYMENT"
        | "PAYMENT_FAILED"
        | "PENDING_ON_RAMP_TRANSFER"
        | "ON_RAMP_TRANSFER_IN_PROGRESS"
        | "ON_RAMP_TRANSFER_FAILED"
        | "CRYPTO_SWAP_REQUIRED"
        | "CRYPTO_SWAP_COMPLETED"
        | "CRYPTO_SWAP_IN_PROGRESS"
        | "CRYPTO_SWAP_FAILED";
      swapType: "SAME_CHAIN" | "CROSS_CHAIN" | "ON_RAMP";
      toAddress: string;
      bridge?: string;
      failureMessage?: string;
      quote: {
        estimatedToTokenAmount: string;
        estimatedOnRampAmount: string;
        estimatedOnRampAmountWei: string;
        estimatedToTokenAmountWei: string;
        fromCurrency: {
          amount: string;
          amountUnits: string;
          decimals: number;
          currencySymbol: string;
        };
        onRampToken: {
          chainId: number;
          tokenAddress: string;
          decimals: number;
          priceUSDCents: number;
          name: string;
          symbol: string;
        };
        toToken: {
          chainId: number;
          tokenAddress: string;
          decimals: number;
          priceUSDCents: number;
          name: string;
          symbol: string;
        };
        createdAt: string;
      };
      source: {
        transactionHash: string;
        token: {
          chainId: number;
          tokenAddress: string;
          decimals: number;
          priceUSDCents: number;
          name: string;
          symbol: string;
        };
        amount: string;
        amountWei: string;
        amountUSDCents: number;
        completedAt: string;
        explorerLink: string;
      };
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
