import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { toWei } from "../../../utils/units.js";
import { FN_SELECTOR } from "../__generated__/IWETH/write/deposit.js";

/**
 * @extension ERC20
 */
export type DepositParams =
  | {
      amount: string;
    }
  | { amountWei: bigint };

/**
 * Calls the "deposit" function on the contract (useful to wrap ETH).
 * @param options - The options for the "deposit" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { deposit } from "thirdweb/extensions/erc20";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = deposit({ contract, amount: "0.1" });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function deposit(options: BaseTransactionOptions<DepositParams>) {
  const value =
    "amountWei" in options ? options.amountWei : toWei(options.amount);
  return prepareContractCall({
    contract: options.contract,
    erc20Value: {
      amountWei: value,
      tokenAddress: options.contract.address,
    },
    method: [FN_SELECTOR, [], []] as const,
    value,
  });
}
