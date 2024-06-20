import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import type {
  PayOnChainTransactionDetails,
  PayTokenInfo,
} from "../utils/commonTypes.js";
import { getPayBuyWithFiatStatusEndpoint } from "../utils/definitions.js";

/**
 * Parameters for the [`getBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatStatus) function
 */
export type GetBuyWithFiatStatusParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   */
  client: ThirdwebClient;
  /**
   * Intent ID of the "Buy with fiat" transaction. You can get the intent ID from the quote object returned by the [`getBuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatQuote) function
   */
  intentId: string;
};

export type ValidBuyWithFiatStatus = Exclude<
  BuyWithFiatStatus,
  { status: "NOT_FOUND" }
>;

/**
 * The returned object from [`getBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatStatus) function
 *
 * If the in invalid intentId is provided, the object will have a status of "NOT_FOUND" and no other fields.
 */
export type BuyWithFiatStatus =
  | {
      status: "NOT_FOUND";
    }
  | {
      /**
       * Intent ID of the "Buy with fiat" transaction. You can get the intent ID from the quote object returned by the [`getBuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatQuote) function
       */
      intentId: string;
      /**
       * The status of the transaction
       * - `NONE` - No status
       * - `PENDING_PAYMENT` - Payment is not done yet in the on-ramp provider
       * - `PAYMENT_FAILED` - Payment failed in the on-ramp provider
       * - `PENDING_ON_RAMP_TRANSFER` - Payment is done but the on-ramp provider is yet to transfer the tokens to the user's wallet
       * - `ON_RAMP_TRANSFER_IN_PROGRESS` - On-ramp provider is transferring the tokens to the user's wallet
       * - `ON_RAMP_TRANSFER_COMPLETED` - On-ramp provider has transferred the tokens to the user's wallet
       * - `ON_RAMP_TRANSFER_FAILED` - On-ramp provider failed to transfer the tokens to the user's wallet
       * - `CRYPTO_SWAP_REQUIRED` - On-ramp provider has sent the tokens to the user's wallet but a swap is required to convert it to the desired token
       * - `CRYPTO_SWAP_IN_PROGRESS` - Swap is in progress
       * - `CRYPTO_SWAP_COMPLETED` - Swap is completed and the user has received the desired token
       * - `CRYPTO_SWAP_FALLBACK` - Swap failed and the user has received a fallback token which is not the desired token
       */
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
      /**
       * The wallet address to which the tokens are sent to
       */
      toAddress: string;
      /**
       * The quote object for the transaction
       */
      quote: {
        estimatedOnRampAmount: string;
        estimatedOnRampAmountWei: string;

        estimatedToTokenAmount: string;
        estimatedToTokenAmountWei: string;

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
        onRampToken: PayTokenInfo;
        toToken: PayTokenInfo;
        estimatedDurationSeconds?: number;
        createdAt: string;
      };
      /**
       * The on-ramp transaction details
       *
       * This field is only present when on-ramp transaction is completed or failed
       */
      source?: PayOnChainTransactionDetails;
      /**
       * The destination transaction details
       *
       * This field is only present when swap transaction is completed or failed
       */
      destination?: PayOnChainTransactionDetails;
      /**
       * Message indicating the reason for failure
       */
      failureMessage?: string;

      /**
       * Arbitrary data sent at the time of fetching the quote
       */
      purchaseData?: object;
    };

/**
 * Once you get a `quote` from [`getBuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatQuote)
 * and open the `quote.onRampLink` in a new tab, you can start polling for the transaction status using `getBuyWithFiatStatus`
 *
 * You should keep calling this function at regular intervals while the status is in one of the pending states such as - "PENDING_PAYMENT", "PENDING_ON_RAMP_TRANSFER", "ON_RAMP_TRANSFER_IN_PROGRESS", "CRYPTO_SWAP_IN_PROGRESS" etc..
 *
 * If `quote.onRampToken` is same as `quote.toToken` (same chain + same token address) - This means that the token can be directly bought from the on-ramp provider.
 * But if they are different - On-ramp provider will send the `quote.onRampToken` to the user's wallet address and a swap is required to convert it to the desired token.
 * You can use the [`isSwapRequiredPostOnramp`](https://portal.thirdweb.com/references/typescript/v5/isSwapRequiredPostOnramp) utility function to check if a swap is required after the on-ramp is done.
 *
 * #### When no swap is required
 * If there is no swap required - the status will become `"ON_RAMP_TRANSFER_COMPLETED"` once the on-ramp provider has sent the tokens to the user's wallet address.
 * Once you receive this status, the process is complete.
 *
 * ### When a swap is required
 * If a swap is required - the status will become `"CRYPTO_SWAP_REQUIRED"` once the on-ramp provider has sent the tokens to the user's wallet address.
 * Once you receive this status, you need to start the swap process.
 *
 * On receiving the `"CRYPTO_SWAP_REQUIRED"` status, you can use the [`getPostOnRampQuote`](https://portal.thirdweb.com/references/typescript/v5/getPostOnRampQuote) function to get the quote for the swap of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote).
 *
 * Once you have this quote - You can follow the same steps as mentioned in the [`getBuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoQuote) documentation to perform the swap.
 *
 * @param params - Object of type [`GetBuyWithFiatStatusParams`](https://portal.thirdweb.com/references/typescript/v5/GetBuyWithFiatStatusParams)
 * @example
 * ```ts
 * // step 1 - get a quote
 * const fiatQuote = await getBuyWithFiatQuote(fiatQuoteParams)
 *
 * // step 2 - open the on-ramp provider UI
 * window.open(quote.onRampLink, "_blank");
 *
 * // step 3 - keep calling getBuyWithFiatStatus while the status is in one of the pending states
 * const fiatStatus = await getBuyWithFiatStatus({
 *    client,
 *    intentId: fiatQuote.intentId,
 * })
 *
 * // when the fiatStatus.status is "ON_RAMP_TRANSFER_COMPLETED" - the process is complete
 * // when the fiatStatus.status is "CRYPTO_SWAP_REQUIRED" - start the swap process
 * ```
 * @buyCrypto
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
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()).result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
