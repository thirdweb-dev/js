import { FileOrBufferOrString } from "./data";
import { GatewayUrls } from "./download";

export type UploadOptions = { [key: string]: any };

export interface IStorageUploader<T extends UploadOptions> {
  gatewayUrls?: GatewayUrls;
  uploadWithGatewayUrl?: boolean;
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
  gatewayUrls?: GatewayUrls;
  uploadWithGatewayUrl?: boolean;
};

export type IpfsUploadBatchOptions = {
  rewriteFileNames?: {
    fileStartNumber: number;
  };
  uploadWithGatewayUrl?: boolean;
  onProgress?: (event: UploadProgressEvent) => void;
  uploadWithoutDirectory?: boolean;
};
