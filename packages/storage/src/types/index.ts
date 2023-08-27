import {
  GatewayUrls,
  IStorageDownloader,
  SingleDownloadOptions,
} from "./download";
import { IStorageUploader, UploadOptions } from "./upload";

export type ThirdwebStorageOptions<T extends UploadOptions> = {
  uploader?: IStorageUploader<T>;
  downloader?: IStorageDownloader;
  gatewayUrls?: GatewayUrls | string[];
  uploadServerUrl?: string;
  clientId?: string;
  secretKey?: string;
};

export interface IThirdwebStorage {
  resolveScheme(url: string): string;
  download(url: string, options?: SingleDownloadOptions): Promise<Response>;
  downloadJSON<TJSON = any>(url: string): Promise<TJSON>;
  upload(data: any, options?: { [key: string]: any }): Promise<string>;
  uploadBatch(data: any[], options?: { [key: string]: any }): Promise<string[]>;
  getGatewayUrls(): GatewayUrls;
}

export * from "./download";
export * from "./upload";
export * from "./data";
