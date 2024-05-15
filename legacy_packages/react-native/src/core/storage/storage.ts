import {
  GatewayUrls,
  IStorageUploader,
  IpfsUploadBatchOptions,
  ThirdwebStorageOptions,
  UploadOptions,
  parseGatewayUrls,
  replaceObjectSchemesWithGatewayUrls,
  replaceSchemeWithGatewayUrl,
  IThirdwebStorage,
  IStorageDownloader,
  StorageDownloader,
  SingleDownloadOptions,
} from "@thirdweb-dev/storage";

import { prepareGatewayUrls } from "./utils";
import { IpfsUploader } from "./uploader";
import { UploadDataValue } from "./types";

export class ThirdwebStorage<T extends UploadOptions = IpfsUploadBatchOptions>
  implements IThirdwebStorage
{
  private uploader: IStorageUploader<T>;
  private downloader: IStorageDownloader;
  private gatewayUrls: GatewayUrls;
  private clientId?: string;

  constructor(options?: ThirdwebStorageOptions<T>) {
    this.uploader =
      options?.uploader ||
      new IpfsUploader({
        clientId: options?.clientId,
      });
    this.downloader =
      options?.downloader ||
      new StorageDownloader({
        clientId: options?.clientId,
      });
    this.gatewayUrls = prepareGatewayUrls(
      parseGatewayUrls(options?.gatewayUrls),
      options?.clientId,
    );
    this.clientId = options?.clientId;
  }

  /**
   * Resolve any scheme on a URL to get a retrievable URL for the data
   *
   * @param url - The URL to resolve the scheme of
   * @returns The URL with its scheme resolved
   *
   * @example
   * ```jsx
   * const uri = "ipfs://example";
   * const url = storage.resolveScheme(uri);
   * console.log(url);
   * ```
   */
  resolveScheme(url: string): string {
    return replaceSchemeWithGatewayUrl(
      url,
      this.gatewayUrls,
      0,
      this.clientId,
    ) as string;
  }

  /**
   * Downloads arbitrary data from any URL scheme.
   *
   * @param url - The URL of the data to download
   * @returns The response object fetched from the resolved URL
   *
   * @example
   * ```jsx
   * const uri = "ipfs://example";
   * const data = await storage.download(uri);
   * ```
   */
  async download(
    url: string,
    options?: SingleDownloadOptions,
  ): Promise<Response> {
    return this.downloader.download(url, this.gatewayUrls, options);
  }

  /**
   * Downloads JSON data from any URL scheme.
   * Resolves any URLs with schemes to retrievable gateway URLs.
   *
   * @param url - The URL of the JSON data to download
   * @returns The JSON data fetched from the resolved URL
   *
   * @example
   * ```jsx
   * const uri = "ipfs://example";
   * const json = await storage.downloadJSON(uri);
   * ```
   */
  async downloadJSON<TJSON = any>(
    url: string,
    options?: SingleDownloadOptions,
  ): Promise<TJSON> {
    const res = await this.download(url, options);

    // If we get a JSON object, recursively replace any schemes with gatewayUrls
    const json = await res.json();
    return replaceObjectSchemesWithGatewayUrls(
      json,
      this.gatewayUrls,
      this.clientId,
    ) as TJSON;
  }

  /**
   * Upload arbitrary file or JSON data using the configured decentralized storage system.
   * Automatically uploads any file data within JSON objects and replaces them with hashes.
   *
   * @param data - Arbitrary file or JSON data to upload
   * @param options - Options to pass through to the storage uploader class
   * @returns  The URI of the uploaded data
   *
   * @example
   * ```jsx
   * // Upload an image
   * launchImageLibrary({mediaType: 'photo'}, async response => {
   *   if (response.assets?.[0]) {
   *      const {fileName, type, uri} = response.assets[0];
   *      if (!uri) {
   *        throw new Error('No uri');
   *      }
   *      const resp = await storage.upload({
   *        uri,
   *        type,
   *        name: fileName,
   *      });
   *    }
   *  });
   * const jsonUri = await storage.upload(json);
   * ```
   */
  async upload(data: UploadDataValue, options?: T): Promise<string> {
    const [uri] = await this.uploadBatch([data], options);
    return uri;
  }

  /**
   * Batch upload arbitrary file or JSON data using the configured decentralized storage system.
   * Automatically uploads any file data within JSON objects and replaces them with hashes.
   *
   * @param data - Array of arbitrary file or JSON data to upload
   * @param options - Options to pass through to the storage uploader class
   * @returns  The URIs of the uploaded data
   *
   * @example
   * ```jsx
   * // Upload an image
   * launchImageLibrary({mediaType: 'photo'}, async response => {
   *   if (response.assets?.[0]) {
   *      const {fileName, type, uri} = response.assets[0];
   *      if (!uri) {
   *        throw new Error('No uri');
   *      }
   *      const resp = await storage.upload({
   *        uri,
   *        type,
   *        name: fileName,
   *      });
   *    }
   *  });
   *
   * // Upload an array of JSON objects
   * const objects = [
   *  { name: "JSON 1", text: "Hello World" },
   *  { name: "JSON 2", trait: "Awesome" },
   * ];
   * const jsonUris = await storage.uploadBatch(objects);
   * ```
   */
  async uploadBatch(data: UploadDataValue[], options?: T): Promise<string[]> {
    data = data.filter((item) => item !== undefined);

    if (!data.length) {
      return [];
    }

    const uris: string[] = await this.uploader.uploadBatch(data, options);

    if (options?.uploadWithGatewayUrl || this.uploader.uploadWithGatewayUrl) {
      return uris.map((uri) => this.resolveScheme(uri));
    } else {
      return uris;
    }
  }

  getGatewayUrls(): GatewayUrls {
    return this.gatewayUrls;
  }
}
