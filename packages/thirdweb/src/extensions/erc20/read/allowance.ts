import type { Address } from "abitype";
import {
  readContract,
  type BaseTransactionOptions,
} from "../../../transaction/index.js";

export type AllowanceParams = {
  owner: Address;
  spender: Address;
};

/**
 * Retrieves the allowance of tokens that the spender is allowed to spend on behalf of the owner.
 * @param options - The transaction options including owner and spender addresses.
 * @returns A promise that resolves to the allowance as a bigint.
 * @extension ERC20
 * @example
 * ```ts
 * import { allowance } from "thirdweb/extensions/erc20";
 * const spenderAllowance = await allowance({ contract, owner, spender });
 * ```
 */
export function allowance(
  options: BaseTransactionOptions<AllowanceParams>,
): Promise<bigint> {
  return readContract({
    ...options,
    method:
      "function allowance(address owner, address spender) view returns (uint256)",
    params: [options.owner, options.spender],
  });
}
