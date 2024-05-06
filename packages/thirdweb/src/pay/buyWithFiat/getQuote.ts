import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import { getPayBuyWithFiatQuoteEndpoint } from "../utils/definitions.js";

/**
 * Parameters accepted by the [`getBuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatQuote) function for getting a quote to buy a token with fiat currency.
 */
export type GetBuyWithFiatQuoteParams = {
  // required

  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   */
  client: ThirdwebClient;

  /**
   * The address of the wallet to which the tokens will be sent.
   */
  toAddress: string;

  /**
   * Chain id of the token to buy.
   */
  toChainId: number;

  /**
   * Token address of the token to buy.
   */
  toTokenAddress: string;

  /**
   * Symbol of the fiat currency to buy the token with.
   *
   * For "STRIPE" provider - only "USD" is supported.
   */
  fromCurrencySymbol: "USD";

  /**
   * On-ramp provider to use for buying the token.
   *
   * Currently, only "STRIPE" is supported.
   */
  provider: "STRIPE";

  // optional
  /**
   * The maximum slippage in basis points (bps) allowed for the swap.
   * For example, if you want to allow a maximum slippage of 0.5%, you should specify `50` bps.
   */
  maxSlippageBPS?: number;

  /**
   * The amount of fiat currency to spend to buy the token.
   * This is useful if you want to buy whatever amount of token you can get for a certain amount of fiat currency.
   *
   * If you want a certain amount of token, you can provide `toAmount` instead of `fromAmount`.
   */
  fromAmount?: string;

  /**
   * The amount of token to buy
   * This is useful if you want to get a certain amount of token.
   *
   * If you want to buy however much token you can get for a certain amount of fiat currency, you can provide `fromAmount` instead of `toAmount`.
   */
  toAmount?: string;

  /**
   * Whether to use on-ramp provider in test mode for testing purpose.
   *
   * Defaults to false.
   */
  isTestMode?: boolean;
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
 * Get a quote of type [`GetBuyWithFiatQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetBuyWithFiatQuoteParams) to buy given token with fiat currency.
 * This quote contains the information about the swap such as token amounts, processing fees, estimated time etc.
 *
 * Once you have the quote, you can open the `quote.onRampLink` in a new tab - This will prompt the user to buy the token with fiat currency and handle the rest of the process.
 *
 * In your page, you can start polling for the status using [`getBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatStatus) to get the status of the transaction.
 * Refer to [`getBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatStatus) to learn more about next steps.
 *
 * @param params - object of type [`GetBuyWithFiatQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetBuyWithFiatQuoteParams)
 * @returns Object of type [`BuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatQuote) which contains the information about the quote such as processing fees, estimated time, converted token amounts, etc.
 * @example
 *
 * Assume that you want to get a quote for buying  10 USDC on polygon chain (chainId: 137) with USD fiat currency using the Stripe provider. To do this, you can use the following code:
 *
 * ```ts
 * import { getBuyWithFiatQuote } from "thirdweb/pay";
 *
 * const quote = await getBuyWithFiatQuote({
 *  client: client, // thirdweb client
 *  provider: "STRIPE", // on-ramp provider
 *  fromCurrencySymbol: "USD", // fiat currency symbol
 *  toChainId: 137, // polygon chain id
 *  toAmount: "10", // amount of USDC to buy
 *  toTokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" // USDC token address in polygon chain
 *  toAddress: "0x...", // user's wallet address
 *  isTestMode: false, // whether to use stripe in test mode for testing purpose (defaults to false)
 * });
 *
 * window.open(quote.onRampLink, "_blank");
 *
 * // keep polling for the status of this using getBuyWithFiatStatus
 * // refer to getBuyWithFiatStatus to learn more about next steps
 * ```
 * @buyFiat
 */
export async function getBuyWithFiatQuote(
  params: GetBuyWithFiatQuoteParams,
): Promise<BuyWithFiatQuote> {
  try {
    const queryParams = new URLSearchParams({
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
      if (errorObj && "error" in errorObj) {
        throw errorObj;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()).result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
