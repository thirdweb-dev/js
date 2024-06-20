import type { Hash } from "viem";
import { getCachedChain } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import {
  type ApproveParams,
  approve,
} from "../../extensions/erc20/write/approve.js";
import type { PrepareTransactionOptions } from "../../transaction/prepare-transaction.js";
import type { BaseTransactionOptions } from "../../transaction/types.js";
import { getClientFetch } from "../../utils/fetch.js";
import { getPayBuyWithCryptoQuoteEndpoint } from "../utils/definitions.js";

// TODO: add JSDoc description for all properties

/**
 * The parameters for [`getBuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoQuote) function
 * It includes information about which tokens to swap, the amount of tokens to swap, slippage, etc.
 */
export type GetBuyWithCryptoQuoteParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   */
  client: ThirdwebClient;

  /**
   * This is only relevant if the buy-with-crypto transaction is part of buy-with-fiat flow.
   *
   * When a swap is required after an onramp transaction, the intentId is used to link the buy-with-crypto transaction to the onramp transaction.
   * Refer to [`getPostOnRampQuote`](https://portal.thirdweb.com/references/typescript/v5/getPostOnRampQuote) for more information.`
   *
   */
  intentId?: string;

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
   * Extra details to store with the purchase.
   *
   * This details will be stored with the purchase and can be retrieved later via the status API or Webhook
   */
  purchaseData?: object;

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

export type QuoteTokenInfo = {
  chainId: number;
  tokenAddress: string;
  decimals: number;
  priceUSDCents: number;
  name?: string;
  symbol?: string;
};

type QuotePaymentToken = {
  token: QuoteTokenInfo;
  amountWei: string;
  amount: string;
  amountUSDCents: number;
};

type QuoteTransactionRequest = {
  data: string;
  to: string;
  value: string;
  from: string;
  chainId: number;
  gasPrice: string;
  gasLimit: string;
};

type BuyWithCryptoQuoteRouteResponse = {
  transactionRequest: QuoteTransactionRequest;
  approval?: {
    chainId: number;
    tokenAddress: string;
    spenderAddress: string;
    amountWei: string;
  };

  fromAddress: string;
  toAddress: string;

  fromToken: QuoteTokenInfo;
  toToken: QuoteTokenInfo;

  fromAmountWei: string;
  fromAmount: string;

  toAmountMinWei: string;
  toAmountMin: string;
  toAmountWei: string;
  toAmount: string;

  paymentTokens: QuotePaymentToken[];
  processingFees: QuotePaymentToken[];

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
  bridge?: string;
};

export type QuoteApprovalParams = BaseTransactionOptions<ApproveParams>;

export type BuyWithCryptoQuote = {
  transactionRequest: PrepareTransactionOptions;
  approval?: PrepareTransactionOptions;

  swapDetails: {
    fromAddress: string;
    toAddress: string;

    fromToken: QuoteTokenInfo;
    toToken: QuoteTokenInfo;

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

  paymentTokens: QuotePaymentToken[];
  processingFees: QuotePaymentToken[];
  client: ThirdwebClient;
};

/**
 * Get a quote of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote) to buy any given token with crypto.
 * This quote contains the information about the swap such as token amounts, processing fees, estimated time etc.
 *
 * Once you have the quote, you can use `prepareTransaction` and prepare the transaction for submission.
 * @param params - object of type [`GetBuyWithCryptoQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetBuyWithCryptoQuoteParams)
 * @returns Object of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote) which contains the information about the quote such as processing fees, estimated time, converted token amounts, etc.
 * @example
 *
 * ```ts
 * import { getBuyWithCryptoQuote } from "thirdweb/pay";
 *
 * const quote = await getBuyWithCryptoQuote({
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
 * @buyCrypto
 */
export async function getBuyWithCryptoQuote(
  params: GetBuyWithCryptoQuoteParams,
): Promise<BuyWithCryptoQuote> {
  try {
    const clientFetch = getClientFetch(params.client);

    const response = await clientFetch(getPayBuyWithCryptoQuoteEndpoint(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromAddress: params.fromAddress,
        fromChainId: params.fromChainId.toString(),
        fromTokenAddress: params.fromTokenAddress,
        toChainId: params.toChainId.toString(),
        toTokenAddress: params.toTokenAddress,
        fromAmount: params.fromAmount,
        toAmount: params.toAmount,
        maxSlippageBPS: params.maxSlippageBPS,
        intentId: params.intentId,
        purchaseData: params.purchaseData,
      }),
    });

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      const errorObj = await response.json();
      if (
        errorObj &&
        "error" in errorObj &&
        typeof errorObj.error === "object" &&
        "message" in errorObj.error
      ) {
        throw new Error(errorObj.error.message);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BuyWithCryptoQuoteRouteResponse = (await response.json())
      .result;

    const swapRoute: BuyWithCryptoQuote = {
      transactionRequest: {
        chain: getCachedChain(data.transactionRequest.chainId),
        client: params.client,
        data: data.transactionRequest.data as Hash,
        to: data.transactionRequest.to,
        value: BigInt(data.transactionRequest.value),
        gas: BigInt(data.transactionRequest.gasLimit),
        gasPrice: BigInt(data.transactionRequest.gasPrice),
      },
      approval: data.approval
        ? approve({
            contract: getContract({
              client: params.client,
              address: data.approval.tokenAddress,
              chain: getCachedChain(data.approval.chainId),
            }),
            spender: data.approval?.spenderAddress,
            amountWei: BigInt(data.approval.amountWei),
          })
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
      processingFees: data.processingFees,
      client: params.client,
    };

    return swapRoute;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
