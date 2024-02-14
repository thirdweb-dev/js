import { decimals } from "./decimals.js";
import { symbol } from "../../common/read/symbol.js";
import { name } from "../../common/read/name.js";
import {
  readContract,
  type BaseTransactionOptions,
} from "../../../transaction/index.js";
import { formatUnits } from "../../../utils/units.js";

const METHOD = "function balanceOf(address) view returns (uint256)" as const;

type BalanceOfParams = { address: string };

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
      method: METHOD,
      params: [options.address],
    }),
    decimals(options),
    symbol(options),
    name(options),
  ]);
  return {
    value: balanceWei,
    decimals: decimals_,
    displayValue: formatUnits(balanceWei, decimals_),
    symbol: symbol_,
    name: name_,
  };
}
