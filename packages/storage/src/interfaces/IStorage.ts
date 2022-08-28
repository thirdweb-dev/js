import { FileOrBuffer, JsonObject } from "../types";
import { UploadProgressEvent } from "../types/events";
import { UploadResult } from "./IStorageUpload";

/**
 * Interface for any storage provider
 * @public
 */
export interface IStorage {
  /**
   * Fetches data from storage. This method expects to fetch JSON formatted data
   *
   * @param hash - The Hash of the file to fetch
   * @returns - The data, if found.
   */
  get(hash: string): Promise<Record<string, any>>;

  /**
   * Fetches data from storage. This method does not make any assumptions on the retrieved data format
   *
   * @param hash - The Hash of the file to fetch
   * @returns - The data, if found.
   */
  getRaw(hash: string): Promise<string>;

  /**
   * Uploads a file to the storage.
   *
   * @param data - The data to be uploaded. Can be a file/buffer (which will be loaded), or a string.
   * @param contractAddress - Optional. The contract address the data belongs to.
   * @param signerAddress - Optional. The address of the signer.
   * @param options - Optional. Upload progress callback.
   * @returns - The hash of the uploaded data.
   */
  upload(
    data: string | FileOrBuffer,
    contractAddress?: string,
    signerAddress?: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ): Promise<string>;

  /**
   * Uploads a folder to storage.
   *
   * @param files - An array of the data to be uploaded. Can be a files or buffers (which will be loaded), or strings. (can be mixed, too)
   * @param fileStartNumber - Optional. The first file file name begins with.
   * @param contractAddress - Optional. The contract address the data belongs to.
   * @param signerAddress - Optional. The address of the signer.
   * @param options - Optional. Upload progress callback.
   * @returns - The CID of the uploaded folder.
   */
  uploadBatch(
    files: (string | FileOrBuffer)[],
    fileStartNumber?: number,
    contractAddress?: string,
    signerAddress?: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ): Promise<UploadResult>;

  /**
   *
   * Uploads JSON metadata to IPFS
   *
   * @param metadata - The metadata to be uploaded.
   * @param contractAddress - Optional. The contract address the data belongs to.
   * @param signerAddress - Optional. The address of the signer.
   * @param options - Optional. Upload progress callback.
   */

  uploadMetadata(
    metadata: JsonObject,
    contractAddress?: string,
    signerAddress?: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ): Promise<string>;

  /**
   *
   * Uploads JSON metadata to IPFS
   *
   * @param metadatas - The metadata to be uploaded.
   * @param fileStartNumber - Optional. The first file file name begins with.
   * @param contractAddress - Optional. The contract address the data belongs to.
   * @param signerAddress - Optional. The address of the signer.
   * @param options - Optional. Upload progress callback.
   */
  uploadMetadataBatch(
    metadatas: JsonObject[],
    fileStartNumber?: number,
    contractAddress?: string,
    signerAddress?: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ): Promise<UploadResult>;
}
