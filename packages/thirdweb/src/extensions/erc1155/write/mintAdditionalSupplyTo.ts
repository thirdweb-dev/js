import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { uri } from "../__generated__/IERC1155/read/uri.js";
import { mintTo as generatedMintTo } from "../__generated__/IMintableERC1155/write/mintTo.js";

export type MintAdditionalSupplyToParams = {
  to: string;
  tokenId: bigint;
  supply: bigint;
};

/**
 * Mints a "supply" number of additional ERC1155 tokens to the specified "to" address.
 * @param options - The transaction options.
 * @returns A promise that resolves to the transaction result.
 * @extension ERC1155
 * @example
 * ```ts
 * import { mintAdditionalSupplyTo } from "thirdweb/extensions/erc1155";
 * const transaction = mintAdditionalSupplyTo({
 *  contract,
 *  to: "0x...",
 *  tokenId: 1n,
 *  supply: 10n,
 * });
 *
 * const { transactionHash } = await sendTransaction({ transaction, account });
 *
 * ```
 */
export function mintAdditionalSupplyTo(
  options: BaseTransactionOptions<MintAdditionalSupplyToParams>,
) {
  return generatedMintTo({
    contract: options.contract,
    asyncParams: async () => {
      // we'll be re-using the exising token URI
      const tokenUri = await uri({
        contract: options.contract,
        tokenId: options.tokenId,
      });

      return {
        to: options.to,
        tokenId: options.tokenId,
        uri: tokenUri,
        amount: options.supply,
      };
    },
  });
}
