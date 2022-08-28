import { FileOrBuffer } from "../types";

/**
 * @internal
 */
export interface CidWithFileName {
  // base cid of the directory
  cid: string;

  // file name of the file without cid
  fileNames: string[];
}

export interface IStorageUpload {
  uploadBatchWithCid(
    files: (string | FileOrBuffer)[],
    fileStartNumber?: number,
    contractAddress?: string,
    signerAddress?: string,
  ): Promise<CidWithFileName>;
}
