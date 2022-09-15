import { FileOrBuffer } from "./data";
import { GatewayUrls } from "./download";

export type UploadOptions = { [key: string]: any };

export interface IStorageUploader<T extends UploadOptions> {
  gatewayUrls?: GatewayUrls;
  uploadWithGatewayUrl?: boolean;
  uploadBatch(data: (string | FileOrBuffer)[], options?: T): Promise<string[]>;
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
  onProgress?: (event: UploadProgressEvent) => void;
};
