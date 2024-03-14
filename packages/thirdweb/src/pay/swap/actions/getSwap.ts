import { defineChain } from "../../../chains/utils.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import type { ApproveParams } from "../../../extensions/erc20/write/approve.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getClientFetch } from "../../../utils/fetch.js";
import { getPayQuoteEndpoint } from "../utils/definitions.js";

// TODO: add JSDoc description for all properties

/**
 * The parameters for [`getSwapQuote`](https://portal.thirdweb.com/references/typescript/v5/getSwapQuote) function
 * It includes information about which tokens to swap, the amount of tokens to swap, slippage, etc.
 */
export type GetSwapQuoteParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   */
  client: ThirdwebClient;

  /**
   * The address of the wallet from which the tokens will be sent.
   */
  fromAddress: string;

  // source token

  /**
   * The chain id of the source token.
   */
  fromChainId: number;

  /**
   * The token address of the source token.
   */
  fromTokenAddress: string;

  // to

  /**
   * The chain id of the destination token.
   */
  toChainId: number;

  /**
   * The token address of the destination token.
   */
  toTokenAddress: string;

  /**
   * The maximum slippage in basis points (bps) allowed for the swap.
   * For example, if you want to allow a maximum slippage of 0.5%, you should specify `50` bps.
   */
  maxSlippageBPS?: number;
} & (
  | {
      /**
       * The amount of source token to be swapped.
       * This is useful if you want to swap a certain amount of source token
       *
       * If you want a certain amount of destination token, you can provide `toAmount` instead of `fromAmount`.
       */
      fromAmount: string;
      toAmount?: never;
    }
  | {
      /**
       * The amount of destination token to be received.
       * This is useful if you want to get a certain amount of destination token.
       *
       * If you want to swap a certain amount of source token, you can provide `fromAmount` instead of `toAmount`.
       */
      toAmount: string;
      fromAmount?: never;
    }
);

export type SwapTokenInfo = {
  chainId: number;
  tokenAddress: string;
  decimals: number;
  priceUSDCents: number;
  name?: string;
  symbol?: string;
};

type SwapPaymentToken = {
  token: SwapTokenInfo;
  amountWei: string;
  amount: string;
  amountUSDCents: number;
};

type SwapTransactionRequest = {
  data: string;
  to: string;
  value: string;
  from: string;
  chainId: number;
  gasPrice: string;
  gasLimit: string;
};

type SwapRouteResponse = {
  transactionRequest: SwapTransactionRequest;
  approval?: {
    chainId: number;
    tokenAddress: string;
    spenderAddress: string;
    amountWei: string;
  };

  fromAddress: string;
  toAddress: string;

  fromToken: SwapTokenInfo;
  toToken: SwapTokenInfo;

  fromAmountWei: string;
  fromAmount: string;

  toAmountMinWei: string;
  toAmountMin: string;
  toAmountWei: string;
  toAmount: string;

  paymentTokens: SwapPaymentToken[];
  swapFees: SwapPaymentToken[];

  estimated: {
    fromAmountUSDCents: number;
    toAmountMinUSDCents: number;
    toAmountUSDCents: number;
    slippageBPS: number;
    feesUSDCents: number;
    gasCostUSDCents?: number;
    durationSeconds?: number;
  };

  maxSlippageBPS: number;
};

export type SwapApprovalParams = BaseTransactionOptions<ApproveParams>;

export type SwapQuote = {
  transactionRequest: SwapTransactionRequest;
  approval?: SwapApprovalParams;

  swapDetails: {
    fromAddress: string;
    toAddress: string;

    fromToken: SwapTokenInfo;
    toToken: SwapTokenInfo;

    fromAmount: string;
    fromAmountWei: string;

    toAmountMinWei: string;
    toAmountMin: string;
    toAmount: string;
    toAmountWei: string;

    estimated: {
      fromAmountUSDCents: number;
      toAmountMinUSDCents: number;
      toAmountUSDCents: number;
      slippageBPS: number;
      feesUSDCents: number;
      gasCostUSDCents?: number;
      durationSeconds?: number;
    };

    maxSlippageBPS: number;
  };

  paymentTokens: SwapPaymentToken[];
  swapFees: SwapPaymentToken[];
  client: ThirdwebClient;
};

