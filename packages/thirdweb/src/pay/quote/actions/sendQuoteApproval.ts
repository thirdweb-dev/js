import { approve } from "../../../extensions/erc20/write/approve.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import { waitForReceipt } from "../../../transaction/actions/wait-for-tx-receipt.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { QuoteApprovalParams } from "./getQuote.js";

/**
 * Send a Quote Approval request using the connected wallet to approve the tokens for swapping.
 * @param wallet -
 * The connected [`Wallet`](https://portal.thirdweb.com/references/typescript/v5/Wallet) instance to use for sending the swap transaction
 * @param params -
 * The object of type [`QuoteApprovalParams`](https://portal.thirdweb.com/references/typescript/v5/QuoteApprovalParams).
 *
 * This can be obtained from the [`getSwapQuote`](https://portal.thirdweb.com/references/typescript/v5/getSwapQuote) function's response.
 * @returns Object of type `TransactionReceipt`.
 * @example
 *
 * ```ts
 * import { sendQuoteTransaction, getQuoteQuote, sendQuoteApproval } from "thirdweb/pay";
 *
 * // get a quote for a swapping tokens
 * const quote = await getSwapQuote(quoteParams);
 *
 * // if approval is required, send the approval transaction
 * if (quote.approval) {
 *  await sendQuoteApproval(wallet, quote.approval);
 * }
 *
 * // send the quoted transaction
 * const quoteTransaction = await sendQuoteTransaction(wallet, quote);
 *
 * // keep polling the status of the quoted transaction until it returns a success or failure status
 * const status = await getQuoteStatus(quoteTransaction);
 * ```
 */
export async function sendQuoteApproval(
  wallet: Wallet,
  params: QuoteApprovalParams,
) {
  const approvalTransaction = approve(params);

  const waitForReceiptOptions = await sendTransaction({
    transaction: approvalTransaction,
    wallet,
  });

  return await waitForReceipt(waitForReceiptOptions);
}
