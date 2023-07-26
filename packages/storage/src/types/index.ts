import { GatewayUrls, IStorageDownloader } from "./download";
import { IStorageUploader, UploadOptions } from "./upload";

export type ThirdwebStorageOptions<T extends UploadOptions> = {
  uploader?: IStorageUploader<T>;
  downloader?: IStorageDownloader;
  gatewayUrls?: GatewayUrls | string[];
  clientId?: string;
  secretKey?: string;
  authToken?: string;
};

export interface IThirdwebStorage {
  resolveScheme(url: string): string;
  download(url: string): Promise<Response>;
  downloadJSON<TJSON = any>(url: string): Promise<TJSON>;
  upload(data: any, options?: { [key: string]: any }): Promise<string>;
  uploadBatch(data: any[], options?: { [key: string]: any }): Promise<string[]>;
  getGatewayUrls(): GatewayUrls;
}

export * from "./download";
export * from "./upload";
export * from "./data";
