import type { Address } from "abitype";
import { parseUnits } from "../../../utils/units.js";
import {
  prepareContractCall,
  type BaseTransactionOptions,
} from "../../../transaction/index.js";
import type { Prettify } from "../../../utils/type-utils.js";

export type TransferFromParams = Prettify<
  { to: Address; from: Address } & (
    | {
        amount: number | string;
      }
    | {
        amountWei: bigint;
      }
  )
>;

/**
 * Transfers a specified amount of tokens from one address to another address on the ERC20 contract.
 * @param options - The transaction options including from, to, amount, and gas price.
 * @returns A promise that resolves to the prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { transferFrom } from "thirdweb/extensions/erc20";
 *
 * const transaction = transferFrom({
 *  contract: USDC_CONTRACT,
 *  from: "0x1234...",
 *  to: "0x5678...",
 *  amount: 100,
 * });
 * ```
 */
export function transferFrom(
  options: BaseTransactionOptions<TransferFromParams>,
) {
  return prepareContractCall({
    ...options,
    method: "function transferFrom(address from, address to, uint256 value)",
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
      return [options.from, options.to, amount] as const;
    },
  });
}
