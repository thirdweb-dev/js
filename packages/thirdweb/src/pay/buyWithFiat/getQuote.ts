import { prepare as prepareOnramp } from "../../bridge/Onramp.js";
import { getCachedChain } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { getContract } from "../../contract/contract.js";
import { decimals } from "../../extensions/erc20/read/decimals.js";
import type { CurrencyMeta } from "../../react/web/ui/ConnectWallet/screens/Buy/fiat/currencies.js";
import { toTokens, toUnits } from "../../utils/units.js";
import type { PurchaseData } from "../types.js";
import type { FiatProvider, PayTokenInfo } from "../utils/commonTypes.js";
/**
 * Parameters for [`getBuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatQuote) function
 * @deprecated
 * @buyCrypto
 */
export type GetBuyWithFiatQuoteParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   */
  client: ThirdwebClient;

  /**
   * The address of the wallet where the tokens will be sent.
   */
  toAddress: string;

  /**
   * The address of the wallet which will be used to buy the token.
   */
  fromAddress: string;

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
   */
  fromCurrencySymbol: CurrencyMeta["shorthand"];

  /**
   * The maximum slippage in basis points (bps) allowed for the transaction.
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
   * Whether to use on-ramp provider in test mode for testing purpose or not.
   *
   * Defaults to `false`
   */
  isTestMode?: boolean;

  /**
   * Extra details to store with the purchase.
   *
   * This details will be stored with the purchase and can be retrieved later via the status API or Webhook
   */
  purchaseData?: PurchaseData;

  /**
   * Optional parameter to onramp gas with the purchase
   * If native token, will onramp extra native token amount
   * If erc20, will onramp native token + erc20
   */
  toGasAmountWei?: string;

  /**
   * Optional parameter to specify the preferred onramp provider.
   *
   * By default, we choose a recommended provider based on the location of the user, KYC status, and currency.
   */
  preferredProvider?: FiatProvider;

  /**
   * @hidden
   */
  paymentLinkId?: string;

  onrampChainId?: number;
  onrampTokenAddress?: string;
};

/**
 * The response object returned by the [`getBuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatQuote) function.
 *
 * This includes various information for buying a token using a fiat currency:
 * - on-ramp provider UI link
 * - The estimated time for the transaction to complete.
 * - The on-ramp and destination token information.
 * - Processing fees
 *
 * @deprecated
 * @buyCrypto
 */
export type BuyWithFiatQuote = {
  /**
   * Estimated time for the transaction to complete in seconds.
   */
  estimatedDurationSeconds: number;
  /**
   * Minimum amount of token that is expected to be received in units.
   */
  estimatedToAmountMin: string;
  /**
   * Minimum amount of token that is expected to be received in wei.
   */
  estimatedToAmountMinWei: string;
  /**
   * Amount of token that is expected to be received in units.
   *
   * (estimatedToAmountMinWei - maxSlippageWei)
   */
  toAmountMinWei: string;
  /**
   * Amount of token that is expected to be received in wei.
   *
   * (estimatedToAmountMin - maxSlippageWei)
   */
  toAmountMin: string;
  /**
   * fiat currency used to buy the token - excluding the fees.
   */
  fromCurrency: {
    amount: string;
    amountUnits: string;
    decimals: number;
    currencySymbol: string;
  };
  /**
   * Fiat currency used to buy the token - including the fees.
   */
  fromCurrencyWithFees: {
    amount: string;
    amountUnits: string;
    decimals: number;
    currencySymbol: string;
  };
  /**
   * Token information for the desired token. (token the user wants to buy)
   */
  toToken: PayTokenInfo;
  /**
   * Address of the wallet to which the tokens will be sent.
   */
  toAddress: string;
  /**
   * Address of the wallet used for buying the token.
   */
  fromAddress: string;
  /**
   * The maximum slippage in basis points (bps) allowed for the transaction.
   */
  maxSlippageBPS: number;
  /**
   * Id of transaction
   */
  intentId: string;
  /**
   * Array of processing fees for the transaction.
   *
   * This includes the processing fees for on-ramp and swap (if required).
   */
  processingFees: {
    amount: string;
    amountUnits: string;
    decimals: number;
    currencySymbol: string;
    feeType: "ON_RAMP" | "NETWORK";
  }[];
  /**
   * Token that will be sent to the user's wallet address by the on-ramp provider.
   *
   * If the token is same as `toToken` - the user can directly buy the token from the on-ramp provider.
   * If not, the user will receive this token and a swap is required to convert it `toToken`.
   */
  onRampToken: {
    amount: string;
    amountWei: string;
    amountUSDCents: number;
    token: PayTokenInfo;
  };

  /**
   * Routing token that will be swapped from the on-ramp token, so that it can be bridged to the destination token.
   */
  routingToken?: {
    amount: string;
    amountWei: string;
    amountUSDCents: number;
    token: PayTokenInfo;
  };

  /**
   * Link to the on-ramp provider UI that will prompt the user to buy the token with fiat currency.
   *
   * This link should be opened in a new tab.
   * @example
   * ```ts
   * window.open(quote.onRampLink, "_blank");
   * ```
   *
   */
  onRampLink: string;

  /**
   * The provider that was used to get the quote.
   */
  provider: FiatProvider;
};

