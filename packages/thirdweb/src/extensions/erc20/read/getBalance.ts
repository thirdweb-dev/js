import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { toTokens } from "../../../utils/units.js";
import { balanceOf } from "../__generated__/IERC20/read/balanceOf.js";
import { decimals } from "../__generated__/IERC20Metadata/read/decimals.js";
import { name } from "../__generated__/IERC20Metadata/read/name.js";
import { symbol } from "../__generated__/IERC20Metadata/read/symbol.js";
/**
 * Represents the parameters for retrieving the balance of an address.
 */
export type GetBalanceParams = {
  /**
   * The address for which to retrieve the balance.
   */
  address: string;
};

/**
 * Represents the result of a balance query for an ERC20 token.
 */
export type GetBalanceResult = {
  value: bigint;
  decimals: number;
  displayValue: string;
  symbol: string;
  name: string;
};

/**
 * Retrieves the balance of an ERC20 token for a specific address.
 * @param options - The transaction options including the address.
 * @returns An object containing the balance value, display value, and symbol.
 * @extension ERC20
 * @example
 * ```ts
 * import { balanceOf } from "thirdweb/extensions/erc20";
 *
 * const balance = await balanceOf({ contract, address: "0x..." });
 * ```
 */
export async function getBalance(
  options: BaseTransactionOptions<GetBalanceParams>,
): Promise<GetBalanceResult> {
  const [balanceWei, decimals_, symbol_, name_] = await Promise.all([
    balanceOf(options),
    decimals(options),
    symbol(options),
    name(options),
  ]);
  return {
    value: balanceWei,
    decimals: decimals_,
    displayValue: toTokens(balanceWei, decimals_),
    symbol: symbol_,
    name: name_,
  };
}
