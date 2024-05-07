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
        estimatedDurationSeconds?: number;
        createdAt: string;
      };
      source?: PayOnChainTransactionDetails;
      destination?: PayOnChainTransactionDetails;
      failureMessage?: string;
    };

/**
 * Once you get a `quote` from [`getBuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatQuote)
 * and open the `quote.onRampLink` in a new tab, you can start polling for the status using [`getBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatStatus) to get the status of the transaction.
 *
 * You should keep calling this function at regular intervals until the status reaches some final success or failure state.
 *
 * If `quote.onRampToken.token` is same as `quote.toToken` ( same chain + same token address ) - This means that the token can be directly bought from the on-ramp provider.
 * But if they are different - On-ramp provider will send the `quote.onRampToken` to the user's wallet address and a swap is required to convert it to the desired token.
 * You can use the [`isSwapRequiredPostOnramp`](https://portal.thirdweb.com/references/typescript/v5/isSwapRequiredPostOnramp) utility function to check if a swap is required after the on-ramp is done.
 *
 * #### When no swap is required
 * If there is no swap required - the status will become `ON_RAMP_TRANSFER_COMPLETED` once the on-ramp provider has sent the tokens to the user's wallet address. Once you receive this status, the process is complete.
 *
 * ### When a swap is required
 * If a swap is required - the status will become `CRYPTO_SWAP_REQUIRED` once the on-ramp provider has sent the tokens to the user's wallet address. Once you receive this status, you need to start the swap process.
 *
 * On receiving the `CRYPTO_SWAP_REQUIRED` status, you can use the [`getPostOnRampQuote`](https://portal.thirdweb.com/references/typescript/v5/getPostOnRampQuote) function to get the quote for the swap of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote).
 *
 * Once you have this quote - You can follow the same steps as mentioned in the [`getBuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoQuote) documentation to perform the swap.
 *
 * @buyFiat
 * @param params - Object of type [`GetBuyWithFiatStatusParams`](https://portal.thirdweb.com/references/typescript/v5/GetBuyWithFiatStatusParams)
 * @example
 * ```ts
 * // step 1 - get a quote
 * const fiatQuote = await getBuyWithFiatQuote(fiatQuoteParams)
 *
 * // step 2 - open the on-ramp provider UI
 * window.open(quote.onRampLink, "_blank");
 *
 * // step 3 - keep calling getBuyWithFiatStatus until you get a settled status
 * // status is not settled yet if it is in one of pending state such as - "PENDING_PAYMENT", "PENDING_ON_RAMP_TRANSFER", "ON_RAMP_TRANSFER_IN_PROGRESS", "CRYPTO_SWAP_IN_PROGRESS"
 *
 * const fiatStatus = await getBuyWithFiatStatus({
 *    client,
 *    intentId: fiatQuote.intentId,
 * })
 *
 * // when the fiatStatus.status is "ON_RAMP_TRANSFER_COMPLETED" - the process is complete
 * // when the fiatStatus.status is "CRYPTO_SWAP_REQUIRED" - start the swap process
 * ```
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