/**
 * Get a quote of type [`BuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatQuote) to buy given token with fiat currency.
 * This quote contains the information about the swap such as token amounts, processing fees, estimated time etc.
 *
 * ### Rendering the On-Ramp provider UI
 * Once you have the `quote`, you can open the `quote.onRampLink` in a new tab - This will prompt the user to buy the token with fiat currency
 *
 * ### Determining the steps required
 * If `quote.onRampToken.token` is same as `quote.toToken` ( same chain + same token address ) - This means that the token can be directly bought from the on-ramp provider.
 * But if they are different, On-ramp provider will send the `quote.onRampToken` to the user's wallet address and a swap is required to swap it to the desired token onchain.
 *
 * You can use the [`isSwapRequiredPostOnramp`](https://portal.thirdweb.com/references/typescript/v5/isSwapRequiredPostOnramp) utility function to check if a swap is required after the on-ramp is done.
 *
 * ### Polling for the status
 * Once you open the `quote.onRampLink` in a new tab, you can start polling for the status using [`getBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatStatus) to get the status of the transaction.
 *
 * `getBuyWithFiatStatus` returns a status object of type [`BuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatStatus).
 *
 * - If no swap is required - the status will become `"ON_RAMP_TRANSFER_COMPLETED"` once the on-ramp provider has sent the desired token to the user's wallet address. Once you receive this status, the process is complete.
 * - If a swap is required - the status will become `"CRYPTO_SWAP_REQUIRED"` once the on-ramp provider has sent the tokens to the user's wallet address. Once you receive this status, you need to start the swap process.
 *
 * ### Swap Process
 * On receiving the `"CRYPTO_SWAP_REQUIRED"` status, you can use the [`getPostOnRampQuote`](https://portal.thirdweb.com/references/typescript/v5/getPostOnRampQuote) function to get the quote for the swap of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote).
 *
 * Once you have this quote - You can follow the same steps as mentioned in the [`getBuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoQuote) documentation to perform the swap.
 *
 * @param params - object of type [`GetBuyWithFiatQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetBuyWithFiatQuoteParams)
 * @returns Object of type [`BuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatQuote) which contains the information about the quote such as processing fees, estimated time, converted token amounts, etc.
 * @example
 * Get a quote for buying 10 USDC on polygon chain (chainId: 137) with USD fiat currency:
 *
 * ```ts
 * import { getBuyWithFiatQuote } from "thirdweb/pay";
 *
 * const quote = await getBuyWithFiatQuote({
 *  client: client, // thirdweb client
 *  fromCurrencySymbol: "USD", // fiat currency symbol
 *  toChainId: 137, // polygon chain id
 *  toAmount: "10", // amount of USDC to buy
 *  toTokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" // USDC token address in polygon chain
 *  toAddress: "0x...", // user's wallet address
 *  isTestMode: false, // whether to use onramp in test mode for testing purpose (defaults to false)
 * });
 *
 * window.open(quote.onRampLink, "_blank");
 * ```
 * @deprecated
 * @buyCrypto
 */
