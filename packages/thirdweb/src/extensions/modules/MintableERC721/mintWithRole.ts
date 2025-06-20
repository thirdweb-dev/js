import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAddress } from "../../../utils/address.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { mint as generatedMint } from "../__generated__/ERC721Core/write/mint.js";

export type NFTMintParams = {
  to: string;
  nfts: (NFTInput | string)[];
};

/**
 * Mints ERC721 tokens to a specified address via a MintableERC721 module.
 * @param options The options for minting tokens.
 * @returns A transaction to mint tokens.
 * @example
 * ```typescript
 * import { MintableERC721 } from "thirdweb/modules";
 *
 * const transaction = MintableERC721.mintWithRole({
 *   contract,
 *   to: "0x...", // Address to mint tokens to
 *   nfts: [
 *     {
 *       name: "My NFT",
 *       description: "This is my NFT",
 *       image: "ipfs://...",
 *     },
 *   ],
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules MintableERC721
 */
export function mintWithRole(options: BaseTransactionOptions<NFTMintParams>) {
  return generatedMint({
    asyncParams: async () => {
      let baseURI = "";
      if (options.nfts?.[0] !== "") {
        const batchOfUris = await uploadOrExtractURIs(
          options.nfts,
          options.contract.client,
        );
        baseURI = getBaseUriFromBatch(batchOfUris);
      }

      return {
        amount: BigInt(options.nfts.length),
        baseURI,
        data: "0x",
        to: getAddress(options.to),
      };
    },
    contract: options.contract,
  });
}
