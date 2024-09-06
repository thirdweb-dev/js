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

export function uploadMetadata(
  options: BaseTransactionOptions<UploadMetadataParams>,
) {
  return generatedUploadMetadata({
    contract: options.contract,
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
  });
}
