import type { Address } from "abitype";
import { readContract } from "../../../transaction/actions/read.js";
import type { TxOpts } from "../../../transaction/transaction.js";

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
export function allowance(options: TxOpts<AllowanceParams>): Promise<bigint> {
  return readContract({
    ...options,
    method:
      "function allowance(address owner, address spender) view returns (uint256)",
    params: [options.owner, options.spender],
  });
}
