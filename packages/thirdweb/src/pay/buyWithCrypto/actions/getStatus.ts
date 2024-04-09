import type { ThirdwebClient } from "../../../client/client.js";
import { getClientFetch } from "../../../utils/fetch.js";
import { getPayBuyWithCryptoStatusUrl } from "../utils/definitions.js";
import type { QuoteTokenInfo } from "./getQuote.js";

// TODO: add JSDoc description for all properties

export type BuyWithCryptoTransactionDetails = {
  transactionHash: string;
  token: QuoteTokenInfo;
  amountWei: string;
  amount: string;
  amountUSDCents: number;
  completedAt?: string; // ISO DATE
  explorerLink?: string;
};

export type BuyWithCryptoQuoteSummary = {
  fromToken: QuoteTokenInfo;
  toToken: QuoteTokenInfo;

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
    gasCostUSDCents?: number;
    durationSeconds?: number;
  }; // SAME AS QUOTE

  createdAt: string; // ISO DATE
};

export type BuyWithCryptoTransaction = {
  client: ThirdwebClient;
  transactionHash: string;
};

export type BuyWithCryptoStatuses =
  | "NOT_FOUND"
  | "NONE"
  | "PENDING"
  | "FAILED"
  | "COMPLETED";

export type BuyWithCryptoSubStatuses =
  | "NONE"
  | "WAITING_BRIDGE"
  | "REVERTED_ON_CHAIN"
  | "SUCCESS"
  | "PARTIAL_SUCCESS"
  | "UNKNOWN_ERROR";

export type SwapType = "SAME_CHAIN" | "CROSS_CHAIN";

/**
 * The object returned by the [`getBuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoStatus) function to represent the status of a quoted transaction
 * @buyCrypto
 */
export type BuyWithCryptoStatus = {
  quote: BuyWithCryptoQuoteSummary;
  swapType: SwapType;
  source: BuyWithCryptoTransactionDetails;
  destination?: BuyWithCryptoTransactionDetails;
  status: BuyWithCryptoStatuses;
  subStatus: BuyWithCryptoSubStatuses;
  fromAddress: string;
  toAddress: string;
  failureMessage?: string;
  bridge?: string;
};

/**
 * Gets the status of a buy with crypto transaction
 * @param buyWithCryptoTransaction - Object of type [`BuyWithCryptoTransaction`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoTransaction)
 * @example
 *
 * ```ts
 * import { sendTransaction, prepareTransaction } from "thirdweb";
 * import { getBuyWithCryptoStatus, getBuyWithCryptoQuote } from "thirdweb/pay";
 *
 * // get a quote between two tokens
 * const quote = await getBuyWithCryptoQuote(quoteParams);
 *
 * // if approval is required, send the approval transaction
 * if (quote.approval) {
 *  const preparedApproval = prepareTransaction(quote.approval);
 *  await sendTransaction({
 *    transaction,
 *    wallet,
 *  });
 * }
 *
 * // send the quoted transaction
 * const preparedTransaction = prepareTransaction(quote.transactionRequest);
 * const transactionResult = await sendTransaction({
 *    transaction,
 *    wallet,
 *  });
 * // keep polling the status of the quoted transaction until it returns a success or failure status
 * const status = await getBuyWithCryptoStatus({
 *    client,
 *    transactionHash: transactionResult.transactionHash,
 * }});
 * ```
 * @returns Object of type [`BuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoStatus)
 * @buyCrypto
 */
export async function getBuyWithCryptoStatus(
  buyWithCryptoTransaction: BuyWithCryptoTransaction,
): Promise<BuyWithCryptoStatus> {
  try {
    if (!buyWithCryptoTransaction.transactionHash) {
      throw new Error("Transaction hash is required");
    }
    const queryString = new URLSearchParams({
      transactionHash: buyWithCryptoTransaction.transactionHash,
    }).toString();
    const url = `${getPayBuyWithCryptoStatusUrl()}?${queryString}`;

    const response = await getClientFetch(buyWithCryptoTransaction.client)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BuyWithCryptoStatus = (await response.json()).result;
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
