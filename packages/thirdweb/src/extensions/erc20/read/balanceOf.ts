import { read } from "../../../transaction/actions/read.js";
import { decimals } from "./decimals.js";
import { formatUnits } from "viem";
import { symbol } from "./symbol.js";
import { type TxOpts } from "../../../transaction/transaction.js";
import { createReadExtension } from "../../../utils/extension.js";

type BalanceOfParams = { address: string };

/**
 * Retrieves the balance of an ERC20 token for a specific address.
 * @param options - The transaction options including the address to check the balance for.
 * @returns An object containing the balance value, display value, and symbol of the ERC20 token.
 */
export const balanceOf = /* @__PURE__ */ createReadExtension("erc20.balanceOf")(
  async function (options: TxOpts<BalanceOfParams>) {
    const [balanceWei, decimals_, symbol_] = await Promise.all([
      read({
        ...options,
        method: "function balanceOf(address) view returns (uint256)",
        params: [options.address],
      }),
      decimals(options),
      symbol(options),
    ]);
    return {
      value: balanceWei,
      displayValue: formatUnits(balanceWei, decimals_),
      symbol: symbol_,
    };
  },
);
