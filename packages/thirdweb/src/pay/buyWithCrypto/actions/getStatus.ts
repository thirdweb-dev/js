import type { ThirdwebClient } from "../../../client/client.js";
import type { WaitForReceiptOptions } from "../../../transaction/actions/wait-for-tx-receipt.js";
import { getClientFetch } from "../../../utils/fetch.js";
import { getPayQuoteStatusUrl } from "../utils/definitions.js";
import type { QuoteTokenInfo } from "./getQuote.js";

// TODO: add JSDoc description for all properties

export type QuoteTransactionDetails = {
  transactionHash: string;
  token: QuoteTokenInfo;
  amountWei: string;
  amountUSDCents: number;
  completedAt?: number;
  explorerLink?: string;
};

export type BuyWithCryptoTransaction = {
  client: ThirdwebClient;
  transactionResult: WaitForReceiptOptions;
};

/**
 * The object returned by the [`getQuoteStatus`](https://portal.thirdweb.com/references/typescript/v5/getQuoteStatus) function to represent the status of a quoted transaction
 */
export type BuyWithCryptoStatus = {
  transactionId: string;
  transactionType: string;
  source: QuoteTransactionDetails;
  destination?: QuoteTransactionDetails;
  status: "COMPLETED" | "FAILED" | "PENDING";
  subStatus: number;
  fromAddress: string;
  toAddress: string;
  failureMessage?: string;
  bridgeUsed?: string;
};

/**
 * Gets the status of a buy with crypto transaction
 * @param buyWithCryptoTransaction - Object of type [`BuyWithCryptoTransaction`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoTransaction)
 * @example
 *
 * ```ts
 * import { sendTransaction, prepareTransaction } from "thirdweb";
 * import { getBuyWithCryptoStatus, getBuyWithCryptoQuote } from "thirdweb/pay";
 *
 * // get a quote between two tokens
 * const quote = await getBuyWithCryptoQuote(quoteParams);
 *
 * // if approval is required, send the approval transaction
 * if (quote.approval) {
 *  const preparedApproval = prepareTransaction(quote.approval);
 *  await sendTransaction({
 *    transaction,
 *    wallet,
 *  });
 * }
 *
 * // send the quoted transaction
 * const preparedTransaction = prepareTransaction(quote.transactionRequest);
 * const transactionResult = await sendTransaction({
 *    transaction,
 *    wallet,
 *  });
 * // keep polling the status of the quoted transaction until it returns a success or failure status
 * const status = await getBuyWithCryptoStatus({
 *    client,
 *    transactionResult,
 * }});
 * ```
 * @returns Object of type [`BuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoStatus)
 */
export async function getBuyWithCryptoStatus(
  buyWithCryptoTransaction: BuyWithCryptoTransaction,
): Promise<BuyWithCryptoStatus> {
  try {
    if (!buyWithCryptoTransaction.transactionResult.transactionHash) {
      throw new Error("Transaction hash is required");
    }
    const queryString = new URLSearchParams({
      transactionHash:
        buyWithCryptoTransaction.transactionResult.transactionHash,
    }).toString();
    const url = `${getPayQuoteStatusUrl()}?${queryString}`;

    const response = await getClientFetch(buyWithCryptoTransaction.client)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BuyWithCryptoStatus = (await response.json())["result"];
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
