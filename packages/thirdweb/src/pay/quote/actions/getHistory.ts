import type { ThirdwebClient } from "../../../client/client.js";
import { getClientFetch } from "../../../utils/fetch.js";
import { getPaySwapHistoryEndpoint } from "../utils/definitions.js";
import type { QuoteStatus } from "./getStatus.js";

export type WalletSwapHistoryParams = {
  client: ThirdwebClient;
  walletAddress: string; // address of the wallet to get the swap history for
  cursor?: string;
  pageSize?: number; // defaults to 10
};

export type WalletSwapHistoryData = {
  page: QuoteStatus[];
  nextCursor?: string; // if more data available
};

/**
 * Gets the status of a quoted transaction
 * @param params Object of type [`WalletSwapHistoryParams`](https://portal.thirdweb.com/references/typescript/v5/WalletSwapHistoryParams)
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
export async function getWalletSwapHistory(
  params: WalletSwapHistoryParams,
): Promise<WalletSwapHistoryData> {
  try {
    const queryParams: any = { walletAddress: params.walletAddress };
    if (params.cursor) {
      queryParams["cursor"] = params.cursor;
    }

    if (params.pageSize) {
      queryParams["pageSize"] = params.pageSize;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${getPaySwapHistoryEndpoint()}?${queryString}`;

    const response = await getClientFetch(params.client)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WalletSwapHistoryData = (await response.json())["result"];
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
