import { GatewayUrls, IStorageDownloader } from "./download";
import { IStorageUploader, UploadOptions } from "./upload";

export type ThirdwebStorageOptions<T extends UploadOptions> = {
  uploader?: IStorageUploader<T>;
  downloader?: IStorageDownloader;
  gatewayUrls?: GatewayUrls | string[];
  clientId?: string;
  secretKey?: string;
};

export * from "./download";
export * from "./upload";
export * from "./data";
