import type { ThirdwebClient } from "../../client/client.js";
import {
  type BuyWithCryptoQuote,
  getBuyWithCryptoQuote,
} from "../buyWithCrypto/getQuote.js";
import type { BuyWithFiatStatus } from "./getStatus.js";

/**
 * The parameters for [`getPostOnRampQuote`](https://portal.thirdweb.com/references/typescript/v5/getPostOnRampQuote) function
 * Used post onramp to complete get the next quote to execute to fulfill the BuyWithFiat intent
 */
export type GetPostOnRampQuoteParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   */
  client: ThirdwebClient;
  /**
   * The BuyWithFiatStatus returned by getBuyWithFiatStatus that includes details on next steps
   *
   * You can get a BuyWithFiatStatus using the `getBuyWithFiatStatus` function.
   * Refer to the [`getBuyWithFiatStatus`](https://portal.thirdweb.com/typescript/v5/getBuyWithFiatStatus) documentation for more information.
   *
   */
  buyWithFiatStatus: BuyWithFiatStatus;
};

/**
 * Get a quote of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote) to fulfill the BuyWithFiat intent
 * This quote contains the information about the swap such as token amounts, processing fees, estimated time etc.
 *
 * Once you have the quote, you can use `prepareTransaction` and prepare the transaction for submission.
 * @param params - object of type [`GetPostOnRampQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetPostOnRampQuoteParams)
 * @returns Object of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote) which contains the information about the quote such as processing fees, estimated time, converted token amounts, etc.
 * @example
 *
 * ```ts
 * import { getPostOnRampQuote, getBuyWithFiatStatus } from "thirdweb/pay";
 *
 * const intentId = "abc-123";
 *
 * const buyWithFiatStatus = await getBuyWithFiatStatus({ client, intentId });
 * const buyWithCryptoQuote = await getPostOnRampQuote({
 *  client,
 *  buyWithFiatStatus
 * });
 * ```
 * @buyCrypto
 */
export async function getPostOnRampQuote({
  client,
  buyWithFiatStatus,
}: GetPostOnRampQuoteParams): Promise<BuyWithCryptoQuote | null> {
  if (buyWithFiatStatus.status !== "NOT_FOUND" && buyWithFiatStatus.intentId) {
    return getBuyWithCryptoQuote({
      client,
      intentId: buyWithFiatStatus.intentId,
      fromAddress: buyWithFiatStatus.toAddress,
      fromChainId: buyWithFiatStatus.quote.onRampToken.chainId,
      fromTokenAddress: buyWithFiatStatus.quote.onRampToken.tokenAddress,
      toChainId: buyWithFiatStatus.quote.toToken.chainId,
      toTokenAddress: buyWithFiatStatus.quote.toToken.tokenAddress,
      toAmount: buyWithFiatStatus.quote.estimatedToTokenAmount,
    });
  }

  // nothing to do yet
  return null;
}
