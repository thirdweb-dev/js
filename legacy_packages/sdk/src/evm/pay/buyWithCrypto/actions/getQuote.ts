import { TransactionRequest } from "@ethersproject/abstract-provider";
import {
  BuyWithCryptoQuote as BuyWithCryptoQuoteV5,
  createThirdwebClient,
  getBuyWithCryptoQuote as getBuyWithCryptoQuoteV5,
  prepareTransaction,
  type ThirdwebClient,
} from "thirdweb";
import { resolvePromisedValue } from "thirdweb/utils";

/**
 * The parameters for [`getBuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v4/getBuyWithCryptoQuote) function
 * It includes information about which tokens to swap, the amount of tokens to swap, slippage, etc.
 */
export type GetBuyWithCryptoQuoteParams = {
  /**
   * A client ID of the API key to identify the client making the request.
   *
   * You can get an API key from the dashboard over at https://thirdweb.com/dashboard/settings/api-keys
   */
  clientId?: string;

  /**
   * A secretKey of the API key to identify the server making the request.
   *
   * You can get an API key from the dashboard over at https://thirdweb.com/dashboard/settings/api-keys
   */
  secretKey?: string;

  /**
   * The address of the wallet from which the tokens will be sent.
   */
  fromAddress: string;

  /**
   * The address of the wallet to which the tokens will be sent.
   */
  toAddress: string;

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

export { type QuoteTokenInfo } from "thirdweb/pay";

export type BuyWithCryptoQuote = {
  transactionRequest: TransactionRequest;
  approval?: TransactionRequest;

  swapDetails: BuyWithCryptoQuoteV5["swapDetails"];
  paymentTokens: BuyWithCryptoQuoteV5["paymentTokens"];
  processingFees: BuyWithCryptoQuoteV5["processingFees"];

  client: BuyWithCryptoQuoteV5["client"];
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
 * import { getBuyWithCryptoQuote } from "@thirdweb-dev/sdk";
 *
 * const quote = await getBuyWithCryptoQuote({
 *  clientId: "...",
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
export async function getBuyWithCryptoQuote(
  params: GetBuyWithCryptoQuoteParams,
): Promise<BuyWithCryptoQuote> {
  let client: ThirdwebClient | undefined;

  if (params.secretKey) {
    client = createThirdwebClient({
      secretKey: params.secretKey,
    });
  }
  if (params.clientId) {
    client = createThirdwebClient({
      clientId: params.clientId,
    });
  }

  if (!client) {
    throw new Error(
      "You must provide either a `clientId` or a `secretKey` to get a quote",
    );
  }

  const data = await getBuyWithCryptoQuoteV5({
    ...params,
    client,
  });

  const sendTxn = prepareTransaction(data.transactionRequest);
  const approvalTxn = data.approval
    ? prepareTransaction(data.approval)
    : undefined;

  const [
    sendTxnTo,
    sendTxnData,
    sendTxnGasPrice,
    sendTxnGasLimit,
    sendTxnNonce,
    sendTxnValue,
    approvalTxnTo,
    approvalTxnData,
    approvalTxnGasLimit,
    approvalTxnGasPrice,
    approvalTxnNonce,
    approvalTxnValue,
  ] = await Promise.all([
    resolvePromisedValue(sendTxn.to),
    resolvePromisedValue(sendTxn.data),
    resolvePromisedValue(sendTxn.gasPrice),
    resolvePromisedValue(sendTxn.gas),
    resolvePromisedValue(sendTxn.nonce),
    resolvePromisedValue(sendTxn.value),
    resolvePromisedValue(approvalTxn?.to),
    resolvePromisedValue(approvalTxn?.data),
    resolvePromisedValue(approvalTxn?.gas),
    resolvePromisedValue(approvalTxn?.gasPrice),
    resolvePromisedValue(approvalTxn?.nonce),
    resolvePromisedValue(approvalTxn?.value),
  ]);

  const swapRoute: BuyWithCryptoQuote = {
    transactionRequest: {
      to: sendTxnTo,
      data: sendTxnData,
      gasPrice: sendTxnGasPrice,
      gasLimit: sendTxnGasLimit,
      nonce: sendTxnNonce,
      value: sendTxnValue,
      chainId: sendTxn.chain.id,
    },
    approval: approvalTxn
      ? {
          to: approvalTxnTo,
          data: approvalTxnData,
          gasLimit: approvalTxnGasLimit,
          gasPrice: approvalTxnGasPrice,
          nonce: approvalTxnNonce,
          value: approvalTxnValue,
          chainId: approvalTxn.chain.id,
        }
      : undefined,
    swapDetails: data.swapDetails,
    paymentTokens: data.paymentTokens,
    processingFees: data.processingFees,
    client,
  };

  return swapRoute;
}
