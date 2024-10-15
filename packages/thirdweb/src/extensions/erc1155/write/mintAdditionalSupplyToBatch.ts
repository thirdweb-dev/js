import { multicall } from "../../../extensions/common/__generated__/IMulticall/write/multicall.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { uri } from "../__generated__/IERC1155/read/uri.js";
import { encodeMintTo } from "../__generated__/IMintableERC1155/write/mintTo.js";
import type { MintAdditionalSupplyToParams } from "./mintAdditionalSupplyTo.js";

/**
 * @extension ERC1155
 */
export type MintAdditionalSupplyToBatchParams = {
  nfts: MintAdditionalSupplyToParams[];
};

/**
 * This extension batches multiple `mintAdditionalSupplyToBatch` extensions into one single multicall.
 * Keep in mind that there is a limit of how many NFTs you can mint per transaction.
 * This limit varies depends on the network that you are transacting on.
 *
 * You are recommended to experiment with the number to figure out the best number for your chain of choice.
 * @extension ERC1155
 * @example
 * ```ts
 * import { mintAdditionalSupplyToBatch } from "thirdweb/extensions/erc1155";
 *
 * const transaction = mintAdditionalSupplyToBatch({
 *   contract,
 *   nfts: [
 *     { tokenId: 0n, supply: 99n, to: account.address },
 *     { tokenId: 1n, supply: 98n, to: account.address },
 *     { tokenId: 2n, supply: 97n, to: account.address },
 *   ],
 * });
 * ```
 */
export function mintAdditionalSupplyToBatch(
  options: BaseTransactionOptions<MintAdditionalSupplyToBatchParams>,
) {
  return multicall({
    contract: options.contract,
    asyncParams: async () => {
      const data = await Promise.all(
        options.nfts.map(async (nft) => {
          const tokenUri = await uri({
            contract: options.contract,
            tokenId: nft.tokenId,
          });
          return encodeMintTo({
            to: nft.to,
            tokenId: nft.tokenId,
            amount: nft.supply,
            uri: tokenUri,
          });
        }),
      );
      return { data };
    },
  });
}
