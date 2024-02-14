import { getClientFetch } from "../../../utils/fetch.js";
import { type ThirdwebClient } from "../../../client/client.js";
import { THIRDWEB_PAY_SWAP_ROUTE_ENDPOINT } from "../utils/definitions.js";

export interface SwapRouteRequest {
  fromAddress: string;
  fromChainId: number;
  fromTokenAddress: string;
  fromAmountWei?: string;
  toAddress?: string;
  toChainId: number;
  toTokenAddress: string;
  toAmountWei?: string;
  maxSlippageBPS?: number;
}

interface Approval {
  spenderAddress: string;
  tokenAddress: string;
  amountWei: string;
}

export interface SwapToken {
  chainId: number;
  tokenAddress: string;
  decimals: number;
  priceUSDCents: number;
  name?: string;
  symbol?: string;
}

interface PaymentToken {
  token: SwapToken;
  amountWei: string;
}

interface TransactionRequest {
  data: string;
  to: string;
  value: string;
  from: string;
  chainId: number;
  gasPrice: string;
  gasLimit: string;
}

export interface SwapRouteResponse {
  transactionId: string;
  transactionRequest: TransactionRequest;
  approval?: Approval;

  fromAddress: string;
  toAddress: string;
  fromToken: SwapToken;
  toToken: SwapToken;
  fromAmountWei: string;
  toAmountMinWei: string;
  toAmountWei: string;
  requiredTokens: PaymentToken[];

  estimated: {
    fromAmountUSDCents: number;
    toAmountMinUSDCents: number;
    toAmountUSDCents: number;
    feesUSDCents: number;
    gasCostUSDCents: number;
    durationSeconds?: number;
  };
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
export async function getRoute(
  thirdwebClient: ThirdwebClient,
  params: SwapRouteRequest,
): Promise<SwapRouteResponse> {
  try {
    const queryString = new URLSearchParams(params as any).toString();
    const url = `${THIRDWEB_PAY_SWAP_ROUTE_ENDPOINT}?${queryString}`;

    const response = await getClientFetch(thirdwebClient)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SwapRouteResponse = (await response.json())["result"];
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
