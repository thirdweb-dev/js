import { getClientFetch } from "../../../utils/fetch.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { THIRDWEB_PAY_SWAP_STATUS_ENDPOINT } from "../utils/definitions.js";
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
  transactionId: string;
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
  status: "DONE" | "FAILED" | "PENDING";
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
 * import { getSwapStatus } from "thirdweb/pay";
 *
 * // get a quote for a token swap
 * const quote = await getTokenSwapQuote()
 *
 * // send the swap transaction
 * const swapTransaction = await sendTokenSwapTransaction(quote);
 *
 * // get the status of the swap transaction
 * // you should poll this function at some intervals until the status shows that the transaction was successful or failed
 * const status = await getSwapStatus(swapTransaction);
 * ```
 * @returns Object of type [`TokenSwapStatus`](https://portal.thirdweb.com/references/typescript/v5/TokenSwapStatus)
 */
export async function getSwapStatus(
  swapTransaction: SwapTransaction,
): Promise<SwapStatus> {
  try {
    const queryString = new URLSearchParams({
      transactionId: swapTransaction.transactionId,
      transactionHash: swapTransaction.transactionHash,
    }).toString();

    const url = `${THIRDWEB_PAY_SWAP_STATUS_ENDPOINT}?${queryString}`;

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
