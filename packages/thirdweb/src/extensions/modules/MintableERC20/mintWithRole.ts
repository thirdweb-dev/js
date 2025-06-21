import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAddress } from "../../../utils/address.js";
import { mint as generatedMint } from "../__generated__/ERC20Core/write/mint.js";

// TODO (modular) - this should be its own module

export type TokenMintParams = {
  to: string;
} & ({ quantity: string } | { quantityWei: bigint });

/**
 * Mints ERC20 tokens to a specified address via a MintableERC20 module.
 * @param options The options for minting tokens.
 * @returns A transaction to mint tokens.
 * @example
 * ```typescript
 * import { MintableERC20 } from "thirdweb/modules";
 *
 * const transaction = MintableERC20.mintWithRole({
 *   contract,
 *   to: "0x...", // Address to mint tokens to
 *   quantity: 2, // Amount of tokens to mint (in decimals)
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules MintableERC20
 */
export function mintWithRole(options: BaseTransactionOptions<TokenMintParams>) {
  return generatedMint({
    asyncParams: async () => {
      let amount = 0n;

      // if the quantity is already passed in wei, use it
      if ("quantityWei" in options) {
        amount = options.quantityWei;
      } else if ("quantity" in options) {
        // otherwise convert the quantity to wei using the contract's OWN decimals
        const { convertErc20Amount } = await import(
          "../../../utils/extensions/convert-erc20-amount.js"
        );
        amount = await convertErc20Amount({
          amount: options.quantity,
          chain: options.contract.chain,
          client: options.contract.client,
          erc20Address: options.contract.address,
        });
      }

      return {
        amount: BigInt(amount),
        data: "0x",
        to: getAddress(options.to),
      };
    },
    contract: options.contract,
  });
}
