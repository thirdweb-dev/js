import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { toWei } from "../../../utils/units.js";
import { FN_SELECTOR } from "../__generated__/IWETH/write/deposit.js";

export type DepositParams =
  | {
      amount: string;
    }
  | { amountWei: bigint };

/**
 * Calls the "deposit" function on the contract.
 * @param options - The options for the "deposit" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { deposit } from "thirdweb/extensions/erc20";
 *
 * const transaction = deposit();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deposit(options: BaseTransactionOptions<DepositParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, [], []] as const,
    value: "amountWei" in options ? options.amountWei : toWei(options.amount),
  });
}
