import type { FileOrBufferOrString } from "../../../storage/upload/types.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { Prettify } from "../../../utils/type-utils.js";
import { nextTokenIdToMint } from "../__generated__/IERC1155Enumerable/read/nextTokenIdToMint.js";
import { lazyMint as generatedLazyMint } from "../__generated__/ILazyMint/write/lazyMint.js";

/**
 * Represents the input data for creating an NFT (Non-Fungible Token).
 */
type NFTInput = Prettify<
  {
    name?: string;
    description?: string;
    image?: FileOrBufferOrString;
    animation_url?: FileOrBufferOrString;
    external_url?: FileOrBufferOrString;
    background_color?: string;
    // TODO check if we truly need both of these?
    properties?: Record<string, unknown> | Array<Record<string, unknown>>;
  } & Record<string, unknown>
>;

export type LazyMintParams = {
  nfts: (NFTInput | string)[];
};

/**
 * Lazily mints ERC1155 tokens.
 * @param options - The options for the lazy minting process.
 * @returns A promise that resolves to the prepared contract call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { lazyMint } from "thirdweb/extensions/erc1155";
 *
 * const tx = await lazyMint({
 * contract,
 * nfts: [
 *    {
 *      name: "My NFT",
 *      description: "This is my NFT",
 *      image: "https://example.com/image.png",
 *    },
 *  ],
 * });
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
