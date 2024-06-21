import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import type {
  PayOnChainTransactionDetails,
  PayTokenInfo,
} from "../utils/commonTypes.js";
import { getPayBuyWithCryptoStatusUrl } from "../utils/definitions.js";

// TODO: add JSDoc description for all properties

export type BuyWithCryptoQuoteSummary = {
  fromToken: PayTokenInfo;
  toToken: PayTokenInfo;

  fromAmountWei: string;
  fromAmount: string;

  toAmountWei: string;
  toAmount: string;

  toAmountMin: string;
  toAmountMinWei: string;

  estimated: {
    fromAmountUSDCents: number;
    toAmountMinUSDCents: number;
    toAmountUSDCents: number;
    slippageBPS: number;
    feesUSDCents: number;
    gasCostUSDCents?: number;
    durationSeconds?: number;
  }; // SAME AS QUOTE

  createdAt: string; // ISO DATE
};

export type BuyWithCryptoTransaction = {
  client: ThirdwebClient;
  transactionHash: string;
};

export type BuyWithCryptoStatuses = "NONE" | "PENDING" | "FAILED" | "COMPLETED";

export type BuyWithCryptoSubStatuses =
  | "NONE"
  | "WAITING_BRIDGE"
  | "REVERTED_ON_CHAIN"
  | "SUCCESS"
  | "PARTIAL_SUCCESS"
  | "UNKNOWN_ERROR";

export type SwapType = "SAME_CHAIN" | "CROSS_CHAIN";

/**
 * The object returned by the [`getBuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoStatus) function to represent the status of a quoted transaction
 * @buyCrypto
 */
export type BuyWithCryptoStatus =
  | {
      status: "NOT_FOUND";
    }
  | {
      quote: BuyWithCryptoQuoteSummary;
      swapType: SwapType;
      source?: PayOnChainTransactionDetails;
      destination?: PayOnChainTransactionDetails;
      status: BuyWithCryptoStatuses;
      subStatus: BuyWithCryptoSubStatuses;
      fromAddress: string;
      toAddress: string;
      failureMessage?: string;
      bridge?: string;
      purchaseData?: object;
    };

export type ValidBuyWithCryptoStatus = Exclude<
  BuyWithCryptoStatus,
  { status: "NOT_FOUND" }
>;

/**
 * Gets the status of a buy with crypto transaction
 * @param buyWithCryptoTransaction - Object of type [`BuyWithCryptoTransaction`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoTransaction)
 * @example
 *
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { getBuyWithCryptoStatus, getBuyWithCryptoQuote } from "thirdweb/pay";
 *
 * // get a quote between two tokens
 * const quote = await getBuyWithCryptoQuote(quoteParams);
 *
 * // if approval is required, send the approval transaction
 * if (quote.approval) {
 *  const txResult = await sendTransaction({
 *    transaction: quote.approval,
 *    account: account, // account from connected wallet
 *  });
 *
 *  await waitForReceipt(txResult);
 * }
 *
 * // send the quoted transaction
 * const swapTxResult = await sendTransaction({
 *    transaction: quote.transactionRequest,
 *    account: account, // account from connected wallet
 *  });
 *
 * await waitForReceipt(swapTxResult);
 *
 * // keep polling the status of the quoted transaction until it returns a success or failure status
 * const status = await getBuyWithCryptoStatus({
 *    client,
 *    transactionHash: swapTxResult.transactionHash,
 * }});
 * ```
 * @returns Object of type [`BuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoStatus)
 * @buyCrypto
 */
export async function getBuyWithCryptoStatus(
  buyWithCryptoTransaction: BuyWithCryptoTransaction,
): Promise<BuyWithCryptoStatus> {
  try {
    if (!buyWithCryptoTransaction.transactionHash) {
      throw new Error("Transaction hash is required");
    }
    const queryString = new URLSearchParams({
      transactionHash: buyWithCryptoTransaction.transactionHash,
    }).toString();
    const url = `${getPayBuyWithCryptoStatusUrl()}?${queryString}`;

    const response = await getClientFetch(buyWithCryptoTransaction.client)(url);

    // Assuming the response directly matches the BuyWithCryptoStatus interface
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BuyWithCryptoStatus = (await response.json()).result;
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}
