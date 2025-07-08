import { status as onrampStatus } from "../../bridge/OnrampStatus.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { PurchaseData } from "../types.js";
import type {
  PayOnChainTransactionDetails,
  PayTokenInfo,
} from "../utils/commonTypes.js";

/**
 * Parameters for the [`getBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatStatus) function
 * @deprecated
 * @buyCrypto
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

/**
 * The returned object from [`getBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatStatus) function
 *
 * If the in invalid intentId is provided, the object will have a status of "NOT_FOUND" and no other fields.
 * @buyCrypto
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
       * - `ON_RAMP_TRANSFER_COMPLETED` - On-ramp provider has transferred the tokens to the user's wallet
       */
      status:
        | "NONE"
        | "PENDING_PAYMENT"
        | "PAYMENT_FAILED"
        | "ON_RAMP_TRANSFER_COMPLETED";
      /**
       * The wallet address to which the desired tokens are sent to
       */
      toAddress: string;
      /**
       * The wallet address that started the transaction.
       *
       * If onramp provider supports buying the destination token directly, the tokens are sent to "toAddress" directly.
       * Otherwise, the tokens are sent to "fromAddress" and a swap is performed by the payer wallet and the tokens are converted to the desired token and sent to "toAddress".
       */
      fromAddress: string;
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
      purchaseData?: PurchaseData;
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
 * ```
 * @deprecated
 * @buyCrypto
 */
export async function getBuyWithFiatStatus(
  params: GetBuyWithFiatStatusParams,
): Promise<BuyWithFiatStatus> {
  const result = await onrampStatus({
    client: params.client,
    id: params.intentId,
  });

  return toBuyWithFiatStatus({ intentId: params.intentId, result });
}

////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////

function toBuyWithFiatStatus(args: {
  intentId: string;
  result: Awaited<ReturnType<typeof onrampStatus>>;
}): BuyWithFiatStatus {
  const { intentId, result } = args;

  // Map status constants from the Bridge.Onramp.status response to BuyWithFiatStatus equivalents.
  const STATUS_MAP: Record<
    typeof result.status,
    "NONE" | "PENDING_PAYMENT" | "PAYMENT_FAILED" | "ON_RAMP_TRANSFER_COMPLETED"
  > = {
    COMPLETED: "ON_RAMP_TRANSFER_COMPLETED",
    CREATED: "PENDING_PAYMENT",
    FAILED: "PAYMENT_FAILED",
    PENDING: "PENDING_PAYMENT",
  } as const;

  const mappedStatus = STATUS_MAP[result.status];

  return buildPlaceholderStatus({
    intentId,
    purchaseData: result.purchaseData,
    status: mappedStatus,
  });
}

function buildPlaceholderStatus(args: {
  intentId: string;
  status:
    | "NONE"
    | "PENDING_PAYMENT"
    | "PAYMENT_FAILED"
    | "ON_RAMP_TRANSFER_COMPLETED";
  purchaseData?: PurchaseData;
}): BuyWithFiatStatus {
  const { intentId, status, purchaseData } = args;

  // Build a minimal—but type-complete—object that satisfies BuyWithFiatStatus.
  const emptyToken: PayTokenInfo = {
    chainId: 0,
    decimals: 18,
    name: "",
    priceUSDCents: 0,
    symbol: "",
    tokenAddress: "",
  };

  type BuyWithFiatStatusWithData = Exclude<
    BuyWithFiatStatus,
    { status: "NOT_FOUND" }
  >;

  const quote: BuyWithFiatStatusWithData["quote"] = {
    createdAt: new Date().toISOString(),
    estimatedDurationSeconds: 0,
    estimatedOnRampAmount: "0",
    estimatedOnRampAmountWei: "0",

    estimatedToTokenAmount: "0",
    estimatedToTokenAmountWei: "0",

    fromCurrency: {
      amount: "0",
      amountUnits: "USD",
      currencySymbol: "USD",
      decimals: 2,
    },
    fromCurrencyWithFees: {
      amount: "0",
      amountUnits: "USD",
      currencySymbol: "USD",
      decimals: 2,
    },
    onRampToken: emptyToken,
    toToken: emptyToken,
  } as BuyWithFiatStatusWithData["quote"];

  // The source/destination fields can only be filled accurately when extra context is returned
  // by the API. Since Bridge.Onramp.status doesn't yet provide these details, we omit them for
  // now (they are optional).

  const base: Exclude<BuyWithFiatStatus, { status: "NOT_FOUND" }> = {
    fromAddress: "",
    intentId,
    purchaseData,
    quote,
    status,
    toAddress: "",
  };

  return base;
}
