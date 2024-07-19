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
};

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
      value: erc20Value.amountWei,
      spender: target,
    });
  }

  return null;
}
