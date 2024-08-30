import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { nextTokenIdToMint } from "../../erc721/__generated__/IERC721Enumerable/read/nextTokenIdToMint.js";
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
      const startFileNumber = await nextTokenIdToMint({
        contract: options.contract,
      });

      const batchOfUris = await uploadOrExtractURIs(
        options.metadatas,
        options.contract.client,
        // TODO: this is potentially unsafe since it *may* be bigger than what Number can represent, however the likelyhood is very low (fine, for now)
        Number(startFileNumber),
      );
      const baseURI = getBaseUriFromBatch(batchOfUris);

      return {
        amount: BigInt(batchOfUris.length),
        baseURI,
      } as const;
    },
  });
}
