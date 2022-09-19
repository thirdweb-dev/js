import { FileOrBufferOrString } from "./data";
import { GatewayUrls } from "./download";

export type UploadOptions = { [key: string]: any };

export interface IStorageUploader<T extends UploadOptions> {
  /**
   * If specified, will be used to replace any gateway URLs with schemes on upload
   */
  gatewayUrls?: GatewayUrls;
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

export type IpfsUploaderOptions = {
  /**
   * Mapping of URL schemes to gateway URLs to resolve to
   */
  gatewayUrls?: GatewayUrls;
  /**
   * Whether or not to replace any URLs with schemes with resolved URLs before upload
   */
  uploadWithGatewayUrl?: boolean;
};

export type IpfsUploadBatchOptions = {
  /**
   * If specified, will rewrite file names to numbers for use on-chain
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
