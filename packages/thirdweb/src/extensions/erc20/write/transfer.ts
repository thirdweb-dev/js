import {
  prepareContractCall,
  type BaseTransactionOptions,
} from "../../../transaction/index.js";
import { parseUnits } from "../../../utils/units.js";

export type TransferParams = { to: string } & (
  | {
      amount: number | string;
    }
  | {
      amountWei: bigint;
    }
);

/**
 * Transfers ERC20 tokens from the sender's address to the specified recipient address.
 * @param options - The options for the transfer transaction.
 * @returns A promise that resolves to the prepared transaction.
 * @extension ERC20
 * @example
 * ```ts
 * import { transfer } from "thirdweb/extensions/erc20";
 * const tx = await transfer({
 *  contract,
 *  to: "0x...",
 *  amount: 100,
 * });
 * ```
 */
export function transfer(options: BaseTransactionOptions<TransferParams>) {
  return prepareContractCall({
    ...options,
    method: "function transfer(address to, uint256 value)",
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
      return [options.to, amount] as const;
    },
  });
}
