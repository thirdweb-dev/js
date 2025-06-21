import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../transaction/types.js";
import type { Prettify } from "../../../utils/type-utils.js";
import { toUnits } from "../../../utils/units.js";
import { mintTo as generatedMintTo } from "../__generated__/IMintableERC20/write/mintTo.js";

export { isMintToSupported } from "../__generated__/IMintableERC20/write/mintTo.js";

/**
 * Represents the parameters for the `mintTo` function.
 * @extension ERC20
 */
export type MintToParams = Prettify<
  WithOverrides<
    { to: string } & (
      | {
          amount: number | string;
        }
      | {
          amountWei: bigint;
        }
    )
  >
>;

/**
 * Mints a specified amount of tokens to a given address.
 * This method is only available on the `TokenERC20` contract.
 * @param options - The options for minting tokens.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { mintTo } from "thirdweb/extensions/erc20";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = mintTo({
 *  contract,
 *  to: "0x...",
 *  amount: 100,
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function mintTo(options: BaseTransactionOptions<MintToParams>) {
  return generatedMintTo({
    asyncParams: async () => {
      let amount: bigint;
      if ("amount" in options) {
        // if we need to parse the amount from ether to gwei then we pull in the decimals extension
        const { decimals } = await import("../read/decimals.js");
        // if this fails we fall back to `18` decimals
        const d = await decimals(options).catch(() => 18);
        // turn ether into gwei
        amount = toUnits(options.amount.toString(), d);
      } else {
        amount = options.amountWei;
      }
      return {
        amount: amount,
        overrides: options.overrides,
        to: options.to,
      } as const;
    },
    contract: options.contract,
  });
}
