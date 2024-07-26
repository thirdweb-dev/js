import { maxUint256 } from "viem";
import { getContract } from "../../../contract/contract.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import { getAddress } from "../../../utils/address.js";
import { resolvePromisedValue } from "../../../utils/promise/resolve-promised-value.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { allowance } from "../__generated__/IERC20/read/allowance.js";
import { approve } from "../__generated__/IERC20/write/approve.js";

export type GetApprovalForTransactionParams = {
  transaction: PreparedTransaction;
  account: Account;

  /**
   * By default, this extension only asks to approve the allowance by an exactly needed amount.
   *
   * Which means the next time users will likely have to do it again.
   *
   * If `approveInfinite` is set to `true`, this method will return a transaction for approving an infinite amount of ERC20 (aka. max unit256).
   * This option can potentially make the UX better since users don't have to approve every time.
   */
  approveInfinite?: boolean;
};

export async function getApprovalForTransaction(
  options: GetApprovalForTransactionParams,
): Promise<PreparedTransaction | null> {
  const { transaction, account, approveInfinite } = options;
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
      value: approveInfinite ? maxUint256 : erc20Value.amountWei,
      spender: target,
    });
  }

  return null;
}
