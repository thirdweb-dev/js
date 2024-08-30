import {} from "../../../utils/ipfs.js";
import {
  type UploadMetadataParams as CommonUploadMetadataParams,
  uploadMetadata as commonUploadMetadata,
} from "../BatchMetadataERC721/uploadMetadata.js";

export type UploadMetadataParams = CommonUploadMetadataParams;

// exact same implementation as BatchMetadataERC721
export const uploadMetadata = commonUploadMetadata;
