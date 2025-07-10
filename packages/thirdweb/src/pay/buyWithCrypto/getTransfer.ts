import { Value } from "ox";
import * as ox__AbiFunction from "ox/AbiFunction";
import { Transfer } from "../../bridge/index.js";
import { getCachedChain } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { getContract } from "../../contract/contract.js";
import { decimals } from "../../extensions/erc20/read/decimals.js";
import type { PrepareTransactionOptions } from "../../transaction/prepare-transaction.js";
import type { PurchaseData } from "../types.js";
import type { QuoteApprovalInfo, QuotePaymentToken } from "./commonTypes.js";

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
  purchaseData?: PurchaseData;

  /**
   * For direct transfers, specify who will pay for the transfer fee. Can be "sender" or "receiver".
   */
  feePayer?: "sender" | "receiver";

  /**
   * @hidden
   */
  paymentLinkId?: string;
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
 * @deprecated
 * @buyCrypto
 */
export async function getBuyWithCryptoTransfer(
  params: GetBuyWithCryptoTransferParams,
): Promise<BuyWithCryptoTransfer> {
  try {
    const tokenContract = getContract({
      address: params.tokenAddress,
      chain: getCachedChain(params.chainId),
      client: params.client,
    });
    const tokenDecimals =
      tokenContract.address.toLowerCase() === NATIVE_TOKEN_ADDRESS
        ? 18
        : await decimals({
            contract: tokenContract,
          });
    const amount = Value.from(params.amount, tokenDecimals);
    const quote = await Transfer.prepare({
      amount,
      chainId: params.chainId,
      client: params.client,
      feePayer: params.feePayer,
      paymentLinkId: params.paymentLinkId,
      purchaseData: params.purchaseData,
      receiver: params.toAddress,
      sender: params.fromAddress,
      tokenAddress: params.tokenAddress,
    });

    const firstStep = quote.steps[0];
    if (!firstStep) {
      throw new Error(
        "This quote is incompatible with getBuyWithCryptoTransfer. Please use Bridge.Transfer.prepare instead.",
      );
    }

    const approvalTxs = firstStep.transactions.filter(
      (tx) => tx.action === "approval",
    );
    if (approvalTxs.length > 1) {
      throw new Error(
        "This quote is incompatible with getBuyWithCryptoTransfer. Please use Bridge.Transfer.prepare instead.",
      );
    }
    const approvalTx = approvalTxs[0];

    let approvalData: QuoteApprovalInfo | undefined;
    if (approvalTx) {
      const abiFunction = ox__AbiFunction.from([
        "function approve(address spender, uint256 amount)",
      ]);
      const [spender, amount] = ox__AbiFunction.decodeData(
        abiFunction,
        approvalTx.data,
      );
      approvalData = {
        amountWei: amount.toString(),
        chainId: firstStep.originToken.chainId,
        spenderAddress: spender,
        tokenAddress: firstStep.originToken.address,
      };
    }

    const txs = firstStep.transactions.filter((tx) => tx.action !== "approval");
    if (txs.length > 1) {
      throw new Error(
        "This quote is incompatible with getBuyWithCryptoTransfer. Please use Bridge.Transfer.prepare instead.",
      );
    }
    const tx = txs[0];
    if (!tx) {
      throw new Error(
        "This quote is incompatible with getBuyWithCryptoTransfer. Please use Bridge.Transfer.prepare instead.",
      );
    }

    const transfer: BuyWithCryptoTransfer = {
      approvalData,
      client: params.client,
      estimatedGasCostUSDCents: 0,
      fromAddress: params.fromAddress,
      paymentToken: {
        amount: Value.format(
          quote.originAmount,
          firstStep.originToken.decimals,
        ).toString(),
        amountUSDCents:
          Number(
            Value.format(quote.originAmount, firstStep.originToken.decimals),
          ) *
          (firstStep.originToken.prices["USD"] || 0) *
          100,
        amountWei: quote.originAmount.toString(),
        token: {
          chainId: firstStep.originToken.chainId,
          decimals: firstStep.originToken.decimals,
          name: firstStep.originToken.name,
          priceUSDCents: (firstStep.originToken.prices["USD"] || 0) * 100,
          symbol: firstStep.originToken.symbol,
          tokenAddress: firstStep.originToken.address,
        },
      },
      processingFee: {
        amount:
          params.feePayer === "sender"
            ? Value.format(
                quote.originAmount - quote.destinationAmount,
                firstStep.originToken.decimals,
              ).toString()
            : "0",
        amountUSDCents:
          params.feePayer === "sender"
            ? Number(
                Value.format(
                  quote.originAmount - quote.destinationAmount,
                  firstStep.originToken.decimals,
                ),
              ) *
              (firstStep.originToken.prices["USD"] || 0) *
              100
            : 0,
        amountWei:
          params.feePayer === "sender"
            ? (quote.originAmount - quote.destinationAmount).toString()
            : "0",
        token: {
          chainId: firstStep.originToken.chainId,
          decimals: firstStep.originToken.decimals,
          name: firstStep.originToken.name,
          priceUSDCents: (firstStep.originToken.prices["USD"] || 0) * 100,
          symbol: firstStep.originToken.symbol,
          tokenAddress: firstStep.originToken.address,
        },
      },
      toAddress: params.toAddress,
      transactionRequest: {
        ...tx,
        extraGas: 50000n, // extra gas buffer
      },
    };

    return transfer;
  } catch (error) {
    console.error("Error getting buy with crypto transfer", error);
    throw error;
  }
}
