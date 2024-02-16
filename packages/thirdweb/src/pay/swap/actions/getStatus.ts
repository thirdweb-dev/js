import { getClientFetch } from "../../../utils/fetch.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { THIRDWEB_PAY_SWAP_STATUS_ENDPOINT } from "../utils/definitions.js";
import type { SwapToken } from "./getSwap.js";

type TransactionDetails = {
  transactionHash: string;
  token: SwapToken;
  amountWei: string;
  amountUSDCents: number;
  completedAt?: number;
  explorerLink?: string;
};

export type SwapStatusParams = {
  client: ThirdwebClient;
  transactionId: string;
  transactionHash: string;
};

export type SwapStatus = {
  transactionId: string;
  transactionType: string;
  source: TransactionDetails;
  destination?: TransactionDetails;
  status: string;
  subStatus: string;
  fromAddress: string;
  toAddress: string;
  failureMessage?: string;
  bridgeUsed?: string;
};

/**
 * Gets the status of a swap transaction
 * @param params - The SwapStatus params
 * @returns a status object of the swap transaction
 * @example
 *
 * ```ts
 * import { getSwapStatus, type SwapStatus } from "thirdweb/pay";
 *
 * const swapStatus: SwapStatus = await getSwapStatus({
 *   client,
 *   transactionId: "1234", // transactionId returned from getRoute
 *   transactionHash: "0x...", // transactionHash returned from sendSwap or sendTransaction
 * });
 * ```
 */
export async function getSwapStatus(
  params: SwapStatusParams,
): Promise<SwapStatus> {
  try {
    const queryString = new URLSearchParams({
      transactionId: params.transactionId,
      transactionHash: params.transactionHash,
    }).toString();
    const url = `${THIRDWEB_PAY_SWAP_STATUS_ENDPOINT}?${queryString}`;

    const response = await getClientFetch(params.client)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SwapStatus = (await response.json())["result"];
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
