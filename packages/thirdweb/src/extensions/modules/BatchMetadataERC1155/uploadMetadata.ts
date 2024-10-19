import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {
  type UploadMetadataParams as CommonUploadMetadataParams,
  uploadMetadata as commonUploadMetadata,
} from "../BatchMetadataERC721/uploadMetadata.js";

export type UploadMetadataParams = CommonUploadMetadataParams;

/**
 * Uploads metadata for a batch of NFTs.
 * @param options - The options for the transaction.
 * @param options.contract - The contract to upload the metadata for.
 * @param options.metadatas - The metadata for the NFTs.
 * @returns The transaction to upload the metadata.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 *
 * const transaction = BatchMetadataERC1155.uploadMetadata({
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
  return commonUploadMetadata(options);
}
