import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { nextTokenIdToMint } from "../__generated__/IERC721Enumerable/read/nextTokenIdToMint.js";
import { lazyMint as generatedLazyMint } from "../__generated__/ILazyMint/write/lazyMint.js";

/**
 * @extension ERC721
 */
export type LazyMintParams = {
  nfts: (NFTInput | string)[];
};

/**
 * Lazily mints ERC721 tokens.
 * @param options - The options for the lazy minting process.
 * @returns A promise that resolves to the prepared contract call.
 * @extension ERC721
 * @example
 * ```ts
 * import { lazyMint } from "thirdweb/extensions/erc721";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = lazyMint({
 *   contract,
 *   nfts: [
 *     {
 *       name: "My NFT",
 *       description: "This is my NFT",
 *       image: "https://example.com/image.png",
 *     },
 *   ],
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function lazyMint(options: BaseTransactionOptions<LazyMintParams>) {
  return generatedLazyMint({
    contract: options.contract,
    asyncParams: async () => {
      const startFileNumber = await nextTokenIdToMint({
        contract: options.contract,
      });

      const batchOfUris = await uploadOrExtractURIs(
        options.nfts,
        options.contract.client,
        // TODO: this is potentially unsafe since it *may* be bigger than what Number can represent, however the likelyhood is very low (fine, for now)
        Number(startFileNumber),
      );

      const baseUri = getBaseUriFromBatch(batchOfUris);

      return {
        amount: BigInt(batchOfUris.length),
        baseURIForTokens: baseUri.endsWith("/") ? baseUri : `${baseUri}/`,
        extraData: "0x",
      } as const;
    },
  });
}
