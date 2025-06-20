import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { uploadMetadata as generatedUploadMetadata } from "../__generated__/BatchMetadataERC721/write/uploadMetadata.js";

export type UploadMetadataParams = {
  metadatas: (NFTInput | string)[];
};

/**
 * Uploads metadata for a batch of NFTs.
 * @param options - The options for the transaction.
 * @param options.contract - The contract to upload the metadata for.
 * @param options.metadatas - The metadata for the NFTs.
 * @returns The transaction to upload the metadata.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 *
 * const transaction = BatchMetadataERC721.uploadMetadata({
 *   contract,
 *   metadatas: [
 *     { name: "My NFT", description: "This is my NFT" },
 *   ],
 * });
 *
 * await sendTransaction({
 *   transaction,
 *   account,
 * });
 * ```
 */
export function uploadMetadata(
  options: BaseTransactionOptions<UploadMetadataParams>,
) {
  return generatedUploadMetadata({
    asyncParams: async () => {
      const batchOfUris = await uploadOrExtractURIs(
        options.metadatas,
        options.contract.client,
      );
      const baseURI = getBaseUriFromBatch(batchOfUris);

      return {
        amount: BigInt(batchOfUris.length),
        baseURI,
      } as const;
    },
    contract: options.contract,
  });
}
