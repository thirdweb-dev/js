import type { SwapApprovalParams } from "./getSwap.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import { waitForReceipt } from "../../../transaction/actions/wait-for-tx-receipt.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import { approve } from "../../../extensions/erc20/write/approve.js";

/**
 * Send a Swap Approval request using the connected wallet to approve the tokens for swapping.
 * @param wallet -
 * The connected [`Wallet`](https://portal.thirdweb.com/references/typescript/v5/Wallet) instance to use for sending the swap transaction
 * @param params -
 * The object of type [`SwapApprovalParams`](https://portal.thirdweb.com/references/typescript/v5/SwapApprovalParams).
 *
 * This can be obtained from the [`getTokenSwapQuote`](https://portal.thirdweb.com/references/typescript/v5/getTokenSwapQuote) function's response.
 * @returns Object of type `TransactionReceipt`.
 * @example
 *
 * ```ts
 * import { sendSwapTransaction, getSwapQuote, sendSwapApproval } from "thirdweb/pay";
 *
 * // get a quote for a swapping tokens
 * const quote = await getSwapQuote(quoteParams);
 *
 * // if approval is required, send the approval transaction
 * if (quote.approval) {
 *  await sendSwapApproval(wallet, quote.approval);
 * }
 *
 * // send the swap transaction
 * const swapTransaction = await sendSwapTransaction(wallet, quote);
 *
 * // keep polling the status of the swap transaction until it returns a success or failure status
 * const status = await getSwapStatus(swapTransaction);
 * ```
 */
export async function sendSwapApproval(
  wallet: Wallet,
  params: SwapApprovalParams,
) {
  const approvalTransaction = approve(params);

  const waitForReceiptOptions = await sendTransaction({
    transaction: approvalTransaction,
    wallet,
  });

  return await waitForReceipt(waitForReceiptOptions);
}
