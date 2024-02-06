import { decimals } from "./decimals.js";
import { formatUnits } from "viem";
import { symbol } from "./symbol.js";
import type { TxOpts } from "../../../transaction/transaction.js";
import { readContract } from "../../../transaction/actions/read.js";

const METHOD = "function balanceOf(address) view returns (uint256)" as const;

type BalanceOfParams = { address: string };

type BalanceOfResult = {
  value: bigint;
  decimals: number;
  displayValue: string;
  symbol: string;
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
  options: TxOpts<BalanceOfParams>,
): Promise<BalanceOfResult> {
  const [balanceWei, decimals_, symbol_] = await Promise.all([
    readContract({
      ...options,
      method: METHOD,
      params: [options.address],
    }),
    decimals(options),
    symbol(options),
  ]);
  return {
    value: balanceWei,
    decimals: decimals_,
    displayValue: formatUnits(balanceWei, decimals_),
    symbol: symbol_,
  };
}
