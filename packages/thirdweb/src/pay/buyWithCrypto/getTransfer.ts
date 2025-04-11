import type { Hash } from "viem";
import { getCachedChain } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { PrepareTransactionOptions } from "../../transaction/prepare-transaction.js";
import type { Address } from "../../utils/address.js";
import { getClientFetch } from "../../utils/fetch.js";
import { stringify } from "../../utils/json.js";
import { getPayBuyWithCryptoTransferEndpoint } from "../utils/definitions.js";
import type {
  QuoteApprovalInfo,
  QuotePaymentToken,
  QuoteTokenInfo,
  QuoteTransactionRequest,
} from "./commonTypes.js";

/**
 * The parameters for [`getBuyWithCryptoTransfer`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoTransfer) function
 * It facilitates a token transfer.
 * @buyCrypto
 */
export type GetBuyWithCryptoTransferParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   */
  client: ThirdwebClient;

  /**
   * The address of wallet that pays for the tokens.
   */
  fromAddress: string;

  /**
   * The address of the wallet where the tokens are sent
   */
  toAddress: string;

  /**
   * The chain id of the transfer token.
   */
  chainId: number;

  /**
   * The token address of the transfer token.
   */
  tokenAddress: string;

  /**
   * The amount of token to be transferred.
   */
  amount: string;

  /**
   * Extra details to store with the purchase.
   *
   * This details will be stored with the purchase and can be retrieved later via the status API or Webhook
   */
  purchaseData?: object;

  /**
   * For direct transfers, specify who will pay for the transfer fee. Can be "sender" or "receiver".
   */
  feePayer?: "sender" | "receiver";
};

/**
 * @buyCrypto
 */
type BuyWithCryptoTransferResponse = {
  quoteId: string;
  transactionRequest: QuoteTransactionRequest;
  approval?: QuoteApprovalInfo;
  fromAddress: string;
  toAddress: string;
  token: QuoteTokenInfo;
  paymentToken: QuotePaymentToken;
  processingFee: QuotePaymentToken;
  estimatedGasCostUSDCents: number;
};

/**
 * @buyCrypto
 */
export type BuyWithCryptoTransfer = {
  transactionRequest: PrepareTransactionOptions;
  approvalData?: QuoteApprovalInfo;
  fromAddress: string;
  toAddress: string;
  paymentToken: QuotePaymentToken;
  processingFee: QuotePaymentToken;
  estimatedGasCostUSDCents: number;
  client: ThirdwebClient;
};

/**
 * Get a quote of type [`BuyWithCryptoTransfer`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoTransfer) to facilitate a token transfer transaction.
 * Using this instead of a native transfer allows you to receive status and webhooks about successful or failed payments.
 *
 * Once you have the quote, you can use `prepareTransaction` and prepare the transaction for submission.
 * @param params - object of type [`GetBuyWithCryptoTransferParams`](https://portal.thirdweb.com/references/typescript/v5/GetBuyWithCryptoTransferParams)
 * @returns Object of type [`BuyWithCryptoTransfer`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoTransfer) which contains the information about the transfer
 * @example
 *
 * ```ts
 * import { getBuyWithCryptoTransfer } from "thirdweb/pay";
 *
 * const transfer = await getBuyWithCryptoTransfer({
 *  client,
 *  fromAddress: "0x...", // wallet address
 *  toAddress: "0x...", // recipient address - likely to be your wallet
 *  chainId: 10, // chain id of the token
 *  tokenAddress: "0x...", // address of the token
 *  amount: "10", // amount of token to transfer
 *  purchaseData: {  // any metadata for you to attribute this purchase
 *    "customerId": "yourId"
 *  }
 * });
 * ```
 * @buyCrypto
 */
export async function getBuyWithCryptoTransfer(
  params: GetBuyWithCryptoTransferParams,
): Promise<BuyWithCryptoTransfer> {
  try {
    const clientFetch = getClientFetch(params.client);

    const response = await clientFetch(getPayBuyWithCryptoTransferEndpoint(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: stringify({
        fromAddress: params.fromAddress,
        toAddress: params.toAddress,
        chainId: params.chainId,
        tokenAddress: params.tokenAddress,
        amount: params.amount,
        purchaseData: params.purchaseData,
        feePayer: params.feePayer,
      }),
    });

    if (!response.ok) {
      const errorObj = await response.json();
      if (errorObj && "error" in errorObj) {
        throw errorObj;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BuyWithCryptoTransferResponse = (await response.json()).result;

    const transfer: BuyWithCryptoTransfer = {
      transactionRequest: {
        chain: getCachedChain(data.transactionRequest.chainId),
        client: params.client,
        data: data.transactionRequest.data as Hash,
        to: data.transactionRequest.to as Address,
        value: BigInt(data.transactionRequest.value),
        extraGas: 50000n, // extra gas buffer
      },
      approvalData: data.approval,
      fromAddress: data.fromAddress,
      toAddress: data.toAddress,
      paymentToken: data.paymentToken,
      processingFee: data.processingFee,
      estimatedGasCostUSDCents: data.estimatedGasCostUSDCents,
      client: params.client,
    };

    return transfer;
  } catch (error) {
    console.error("Error getting buy with crypto transfer", error);
    throw error;
  }
}