export async function getBuyWithFiatQuote(
  params: GetBuyWithFiatQuoteParams,
): Promise<BuyWithFiatQuote> {
  try {
    // map preferred provider (FiatProvider) → onramp string expected by Onramp.prepare
    const mapProviderToOnramp = (
      provider?: FiatProvider,
    ): "stripe" | "coinbase" | "transak" => {
      switch (provider) {
        case "stripe":
          return "stripe";
        case "transak":
          return "transak";
        default: // default to coinbase when undefined or any other value
          return "coinbase";
      }
    };

    // Choose provider or default to STRIPE
    const onrampProvider = mapProviderToOnramp(params.preferredProvider);

    const d =
      params.toTokenAddress !== NATIVE_TOKEN_ADDRESS
        ? await decimals({
            contract: getContract({
              address: params.toTokenAddress,
              chain: getCachedChain(params.toChainId),
              client: params.client,
            }),
          })
        : 18;

    // Prepare amount in wei if provided
    const amountWei = params.toAmount ? toUnits(params.toAmount, d) : undefined;

    // Call new Onramp.prepare to get the quote & link
    const prepared = await prepareOnramp({
      amount: amountWei,
      chainId: params.toChainId,
      client: params.client,
      currency: params.fromCurrencySymbol,
      maxSteps: 2,
      onramp: onrampProvider,
      onrampChainId: params.onrampChainId,
      onrampTokenAddress: params.onrampTokenAddress,
      paymentLinkId: params.paymentLinkId,
      purchaseData: params.purchaseData,
      receiver: params.toAddress, // force onramp to native token to avoid missing gas issues
      sender: params.fromAddress,
      tokenAddress: params.toTokenAddress,
    });

    // Determine tokens based on steps rules
    const hasSteps = prepared.steps.length > 0;
    const firstStep = hasSteps
      ? (prepared.steps[0] as (typeof prepared.steps)[number])
      : undefined;

    // Estimated duration in seconds – sum of all step durations
    const estimatedDurationSeconds = Math.max(
      120,
      Math.ceil(
        prepared.steps.reduce((acc, s) => acc + s.estimatedExecutionTimeMs, 0) /
          1000,
      ),
    );

    const estimatedToAmountMinWeiBigInt = prepared.destinationAmount;

    const maxSlippageBPS = params.maxSlippageBPS ?? 0;
    const slippageWei =
      (estimatedToAmountMinWeiBigInt * BigInt(maxSlippageBPS)) / 10000n;
    const toAmountMinWeiBigInt = estimatedToAmountMinWeiBigInt - slippageWei;

    const estimatedToAmountMin = toTokens(estimatedToAmountMinWeiBigInt, d);
    const toAmountMin = toTokens(toAmountMinWeiBigInt, d);

    // Helper to convert a Token → PayTokenInfo
    const tokenToPayTokenInfo = (token: {
      chainId: number;
      address: string;
      decimals: number;
      symbol: string;
      name: string;
      prices: Record<string, number>;
    }): PayTokenInfo => ({
      chainId: token.chainId,
      decimals: token.decimals,
      name: token.name,
      priceUSDCents: Math.round((token.prices["USD"] || 0) * 100),
      symbol: token.symbol,
      tokenAddress: token.address,
    });

    // Determine the raw token objects using new simplified rules
    // 1. toToken is always the destination token
    const toTokenRaw = prepared.destinationToken;

    // 2. onRampToken: if exactly one step -> originToken of that step, else toTokenRaw
    const onRampTokenRaw =
      prepared.steps.length > 0 && firstStep
        ? firstStep.originToken
        : toTokenRaw;

    // 3. routingToken: if exactly two steps -> originToken of second step, else undefined
    const routingTokenRaw =
      prepared.steps.length > 1
        ? (prepared.steps[1] as (typeof prepared.steps)[number]).originToken
        : undefined;

    // Amounts for onRampToken/raw
    const onRampTokenAmountWei: bigint =
      prepared.steps.length > 0 && firstStep
        ? firstStep.originAmount
        : prepared.destinationAmount;

    const onRampTokenAmount = toTokens(
      onRampTokenAmountWei,
      onRampTokenRaw.decimals,
    );

    // Build info objects
    const onRampTokenObject = {
      amount: onRampTokenAmount,
      amountUSDCents: Math.round(
        Number(onRampTokenAmount) * (onRampTokenRaw.prices["USD"] || 0) * 100,
      ),
      amountWei: onRampTokenAmountWei.toString(),
      token: tokenToPayTokenInfo(onRampTokenRaw),
    };

    let routingTokenObject:
      | {
          amount: string;
          amountWei: string;
          amountUSDCents: number;
          token: PayTokenInfo;
        }
      | undefined;

    if (routingTokenRaw) {
      const routingAmountWei = (
        prepared.steps[1] as (typeof prepared.steps)[number]
      ).originAmount;
      const routingAmount = toTokens(
        routingAmountWei,
        routingTokenRaw.decimals,
      );
      routingTokenObject = {
        amount: routingAmount,
        amountUSDCents: Math.round(
          Number(routingAmount) * (routingTokenRaw.prices["USD"] || 0) * 100,
        ),
        amountWei: routingAmountWei.toString(),
        token: tokenToPayTokenInfo(routingTokenRaw),
      };
    }

    const buyWithFiatQuote: BuyWithFiatQuote = {
      estimatedDurationSeconds,
      estimatedToAmountMin: estimatedToAmountMin,
      estimatedToAmountMinWei: estimatedToAmountMinWeiBigInt.toString(),
      fromAddress: params.fromAddress,
      fromCurrency: {
        amount: prepared.currencyAmount.toString(),
        amountUnits: Number(prepared.currencyAmount).toFixed(2),
        currencySymbol: prepared.currency,
        decimals: 2,
      },
      fromCurrencyWithFees: {
        amount: prepared.currencyAmount.toString(),
        amountUnits: Number(prepared.currencyAmount).toFixed(2),
        currencySymbol: prepared.currency,
        decimals: 2,
      },
      intentId: prepared.id,
      maxSlippageBPS: maxSlippageBPS,
      onRampLink: prepared.link,
      onRampToken: onRampTokenObject,
      processingFees: [],
      provider: (params.preferredProvider ?? "COINBASE") as FiatProvider,
      routingToken: routingTokenObject,
      toAddress: params.toAddress,
      toAmountMin: toAmountMin,
      toAmountMinWei: toAmountMinWeiBigInt.toString(),
      toToken: tokenToPayTokenInfo(toTokenRaw),
    };

    return buyWithFiatQuote;
  } catch (error) {
    console.error("Error getting buy with fiat quote", error);
    throw error;
  }
}
