/**
 * @public
 */
export interface IStorageDownloader {
  /**
   * Gateway URLs used to replace schemes on download
   */
  gatewayUrls: GatewayUrls;
  /**
   * Download arbitrary data from any URL scheme
   *
   * @param url - The URL to download data from
   * @returns The response object of the fetch
   */
  download(url: string): Promise<Response>;
}

/**
 * @public
 */
export type GatewayUrls = {
  [key: string]: string[];
};

/**
 * @internal
 */
export type MemoryStorage = Record<string, Record<string, any>>;
