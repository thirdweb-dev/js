import type { SwapRoute } from "./getSwap.js";
import type { SwapStatusParams } from "./getStatus.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import {
  prepareTransaction,
  type PrepareTransactionOptions,
} from "../../../transaction/prepare-transaction.js";
import { waitForReceipt } from "../../../transaction/actions/wait-for-tx-receipt.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { approve } from "../../../extensions/erc20/write/approve.js";
import type { Hex, Address } from "viem";

// TODO: Support User Op Hash
/**
 * Retrieves contract events from the blockchain.
 * @param account - the account performing the swap
 * @param route - swap route returned from getRoute
 * @returns SwapStatusParams to be used in getSwapStatus
 * @example
 *
 * ```ts
 * import { sendSwap } from "thirdweb/pay";
 *
 * const swapStatusParams = await sendSwap({
 *  account,
 *  route
 * });
 *
 * ```
 */
export async function sendSwap(
  account: Account,
  route: SwapRoute,
): Promise<SwapStatusParams> {
  if (route.approval) {
    /* approve the erc20 */
    const approvalTransaction = approve(route.approval);

    const waitForReceiptOptions = await sendTransaction({
      transaction: approvalTransaction,
      account,
    });

    await waitForReceipt(waitForReceiptOptions);
  }
  const txData = {
    to: route.transactionRequest.to as Address,
    data: route.transactionRequest.data as Hex,
    value: BigInt(route.transactionRequest.value),
    gas: BigInt(route.transactionRequest.gasLimit),
    gasPrice: BigInt(route.transactionRequest.gasPrice),
    chain: route.transactionRequest.chainId,
    client: route.client,
  } as PrepareTransactionOptions;

  const transaction = prepareTransaction({
    ...txData,
  });

  const waitForReceiptOptions = await sendTransaction({
    transaction,
    account,
  });

  return {
    transactionHash: waitForReceiptOptions.transactionHash as string,
    transactionId: route.transactionId,
    client: route.client,
  };
}