/**
 * Get a quote of type [`SwapQuote`](https://portal.thirdweb.com/references/typescript/v5/SwapQuote) for performing a token swap.
 * This quote contains the information about the swap such as token amounts, processing fees, estimated time etc.
 *
 * Once you have the quote, you can use the [`sendSwapTransaction`](https://portal.thirdweb.com/references/typescript/v5/sendSwapTransaction)
 * function to execute the swap transaction.
 * @param params - object of type [`GetSwapQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetSwapQuoteParams)
 * @returns Object of type [`SwapQuote`](https://portal.thirdweb.com/references/typescript/v5/SwapQuote) which contains the information about the swap such as processing fees, estimated time, converted token amounts, etc.
 * @example
 *
 * ```ts
 * import { getSwapQuote } from "thirdweb/pay";
 *
 * const quote = await getSwapQuote({
 *  client,
 *  fromAddress: "0x...", // wallet address
 *  fromChainId: 137, // chain id of the source token
 *  fromTokenAddress: "0x...", // token address of the source token
 *  fromAmount: "10", // amount of source token to swap
 *  // optionally, you can use `toAmount` instead if you only want a certain amount of destination token
 *  toChainId: 10, // chain id of the destination token
 *  toTokenAddress: "0x...", // token address of the destination token
 *  toAddress: "0x...", // optional: send the tokens to a different address
 *  maxSlippageBPS: 50, // optional: max 0.5% slippage
 * });
 * ```
 */
export async function getSwapQuote(
  params: GetSwapQuoteParams,
): Promise<SwapQuote> {
  try {
    const urlParamsObj: Record<string, string> = {
      fromAddress: params.fromAddress,
      fromChainId: params.fromChainId.toString(),
      fromTokenAddress: params.fromTokenAddress.toLowerCase(),
      toChainId: params.toChainId.toString(),
      toTokenAddress: params.toTokenAddress.toLowerCase(),
    };

    if ("fromAmount" in params && params.fromAmount) {
      urlParamsObj.fromAmount = params.fromAmount;
    }

    if ("toAmount" in params && params.toAmount) {
      urlParamsObj.toAmount = params.toAmount;
    }

    if (params.maxSlippageBPS) {
      urlParamsObj.maxSlippageBPS = params.maxSlippageBPS.toString();
    }

    const queryString = new URLSearchParams(urlParamsObj).toString();
    const url = `${getPayQuoteEndpoint()}?${queryString}`;

    const response = await getClientFetch(params.client)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SwapRouteResponse = (await response.json())["result"];

    const swapRoute: SwapQuote = {
      transactionRequest: data.transactionRequest,
      approval: data.approval
        ? {
            contract: getContract({
              client: params.client,
              address: data.approval.tokenAddress,
              chain: defineChain(data.approval.chainId),
            }),
            spender: data.approval?.spenderAddress,
            amountWei: BigInt(data.approval.amountWei),
          }
        : undefined,
      swapDetails: {
        fromAddress: data.fromAddress,
        toAddress: data.toAddress,

        fromToken: data.fromToken,
        toToken: data.toToken,

        fromAmount: data.fromAmount,
        fromAmountWei: data.fromAmountWei,

        toAmountMinWei: data.toAmountMinWei,
        toAmountMin: data.toAmountMin,

        toAmountWei: data.toAmountWei,
        toAmount: data.toAmount,
        estimated: data.estimated,

        maxSlippageBPS: data.maxSlippageBPS,
      },

      paymentTokens: data.paymentTokens,
      swapFees: data.swapFees,
      client: params.client,
    };

    return swapRoute;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
