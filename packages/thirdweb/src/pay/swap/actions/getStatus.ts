import { getClientFetch } from "../../../utils/fetch.js";
import { type ThirdwebClient } from "../../../client/client.js";
import { THIRDWEB_PAY_SWAP_STATUS_ENDPOINT } from "../utils/definitions.js";
import { type SwapToken } from "./getSwap.js";

interface TransactionDetails {
  transactionHash: string;
  token: SwapToken;
  amountWei: string;
  amountUSDCents: number;
  completedAt?: number;
  explorerLink?: string;
}

/*
export enum SwapType {
  BRIDGE,
  SWAP,
}

export enum SwapStatusEnum {
  NONE,
  PENDING,
  DONE,
  FAILED,
}

export enum SwapSubStatusEnum {
  NONE,

  // PENDING
  WAITING_BRIDGE,
  WAITING_REFUND,

  // DONE
  ALT_TOKEN,

  // FAILED
  REFUNDED,
}
*/
// THIS DOESNT WORK?
/*
export const SWAP_TYPE = {
  BRIDGE: "BRIDGE",
  SWAP: "SWAP",
} as const;

export type SwapType = (typeof SWAP_TYPE)[keyof typeof SWAP_TYPE];

export const SWAP_STATUS = {
  NONE: "NONE",
  PENDING: "PENDING",
  DONE: "DONE",
  FAILED: "FAILED",
} as const;

export type SwapStatus = (typeof SWAP_STATUS)[keyof typeof SWAP_STATUS];

export const SWAP_SUBSTATUS = {
  NONE: "NONE",
  WAITING_BRIDGE: "WAITING_BRIDGE",
  WAITING_REFUND: "WAITING_REFUND",
  ALT_TOKEN: "ALT_TOKEN",
  REFUNDED: "REFUNDED",
};

export type SwapSubStatus =
  (typeof SWAP_SUBSTATUS)[keyof typeof SWAP_SUBSTATUS];
*/

export interface SwapStatusRequest {
  transactionId: string;
  transactionHash: string;
}

export interface SwapStatusResponse {
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
}

/**
 * Retrieves contract events from the blockchain.
 * @param thirdwebClient asdfadf
 * @param params asdfads
 * @returns asdfasd
 * @example
 * ### Get Swap
 * ``````
 */
export async function getSwapStatus(
  thirdwebClient: ThirdwebClient,
  params: SwapStatusRequest,
): Promise<SwapStatusResponse> {
  try {
    const queryString = new URLSearchParams(params as any).toString();
    const url = `${THIRDWEB_PAY_SWAP_STATUS_ENDPOINT}?${queryString}`;

    const response = await getClientFetch(thirdwebClient)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SwapStatusResponse = (await response.json())["result"];
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
