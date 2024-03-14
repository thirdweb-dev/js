import { getClientFetch } from "src/utils/fetch.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getPayQuoteStatusUrl } from "../utils/definitions.js";
import type { SwapTokenInfo } from "./getSwap.js";

// TODO: add JSDoc description for all properties

export type SwapTransactionDetails = {
  transactionHash: string;
  token: SwapTokenInfo;
  amountWei: string;
  amountUSDCents: number;
  completedAt?: number;
  explorerLink?: string;
};

export type SwapTransaction = {
  client: ThirdwebClient;
  transactionHash: string;
};

/**
 * The object returned by the [`getSwapStatus`](https://portal.thirdweb.com/references/typescript/v5/getSwapStatus) function to represent the status of a token swap transaction
 */
export type SwapStatus = {
  transactionId: string;
  transactionType: string;
  source: SwapTransactionDetails;
  destination?: SwapTransactionDetails;
  status: "COMPLETED" | "FAILED" | "PENDING";
  subStatus: number;
  fromAddress: string;
  toAddress: string;
  failureMessage?: string;
  bridgeUsed?: string;
};

/**
 * Gets the status of a token swap transaction
 * @param swapTransaction - Object of type [`TokenSwapTransaction`](https://portal.thirdweb.com/references/typescript/v5/TokenSwapTransaction)
 * @example
 *
 * ```ts
 * import { sendSwapTransaction, getSwapQuote, sendSwapApproval } from "thirdweb/pay";
 *
 * // get a quote for a swapping tokens
 * const quote = await getSwapQuote(quoteParams);
 *
 * // if approval is required, send the approval transaction
 * if (quote.approval) {
 *  await sendSwapApproval(wallet, quote.approval);
 * }
 *
 * // send the swap transaction
 * const swapTransaction = await sendSwapTransaction(wallet, quote);
 *
 * // keep polling the status of the swap transaction until it returns a success or failure status
 * const status = await getSwapStatus(swapTransaction);
 * ```
 * @returns Object of type [`TokenSwapStatus`](https://portal.thirdweb.com/references/typescript/v5/TokenSwapStatus)
 */
export async function getSwapStatus(
  swapTransaction: SwapTransaction,
): Promise<SwapStatus> {
  try {
    const queryString = new URLSearchParams({
      transactionHash: swapTransaction.transactionHash,
    }).toString();
    const url = `${getPayQuoteStatusUrl()}?${queryString}`;

    const response = await getClientFetch(swapTransaction.client)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SwapStatus = (await response.json())["result"];
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
