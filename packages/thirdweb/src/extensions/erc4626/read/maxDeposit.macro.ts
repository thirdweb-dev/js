import type { Address } from "abitype";
import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

export type MaxDepositParams = {
  /**
   * The address to check max deposit possible for.
   */
  address: Address;
};

/**
 * Returns the maximum amount of the underlying token that can be deposited into the Vault for the receiver, through a deposit call.
 * @param options - The transaction options including the address to check.
 * @returns Maximum number of underlying tokens that can be deposited by the provided address.
 * @extension ERC4626
 * @example
 * ```ts
 * import { maxDeposit } from "thirdweb/extensions/erc4626";
 *
 * const max = await maxDeposit({ contract, address: "0x..." });
 * ```
 */
export async function maxDeposit(
  options: BaseTransactionOptions<MaxDepositParams>,
): Promise<bigint> {
  const max = await readContract({
    ...options,
    method: $run$(() =>
      prepareMethod("function maxDeposit(address) returns (uint256)"),
    ),
    params: [options.address],
  });

  return max;
}
