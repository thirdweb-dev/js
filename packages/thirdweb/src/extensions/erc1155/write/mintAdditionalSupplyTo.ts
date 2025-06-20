import type { BaseTransactionOptions } from "../../../transaction/types.js";
import * as URI from "../__generated__/IERC1155/read/uri.js";
import * as MintTo from "../__generated__/IMintableERC1155/write/mintTo.js";

/**
 * @extension ERC1155
 */
export type MintAdditionalSupplyToParams = {
  to: string;
  tokenId: bigint;
  supply: bigint;
};

/**
 * Mints a "supply" number of additional ERC1155 tokens to the specified "to" address.
 * This method is only available on the `TokenERC1155` contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the transaction result.
 * @extension ERC1155
 * @example
 * ```ts
 * import { mintAdditionalSupplyTo } from "thirdweb/extensions/erc1155";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = mintAdditionalSupplyTo({
 *  contract,
 *  to: "0x...",
 *  tokenId: 1n,
 *  supply: 10n,
 * });
 *
 * await sendTransaction({ transaction, account });
 *
 * ```
 */
export function mintAdditionalSupplyTo(
  options: BaseTransactionOptions<MintAdditionalSupplyToParams>,
) {
  return MintTo.mintTo({
    asyncParams: async () => {
      return {
        amount: options.supply,
        to: options.to,
        tokenId: options.tokenId, // contract will maintain the existing token URI
        uri: "",
      };
    },
    contract: options.contract,
  });
}

/**
 * Checks if the `mintAdditionalSupplyTo` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `mintAdditionalSupplyTo` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isMintAdditionalSupplyToSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isMintAdditionalSupplyToSupported(["0x..."]);
 * ```
 */
export function isMintAdditionalSupplyToSupported(
  availableSelectors: string[],
) {
  return (
    MintTo.isMintToSupported(availableSelectors) &&
    URI.isUriSupported(availableSelectors)
  );
}
