import { getClientFetch } from "../../../utils/fetch.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { THIRDWEB_PAY_SWAP_ROUTE_ENDPOINT } from "../utils/definitions.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { ApproveParams } from "../../../extensions/erc20/write/approve.js";
import { getContract } from "../../../contract/contract.js";
import { defineChain } from "../../../chains/utils.js";
import type { SwapSupportedChainId } from "../supportedChains.js";

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

  /**
   * The address of the wallet other than sender to which the tokens will be sent.
   * This is optional and should only be used if you want to send the tokens to a different address than the sender's address.
   */
  toAddress?: string;

  // source token

  /**
   * The chain id of the source token.
   */
  fromChainId: SwapSupportedChainId;

  /**
   * The token address of the source token.
   */
  fromTokenAddress: string;

  /**
   * The amount of source token to be swapped in wei. This is useful if you want to swap a certain amount of source token
   *
   * If you want a certain amount of destination token, you can provide `toAmountWei` instead of `fromAmountWei`.
   *
   * Either `fromAmountWei` or `toAmountWei` must be provided and not both.
   */
  fromAmountWei?: string;
  // to

  /**
   * The chain id of the destination token.
   */
  toChainId: SwapSupportedChainId;

  /**
   * The token address of the destination token.
   */
  toTokenAddress: string;

  /**
   * The amount of destination token to be received in wei.
   * This is useful if you want to get a certain amount of destination token.
   *
   * If you want to swap a certain amount of source token, you can provide `fromAmountWei` instead of `toAmountWei`.
   * Either `fromAmountWei` or `toAmountWei`  must be provided to get a swap quote and not both.
   */
  toAmountWei?: string;

  /**
   * The maximum slippage in basis points (bps) allowed for the swap.
   * For example, if you want to allow a maximum slippage of 0.5%, you should specify `50` bps.
   */
  maxSlippageBPS?: number;
};

export type SwapTokenInfo = {
  chainId: SwapSupportedChainId;
  tokenAddress: string;
  decimals: number;
  priceUSDCents: number;
  name?: string;
  symbol?: string;
};

type SwapPaymentToken = {
  token: SwapTokenInfo;
  amountWei: string;
};

type SwapTransactionRequest = {
  data: string;
  to: string;
  value: string;
  from: string;
  chainId: SwapSupportedChainId;
  gasPrice: string;
  gasLimit: string;
};

type SwapRouteResponse = {
  transactionId: string;
  transactionRequest: SwapTransactionRequest;
  approval?: {
    chainId: SwapSupportedChainId;
    tokenAddress: string;
    spenderAddress: string;
    amountWei: string;
  };

  fromAddress: string;
  toAddress: string;
  fromToken: SwapTokenInfo;
  toToken: SwapTokenInfo;
  fromAmountWei: string;
  toAmountMinWei: string;
  toAmountWei: string;
  requiredTokens: SwapPaymentToken[];

  estimated: {
    fromAmountUSDCents: number;
    toAmountMinUSDCents: number;
    toAmountUSDCents: number;
    feesUSDCents: number;
    gasCostUSDCents: number;
    durationSeconds?: number;
  };
};

export type SwapQuote = {
  transactionId: string;
  transactionRequest: SwapTransactionRequest;
  approval?: BaseTransactionOptions<ApproveParams>;

  swapDetails: {
    fromAddress: string;
    toAddress: string;
    fromToken: SwapTokenInfo;
    toToken: SwapTokenInfo;
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

  paymentTokens: SwapPaymentToken[];
  client: ThirdwebClient;
};

/**
 * Get a quote of type [`SwapQuote`](https://portal.thirdweb.com/references/typescript/v5/SwapQuote) for performing a token swap.
 * This quote contains the information about the swap such as token amounts, processing fees, estimated time etc.
 *
 * Once you have the quote, you can use the [`sendSwapTransaction`](https://portal.thirdweb.com/references/typescript/v5/sendSwapTransaction)
 * function to execute the swap transaction.
 *
 * You can see the list of supported chains on [`SwapSupportedChainId`](https://portal.thirdweb.com/references/typescript/v5/SwapSupportedChainId)
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
 *  fromAmountWei: "1000000", // amount of source token to swap
 *  // optionally, you can use `toAmountWei` instead if you only want a certain amount of destination token
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
      fromTokenAddress: params.fromTokenAddress,
      toChainId: params.toChainId.toString(),
      toTokenAddress: params.toTokenAddress,
    };

    if (params.fromAmountWei) {
      urlParamsObj.fromAmountWei = params.fromAmountWei;
    }

    if (params.toAmountWei) {
      urlParamsObj.toAmountWei = params.toAmountWei;
    }

    if (params.maxSlippageBPS) {
      urlParamsObj.maxSlippageBPS = params.maxSlippageBPS.toString();
    }

    if (params.toAddress) {
      urlParamsObj.toAddress = params.toAddress;
    }

    const queryString = new URLSearchParams(urlParamsObj).toString();
    const url = `${THIRDWEB_PAY_SWAP_ROUTE_ENDPOINT}?${queryString}`;

    const response = await getClientFetch(params.client)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SwapRouteResponse = (await response.json())["result"];

    const swapRoute: SwapQuote = {
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
