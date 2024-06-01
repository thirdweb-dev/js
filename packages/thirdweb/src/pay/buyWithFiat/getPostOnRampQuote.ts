import type { ThirdwebClient } from "../../client/client.js";
import {
  type BuyWithCryptoQuote,
  getBuyWithCryptoQuote,
} from "../buyWithCrypto/getQuote.js";
import type { BuyWithFiatStatus } from "./getStatus.js";

/**
 * The parameters for [`getPostOnRampQuote`](https://portal.thirdweb.com/references/typescript/v5/getPostOnRampQuote) function
 */
export type GetPostOnRampQuoteParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   */
  client: ThirdwebClient;
  /**
   * The "Buy with fiat" transaction status object returned by [`getBuyWithFiatStatus`](https://portal.thirdweb.com/typescript/v5/getBuyWithFiatStatus) function
   */
  buyWithFiatStatus: BuyWithFiatStatus;
};

/**
 * When buying a token with fiat currency - It only involes doing on-ramp if the on-ramp provider supports buying the given destination token directly.
 *
 * If the on-ramp provider does not support buying the destination token directly, user can be sent an intermediate token with fiat currency from the on-ramp provider which
 * can be swapped to destination token onchain.
 *
 * `getPostOnRampQuote` function is used to get the quote for swapping the on-ramp token to destination token.
 *
 * When you get a "Buy with Fiat" status of type "CRYPTO_SWAP_REQUIRED" from the [`getBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatStatus) function,
 *  you can use `getPostOnRampQuote` function to get the quote of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote) for swapping the on-ramp token to destination token
 *
 * Once you have the quote, you can start the Swap process by following the same steps as mentioned in the [`getBuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoQuote) documentation.
 *
 * @param params - object of type [`GetPostOnRampQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetPostOnRampQuoteParams)
 * @returns Object of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote) which contains the information about the quote such as processing fees, estimated time, converted token amounts, etc.
 * @example
 * ```ts
 * import { getPostOnRampQuote, getBuyWithFiatStatus } from "thirdweb/pay";
 *
 * // previous steps
 * const fiatQuote = await getBuyWithFiatQuote(fiatQuoteParams);
 * window.open(fiatQuote.onRampLink, "_blank");
 * const buyWithFiatStatus = await getBuyWithFiatStatus({ client, intentId }); // keep calling this until status is "settled" state
 *
 * // when a swap is required after onramp
 * if (buyWithFiatStatus.status === "CRYPTO_SWAP_REQUIRED") {
 *  const buyWithCryptoQuote = await getPostOnRampQuote({
 *    client,
 *    buyWithFiatStatus
 *  });
 * }
 * ```
 * @buyCrypto
 */
export async function getPostOnRampQuote({
  client,
  buyWithFiatStatus,
}: GetPostOnRampQuoteParams): Promise<BuyWithCryptoQuote> {
  if (buyWithFiatStatus.status === "NOT_FOUND") {
    throw new Error("Invalid buyWithFiatStatus");
  }

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
