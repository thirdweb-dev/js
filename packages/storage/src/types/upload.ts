import { FileOrBufferOrString } from "./data";

/**
 * @public
 */
export type UploadOptions = { [key: string]: any };

/**
 * @public
 */
export interface IStorageUploader<T extends UploadOptions> {
  /**
   * If specified, will upload objects with gateway URLs instead of schemes
   */
  uploadWithGatewayUrl?: boolean;
  /**
   * Upload an array of arbitrary file data or JSON strings
   *
   * @param data - Array of arbitrary file data or JSON strings to upload
   * @param options - Options to pass through to the uploader
   * @returns Array of uploaded file URIs
   */
  uploadBatch(data: FileOrBufferOrString[], options?: T): Promise<string[]>;
}

/**
 * @public
 */
export type UploadProgressEvent = {
  /**
   * The number of bytes uploaded.
   */
  progress: number;

  /**
   * The total number of bytes to be uploaded.
   */
  total: number;
};

/**
 * @public
 */
export type IpfsUploaderOptions = {
  /**
   * Whether or not to replace any URLs with schemes with resolved URLs before upload
   */
  uploadWithGatewayUrl?: boolean;
};

/**
 * @public
 */
export type IpfsUploadBatchOptions = {
  /**
   * If specified, will rewrite file names to numbers for use on-chain.
   * Useful to use with NFT contracts that map token IDs to files.
   */
  rewriteFileNames?: {
    /**
     * The start number to replace file names with
     */
    fileStartNumber: number;
  };
  /**
   * If specified, any URLs with schemes will be replaced with resolved URLs before upload
   */
  uploadWithGatewayUrl?: boolean;
  /**
   * Callback that gets triggered when file upload progresses
   */
  onProgress?: (event: UploadProgressEvent) => void;
  /**
   * If specified, will upload a single file without wrapping it in a directory
   */
  uploadWithoutDirectory?: boolean;
};
