export interface IStorageDownloader {
  gatewayUrls: GatewayUrls;
  download(url: string): Promise<Response>;
}

export type GatewayUrls = {
  [key: string]: string[];
};

export type MemoryStorage = Record<string, Record<string, any>>;
