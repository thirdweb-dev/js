import type { ThirdwebClient } from "../../../client/client.js";
import { getClientFetch } from "../../../utils/fetch.js";
import { getPayQuoteStatusUrl } from "../utils/definitions.js";
import type { QuoteTokenInfo } from "./getQuote.js";

// TODO: add JSDoc description for all properties

export type QuoteTransactionDetails = {
  transactionHash: string;
  token: QuoteTokenInfo;
  amountWei: string;
  amountUSDCents: number;
  completedAt?: number;
  explorerLink?: string;
};

export type QuoteTransaction = {
  client: ThirdwebClient;
  transactionHash: string;
};

/**
 * The object returned by the [`getQuoteStatus`](https://portal.thirdweb.com/references/typescript/v5/getQuoteStatus) function to represent the status of a quoted transaction
 */
export type QuoteStatus = {
  transactionId: string;
  transactionType: string;
  source: QuoteTransactionDetails;
  destination?: QuoteTransactionDetails;
  status: "COMPLETED" | "FAILED" | "PENDING";
  subStatus: number;
  fromAddress: string;
  toAddress: string;
  failureMessage?: string;
  bridgeUsed?: string;
};

/**
 * Gets the status of a quoted transaction
 * @param quoteTransaction - Object of type [`QuoteTransaction`](https://portal.thirdweb.com/references/typescript/v5/QuoteTransaction)
 * @example
 *
 * ```ts
 * import { sendQuoteTransaction, getSwapQuote, sendQuoteApproval } from "thirdweb/pay";
 *
 * // get a quote between two tokens
 * const quote = await getSwapQuote(quoteParams);
 *
 * // if approval is required, send the approval transaction
 * if (quote.approval) {
 *  await sendQuoteApproval(wallet, quote.approval);
 * }
 *
 * // send the quoted transaction
 * const quoteTransaction = await sendQuoteTransaction(wallet, quote);
 *
 * // keep polling the status of the quoted transaction until it returns a success or failure status
 * const status = await getQuoteStatus(quoteTransaction);
 * ```
 * @returns Object of type [`QuoteStatus`](https://portal.thirdweb.com/references/typescript/v5/QuoteStatus)
 */
export async function getQuoteStatus(
  quoteTransaction: QuoteTransaction,
): Promise<QuoteStatus> {
  try {
    const queryString = new URLSearchParams({
      transactionHash: quoteTransaction.transactionHash,
    }).toString();
    const url = `${getPayQuoteStatusUrl()}?${queryString}`;

    const response = await getClientFetch(quoteTransaction.client)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: QuoteStatus = (await response.json())["result"];
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
