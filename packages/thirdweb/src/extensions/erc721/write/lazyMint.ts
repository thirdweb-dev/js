import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import {
  isNextTokenIdToMintSupported,
  nextTokenIdToMint,
} from "../__generated__/IERC721Enumerable/read/nextTokenIdToMint.js";
import * as LazyMint from "../__generated__/ILazyMint/write/lazyMint.js";

/**
 * @extension ERC721
 */
export type LazyMintParams = {
  nfts: (NFTInput | string)[];
};

/**
 * Lazily mints ERC721 tokens.
 * This method is only available on the `DropERC721` contract.
 *
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
  return LazyMint.lazyMint({
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
    contract: options.contract,
  });
}

/**
 * Checks if the `lazyMint` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `lazyMint` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isLazyMintSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isLazyMintSupported(["0x..."]);
 * ```
 */
export function isLazyMintSupported(availableSelectors: string[]) {
  return (
    LazyMint.isLazyMintSupported(availableSelectors) &&
    // required because we use it in the lazyMint function
    isNextTokenIdToMintSupported(availableSelectors)
  );
}
