import type { Address } from "abitype";
import {
  prepareContractCall,
  type TxOpts,
} from "../../../transaction/transaction.js";
import { parseUnits } from "../../../utils/units.js";

export type ApproveParams = { spender: Address } & (
  | {
      amount: number | string;
    }
  | {
      amountWei: bigint;
    }
);

/**
 * Approves the spending of tokens by a specific address.
 * @param options - The transaction options.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { approve } from "thirdweb/extensions/erc20";
 * const tx = await approve({
 *  contract,
 *  spender: "0x...",
 *  amount: 100,
 * });
 * ```
 */
export function approve(options: TxOpts<ApproveParams>) {
  return prepareContractCall({
    ...options,
    method: "function approve(address spender, uint256 value) returns (bool)",
    params: async () => {
      let amount: bigint;
      if ("amount" in options) {
        // if we need to parse the amount from ether to gwei then we pull in the decimals extension
        const { decimals } = await import("../read/decimals.js");
        // if this fails we fall back to `18` decimals
        const d = await decimals(options).catch(() => 18);
        // turn ether into gwei
        amount = parseUnits(options.amount.toString(), d);
      } else {
        amount = options.amountWei;
      }
      return [options.spender, amount] as const;
    },
  });
}
