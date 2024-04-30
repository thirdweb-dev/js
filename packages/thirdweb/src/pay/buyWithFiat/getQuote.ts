import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import { getPayBuyWithFiatQuoteEndpoint } from "../utils/definitions.js";

export const OnRampProvider = {
  STRIPE: "STRIPE",
} as const;

export type OnRampProvider =
  (typeof OnRampProvider)[keyof typeof OnRampProvider];

/**
 * TODO
 */
export type GetBuyWithFiatQuoteParams = {
  client: ThirdwebClient;
  // required
  fromAddress: string;
  toAddress: string;
  toChainId: number;
  toTokenAddress: string;
  fromCurrencySymbol: string;
  provider: OnRampProvider;

  // optional
  maxSlippageBPS?: number | undefined;
  fromAmount?: string | undefined;
  toAmount?: string | undefined;
  isTestMode?: boolean | undefined; // defaults to false
};

export type BuyWithFiatQuote = {
  estimatedDurationSeconds: number;
  estimatedToAmountMin: string;
  estimatedToAmountMinWei: string;
  fromCurrency: {
    amount: string;
    amountUnits: string;
    decimals: number;
    currencySymbol: string;
  };
  fromCurrencyWithFees: {
    amount: string;
    amountUnits: string;
    decimals: number;
    currencySymbol: string;
  };
  toToken: {
    symbol?: string | undefined;
    priceUSDCents?: number | undefined;
    name?: string | undefined;
    chainId: number;
    tokenAddress: string;
    decimals: number;
  };
  toAddress: string;
  maxSlippageBPS: number;
  intentId: string;
  toAmountMinWei: string;
  toAmountMin: string;
  processingFees: {
    amount: string;
    amountUnits: string;
    decimals: number;
    currencySymbol: string;
    feeType: "ON_RAMP" | "NETWORK";
  }[];
  onRampToken: {
    amount: string;
    amountWei: string;
    amountUSDCents: number;
    token: {
      chainId: number;
      decimals: number;
      name: string;
      priceUSDCents: number;
      symbol: string;
      tokenAddress: string;
    };
  };

  onRampLink: string;
};

/**
 * TODO
 * @buyFiat
 */
export async function getBuyWithFiatQuote(
  params: GetBuyWithFiatQuoteParams,
): Promise<BuyWithFiatQuote> {
  try {
    const queryParams = new URLSearchParams({
      fromAddress: params.fromAddress,
      toAddress: params.toAddress,
      fromCurrencySymbol: params.fromCurrencySymbol,
      toChainId: params.toChainId.toString(),
      toTokenAddress: params.toTokenAddress.toLowerCase(),
      provider: params.provider,
    });

    if (params.fromAmount) {
      queryParams.append("fromAmount", params.fromAmount);
    }

    if (params.toAmount) {
      queryParams.append("toAmount", params.toAmount);
    }

    if (params.maxSlippageBPS) {
      queryParams.append("maxSlippageBPS", params.maxSlippageBPS.toString());
    }

    if (params.isTestMode) {
      queryParams.append("isTestMode", params.isTestMode.toString());
    }

    const queryString = queryParams.toString();
    const url = `${getPayBuyWithFiatQuoteEndpoint()}?${queryString}`;

    const response = await getClientFetch(params.client)(url);

    // Assuming the response directly matches the SwapResponse interface
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
