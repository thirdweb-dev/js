export interface IStorageDownloader {
  download(url: string): Promise<any>;
}

export type GatewayUrls = {
  [key: string]: string[];
};
