import { read } from "../../../transaction/actions/read.js";
import { decimals } from "./decimals.js";
import { formatUnits } from "viem";
import { symbol } from "./symbol.js";
import {
  extractTXOpts,
  type ThirdwebClientLike,
  type TxOpts,
} from "../../../transaction/transaction.js";

type BalanceOfParams = { address: string };

/**
 * Retrieves the balance of an ERC20 token for a specific address.
 *
 * @param options - The transaction options and balance query parameters.
 * @returns An object containing the balance value, display value, and symbol.
 */
export async function balanceOf<client extends ThirdwebClientLike>(
  options: TxOpts<client, BalanceOfParams>,
) {
  const [opts, params] = extractTXOpts(options);
  const [balanceWei, decimals_, symbol_] = await Promise.all([
    read({
      ...opts,
      method: "function balanceOf(address) view returns (uint256)",
      params: [params.address],
    }),
    decimals(options),
    symbol(options),
  ]);
  return {
    value: balanceWei,
    displayValue: formatUnits(balanceWei, decimals_),
    symbol: symbol_,
  };
}
