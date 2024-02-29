import { decimals } from "./decimals.js";
import { symbol } from "../../common/read/symbol.js";
import { name } from "../../common/read/name.js";
import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { toTokens } from "../../../utils/units.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Represents the parameters for retrieving the balance of an address.
 */
type BalanceOfParams = {
  /**
   * The address for which to retrieve the balance.
   */
  address: string;
};

/**
 * Represents the result of a balance query for an ERC20 token.
 */
type BalanceOfResult = {
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
export async function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>,
): Promise<BalanceOfResult> {
  const [balanceWei, decimals_, symbol_, name_] = await Promise.all([
    readContract({
      ...options,
      method: $run$(() =>
        prepareMethod("function balanceOf(address) returns (uint256)"),
      ),
      params: [options.address],
    }),
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
