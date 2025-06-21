import { getContract } from "../../../contract/contract.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import { getAddress } from "../../../utils/address.js";
import { resolvePromisedValue } from "../../../utils/promise/resolve-promised-value.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { allowance } from "../__generated__/IERC20/read/allowance.js";
import { approve } from "../__generated__/IERC20/write/approve.js";

export type GetApprovalForTransactionParams = {
  /**
   * The transaction that involves the ERC20 token
   */
  transaction: PreparedTransaction;
  /**
   * The caller's account
   */
  account: Account;
};

/**
 * When dealing with transactions that involve ERC20 tokens (Airdropping ERC20, buy NFTs with ERC20, etc.)
 * you often have to do a pre-check to see if the targeted contract has the sufficient allowance to "take" the ERC20 tokens from the caller's wallet.
 *
 * This extension is a handy method that checks for the allowance and requests to approve for more if current allowance is insufficient
 *
 * @param options GetApprovalForTransactionParams
 * @returns a PreparedTransaction
 *
 * @example
 * ```ts
 * import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
 * import { sendAndConfirmTransaction } from "thirdweb";
 *
 * async function buyNFT() {
 *   const buyTransaction = ... // could be a marketplacev3's buyFromListing
 *
 *   // Check if you need to approve spending for the involved ERC20 contract
 *   const approveTx = await getApprovalForTransaction({
 *     transaction: buyTransaction,
 *     account, // the connected account
 *   });
 *   if (approveTx) {
 *     await sendAndConfirmTransaction({
 *       transaction: approveTx,
 *       account,
 *     })
 *   }
 *   // Once approved, you can finally perform the buy transaction
 *   await sendAndConfirmTransaction({
 *     transaction: buyTransaction,
 *     account,
 *   });
 * }
 * ```
 *
 * @transaction
 */
export async function getApprovalForTransaction(
  options: GetApprovalForTransactionParams,
): Promise<PreparedTransaction | null> {
  const { transaction, account } = options;
  if (!account) {
    return null;
  }

  const erc20Value = await resolvePromisedValue(transaction.erc20Value);
  if (erc20Value) {
    const target = await resolvePromisedValue(transaction.to);

    if (
      !target ||
      !erc20Value.tokenAddress ||
      getAddress(target) === getAddress(erc20Value.tokenAddress)
    ) {
      return null;
    }

    const contract = getContract({
      address: erc20Value.tokenAddress,
      chain: transaction.chain,
      client: transaction.client,
    });

    const approvedValue = await allowance({
      contract,
      owner: account.address,
      spender: target,
    });

    if (approvedValue > erc20Value.amountWei) {
      return null;
    }

    return approve({
      contract,
      spender: target,
      value: erc20Value.amountWei,
    });
  }

  return null;
}
