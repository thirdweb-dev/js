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
} from "@thirdweb-dev/storage";

import { prepareGatewayUrls } from "./utils";
import { IpfsUploader } from "./uploader";
import { StorageDownloader } from "./downloader";

export class ThirdwebStorage<T extends UploadOptions = IpfsUploadBatchOptions>
  implements IThirdwebStorage
{
  private uploader: IStorageUploader<T>;
  private downloader: IStorageDownloader;
  private gatewayUrls: GatewayUrls;

  constructor(options?: ThirdwebStorageOptions<T>) {
    this.uploader =
      options?.uploader ||
      new IpfsUploader({
        clientId: options?.clientId,
      });
    this.downloader = options?.downloader || new StorageDownloader({});
    this.gatewayUrls = prepareGatewayUrls(
      parseGatewayUrls(options?.gatewayUrls),
      options?.clientId,
    );
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
    return replaceSchemeWithGatewayUrl(url, this.gatewayUrls) as string;
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
  async download(url: string): Promise<Response> {
    return this.downloader.download(url, this.gatewayUrls);
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
  async downloadJSON<TJSON = any>(url: string): Promise<TJSON> {
    const res = await this.download(url);

    // If we get a JSON object, recursively replace any schemes with gatewayUrls
    const json = await res.json();
    return replaceObjectSchemesWithGatewayUrls(json, this.gatewayUrls) as TJSON;
  }

  /**
   * Upload arbitrary file or JSON data using the configured decentralized storage system.
   * Automatically uploads any file data within JSON objects and replaces them with hashes.
   *
   * @param data - Arbitrary file or JSON data to upload
   * @param options - Options to pass through to the storage uploader class
   * @returns - The URI of the uploaded data
   *
   * @example
   * ```jsx
   * // Upload file data
   * const file = readFileSync("../file.jpg");
   * const fileUri = await storage.upload(file);
   *
   * // Or upload a JSON object
   * const json = { name: "JSON", image: file };
   * const jsonUri = await storage.upload(json);
   * ```
   */
  async upload(data: FormDataValue, options?: T): Promise<string> {
    const [uri] = await this.uploadBatch([data], options);
    return uri;
  }

  /**
   * Batch upload arbitrary file or JSON data using the configured decentralized storage system.
   * Automatically uploads any file data within JSON objects and replaces them with hashes.
   *
   * @param data - Array of arbitrary file or JSON data to upload
   * @param options - Options to pass through to the storage uploader class
   * @returns - The URIs of the uploaded data
   *
   * @example
   * ```jsx
   * // Upload an array of file data
   * const files = [
   *  readFileSync("../file1.jpg"),
   *  readFileSync("../file2.jpg"),
   * ];
   * const fileUris = await storage.uploadBatch(files);
   *
   * // Upload an array of JSON objects
   * const objects = [
   *  { name: "JSON 1", image: files[0] },
   *  { name: "JSON 2", image: files[1] },
   * ];
   * const jsonUris = await storage.uploadBatch(objects);
   * ```
   */
  async uploadBatch(data: FormDataValue[], options?: T): Promise<string[]> {
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
