import { getClientFetch } from "../../../utils/fetch.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { THIRDWEB_PAY_SWAP_ROUTE_ENDPOINT } from "../utils/definitions.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { ApproveParams } from "../../../extensions/erc20/write/approve.js";
import { getContract } from "../../../contract/contract.js";
import { defineChain } from "../../../chains/utils.js";

export type SwapRouteParams = {
  client: ThirdwebClient;
  fromAddress: string;
  fromChainId: number;
  fromTokenAddress: string;
  fromAmountWei?: string;
  toAddress?: string;
  toChainId: number;
  toTokenAddress: string;
  toAmountWei?: string;
  maxSlippageBPS?: number;
};

type Approval = {
  chainId: number;
  tokenAddress: string;
  spenderAddress: string;
  amountWei: string;
};

export type SwapToken = {
  chainId: number;
  tokenAddress: string;
  decimals: number;
  priceUSDCents: number;
  name?: string;
  symbol?: string;
};

type PaymentToken = {
  token: SwapToken;
  amountWei: string;
};

type TransactionRequest = {
  data: string;
  to: string;
  value: string;
  from: string;
  chainId: number;
  gasPrice: string;
  gasLimit: string;
};

type SwapRouteResponse = {
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
};

export type SwapRoute = {
  transactionId: string;
  transactionRequest: TransactionRequest;
  approval?: BaseTransactionOptions<ApproveParams>;

  swapDetails: {
    fromAddress: string;
    toAddress: string;
    fromToken: SwapToken;
    toToken: SwapToken;
    fromAmountWei: string;
    toAmountMinWei: string;
    toAmountWei: string;

    estimated: {
      fromAmountUSDCents: number;
      toAmountMinUSDCents: number;
      toAmountUSDCents: number;
      feesUSDCents: number;
      gasCostUSDCents: number;
      durationSeconds?: number;
    };
  };

  paymentTokens: PaymentToken[];
  client: ThirdwebClient;
};

/**
 * Retrieves a crypto to crypto swap or bridge route
 * @param params - the swap route params
 * @returns a route object with the swap TransactioRequest and swap details
 * @example
 *
 * ```ts
 * import { getRoute, type SwapRoute } from "thirdweb/pay";
 *
 * const getRoute: SwapRoute = await getSwapRoute({
 *  client,
 *  fromAddress: "0x...", // address of account
 *  fromChainId: 137,
 *  fromTokenAddress: "0x...", // zero address for native currency
 *  fromAmountWei: "1000000", // use toAmountWei to specify destination amount
 *  toAddress: "0x...", // optional destination address other than sender
 *  toChainId: 10,
 *  toTokenAddress: "0x...", // zero address for native currency
 *  maxSlippageBPS: 50, // max 0.5% slippage
 * });
 *
 * ```
 */
export async function getSwapRoute(
  params: SwapRouteParams,
): Promise<SwapRoute> {
  try {
    const queryString = new URLSearchParams(params as any).toString();
    const url = `${THIRDWEB_PAY_SWAP_ROUTE_ENDPOINT}?${queryString}`;

    const response = await getClientFetch(params.client)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SwapRouteResponse = (await response.json())["result"];

    const swapRoute: SwapRoute = {
      transactionId: data.transactionId,
      transactionRequest: data.transactionRequest,
      approval: data.approval
        ? {
            contract: getContract({
              client: params.client,
              address: data.approval.tokenAddress,
              chain: defineChain(data.approval.chainId),
            }),
            spender: data.approval?.spenderAddress,
            amount: data.approval?.amountWei,
          }
        : undefined,
      swapDetails: {
        fromAddress: data.fromAddress,
        toAddress: data.toAddress,
        fromToken: data.fromToken,
        toToken: data.toToken,
        fromAmountWei: data.fromAmountWei,
        toAmountMinWei: data.toAmountMinWei,
        toAmountWei: data.toAmountWei,

        estimated: data.estimated,
      },

      paymentTokens: data.requiredTokens,
      client: params.client,
    };

    return swapRoute;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
