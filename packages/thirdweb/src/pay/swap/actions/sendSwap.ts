import { type SwapRoute } from "./getSwap.js";
import { type SwapStatusParams } from "./getStatus.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import { waitForReceipt } from "../../../transaction/actions/wait-for-tx-receipt.js";
import { type Account } from "../../../wallets/interfaces/wallet.js";
import { getContract } from "../../../contract/contract.js";
import { defineChain } from "../../../chain/index.js";
import { approve } from "../../../extensions/erc20/write/approve.js";
import { type Hex } from "viem";

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
    const chain = defineChain(route.approval.chainId);
    const contract = getContract({
      client: route.client,
      address: route.approval.tokenAddress,
      chain,
    });

    const approvalTransaction = await approve({
      contract,
      spender: route.approval.spenderAddress,
      amount: route.approval.amountWei,
    });

    const waitForReceiptOptions = await sendTransaction({
      transaction: approvalTransaction,
      account,
    });

    await waitForReceipt(waitForReceiptOptions);
  }
  const transaction = {
    to: route.transactionRequest.to,
    data: route.transactionRequest.data as Hex,
    value: BigInt(route.transactionRequest.value),
    gas: BigInt(route.transactionRequest.gasLimit),
    gasPrice: BigInt(route.transactionRequest.gasPrice),
    chain: defineChain(route.transactionRequest.chainId),
    client: route.client,
  };

  const waitForReceiptOptions = await sendTransaction({
    transaction,
    account,
  });

  return {
    transactionHash: (waitForReceiptOptions.transactionHash ||
      waitForReceiptOptions.userOpHash) as string,
    transactionId: route.transactionId,
    client: route.client,
  };
}
