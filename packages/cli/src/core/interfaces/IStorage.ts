import { FileOrBuffer, JsonObject } from "../types";

/**
 * @internal
 */
export interface UploadMetadataBatchResult {
  // base cid of the directory
  baseUri: string;

  // path to each of the file within the directory, included full cid path
  metadataUris: string[];
}

/**
 * @public
 */
export interface IStorage {
  /**
   * Fetches a one-time-use upload token that can used to upload
   * a file to storage.
   *
   * @returns - The one time use token that can be passed to the Pinata API.
   */
  getUploadToken(contractAddress: string): Promise<string>;

  /**
   * Fetches data from storage. This method expects to fetch JSON formatted data
   *
   * @param hash - The Hash of the file to fetch
   * @returns - The data, if found.
   */
  get(hash: string): Promise<Record<string, any>>;

  /**
   * Uploads a file to the storage.
   *
   * @param data - The data to be uploaded. Can be a file/buffer (which will be loaded), or a string.
   * @param contractAddress - Optional. The contract address the data belongs to.
   * @param signerAddress - Optional. The address of the signer.
   *
   * @returns - The hash of the uploaded data.
   */
  upload(
    data: string | FileOrBuffer,
    contractAddress?: string,
    signerAddress?: string,
  ): Promise<string>;

  /**
   * Uploads a folder to storage.
   *
   * @param files - An array of the data to be uploaded. Can be a files or buffers (which will be loaded), or strings. (can be mixed, too)
   * @param fileStartNumber - Optional. The first file file name begins with.
   * @param contractAddress - Optional. The contract address the data belongs to.
   * @param signerAddress - Optional. The address of the signer.
   *
   * @returns - The CID of the uploaded folder.
   */
  uploadBatch(
    files: (string | FileOrBuffer)[],
    fileStartNumber?: number,
    contractAddress?: string,
    signerAddress?: string,
  ): Promise<UploadMetadataBatchResult>;

  /**
   *
   * Uploads JSON metadata to IPFS
   *
   * @param metadata - The metadata to be uploaded.
   * @param contractAddress - Optional. The contract address the data belongs to.
   * @param signerAddress - Optional. The address of the signer.
   */

  uploadMetadata(
    metadata: JsonObject,
    contractAddress?: string,
    signerAddress?: string,
  ): Promise<string>;

  /**
   *
   * Uploads JSON metadata to IPFS
   *
   * @param metadata - The metadata to be uploaded.
   * @param fileStartNumber - Optional. The first file file name begins with.
   * @param contractAddress - Optional. The contract address the data belongs to.
   * @param signerAddress - Optional. The address of the signer.
   */
  uploadMetadataBatch(
    metadatas: JsonObject[],
    fileStartNumber?: number,
    contractAddress?: string,
    signerAddress?: string,
  ): Promise<UploadMetadataBatchResult>;
}
