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
  quoteId: string;
};

// convert the above JSON schema to TypeScript types
export type BuyWithFiatStatus =
  | {
      status: "NOT_FOUND";
    }
  | {
      status: "NONE" | "PENDING" | "FAILED" | "COMPLETED";
      subStatus:
        | "NONE"
        | "WAITING_BRIDGE"
        | "REVERTED_ON_CHAIN"
        | "SUCCESS"
        | "PARTIAL_SUCCESS"
        | "UNKNOWN_ERROR";
      fromAddress: string;
      toAddress: string;
      bridge?: string;
      failureMessage?: string;
      destination?: {
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
      quote: {
        fromToken: {
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
        fromAmountWei: string;
        fromAmount: string;
        toAmountWei: string;
        toAmount: string;
        toAmountMin: string;
        toAmountMinWei: string;
        estimated: {
          fromAmountUSDCents: number;
          toAmountMinUSDCents: number;
          toAmountUSDCents: number;
          slippageBPS: number;
          feesUSDCents: number;
          gasCostUSDCents: number;
          durationSeconds: number;
        };
        createdAt: string;
      };
      swapType: "SAME_CHAIN" | "CROSS_CHAIN" | "ON_RAMP";
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
      transactionId: params.quoteId,
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
