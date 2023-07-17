/**
 * @public
 */
export interface IStorageDownloader {
  /**
   * Download arbitrary data from any URL scheme
   *
   * @param url - The URL to download data from
   * @param gatewayUrls - The gateway URLs to use for this download
   * @returns The response object of the fetch
   */
  download(url: string, gatewayUrls?: GatewayUrls): Promise<Response>;
}

/**
 * @public
 */
export type IpfsDownloaderOptions = {
  /**
   * Optional secretKey to associate with the IpfsDownloader - when used from the backend.
   * You can get an secretKey here: https://thirdweb.com/create-api-key
   */
  secretKey?: string;

  /**
   * Optional clientId to associate with the IpfsDownloader - when used from the frontend.
   * You can get a clientId here: https://thirdweb.com/create-api-key
   */
  clientId?: string;
};

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
