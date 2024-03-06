import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../utils/type-utils.js";
import { toUnits } from "../../../utils/units.js";
/**
 * Represents the parameters for the `mintTo` function.
 */
export type MintToParams = Prettify<
  { to: string } & (
    | {
        amount: number | string;
      }
    | {
        amountWei: bigint;
      }
  )
>;

/**
 * Mints a specified amount of tokens to a given address.
 * @param options - The options for minting tokens.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { mintTo } from "thirdweb/extensions/erc20";
 * const tx = await mintTo({
 *  contract,
 *  to: "0x...",
 *  amount: 100,
 * });
 * ```
 */
export function mintTo(options: BaseTransactionOptions<MintToParams>) {
  return prepareContractCall({
    ...options,
    method: [
      "0x449a52f8",
      [
        {
          type: "address",
        },
        {
          type: "uint256",
        },
      ],
      [],
    ],
    params: async () => {
      let amount: bigint;
      if ("amount" in options) {
        // if we need to parse the amount from ether to gwei then we pull in the decimals extension
        const { decimals } = await import(
          "../__generated__/IERC20/read/decimals.js"
        );
        // if this fails we fall back to `18` decimals
        const d = await decimals(options).catch(() => 18);
        // turn ether into gwei
        amount = toUnits(options.amount.toString(), d);
      } else {
        amount = options.amountWei;
      }
      return [options.to, amount] as const;
    },
  });
}
