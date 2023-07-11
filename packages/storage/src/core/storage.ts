import { parseGatewayUrls, prepareGatewayUrls } from "../common";
import {
  extractObjectFiles,
  isFileOrBuffer,
  replaceObjectFilesWithUris,
  replaceObjectGatewayUrlsWithSchemes,
  replaceObjectSchemesWithGatewayUrls,
  replaceSchemeWithGatewayUrl,
} from "../common/utils";
import {
  FileOrBufferOrString,
  GatewayUrls,
  IpfsUploadBatchOptions,
  IStorageDownloader,
  ThirdwebStorageOptions,
  IStorageUploader,
  UploadOptions,
} from "../types";
import { StorageDownloader } from "./downloaders/storage-downloader";
import { IpfsUploader } from "./uploaders/ipfs-uploader";

/**
 * Upload and download files from decentralized storage systems.
 *
 * @example
 * ```jsx
 * // Create a default storage class without any configuration
 * const storage = new ThirdwebStorage();
 *
 * // Upload any file or JSON object
 * const uri = await storage.upload(data);
 * const result = await storage.download(uri);
 *
 * // Or configure a custom uploader, downloader, and gateway URLs
 * const gatewayUrls = {
 *   // We define a mapping of schemes to gateway URLs
 *   "ipfs://": [
 *     "https://ipfs.thirdwebcdn.com/ipfs/",
 *     "https://cloudflare-ipfs.com/ipfs/",
 *     "https://ipfs.io/ipfs/",
 *   ],
 * };
 * const downloader = new StorageDownloader();
 * const uploader = new IpfsUploader();
 * const storage = new ThirdwebStorage({ uploader, downloader, gatewayUrls });
 * ```
 *
 * @public
 */
export class ThirdwebStorage<T extends UploadOptions = IpfsUploadBatchOptions> {
  private uploader: IStorageUploader<T>;
  private downloader: IStorageDownloader;
  public gatewayUrls: GatewayUrls;

  constructor(options?: ThirdwebStorageOptions<T>) {
    this.uploader =
      options?.uploader ||
      new IpfsUploader({
        apiKey: options?.apiKey,
      });
    this.downloader = options?.downloader || new StorageDownloader();
    this.gatewayUrls = prepareGatewayUrls(
      parseGatewayUrls(options?.gatewayUrls),
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
  async upload(data: unknown, options?: T): Promise<string> {
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
  async uploadBatch(data: unknown[], options?: T): Promise<string[]> {
    data = data.filter((item) => item !== undefined);

    if (!data.length) {
      return [];
    }

    const isFileArray = data
      .map((item) => isFileOrBuffer(item) || typeof item === "string")
      .every((item) => !!item);

    let uris: string[] = [];

    // If data is an array of files, pass it through to upload directly
    if (isFileArray) {
      uris = await this.uploader.uploadBatch(
        data as FileOrBufferOrString[],
        options,
      );
    } else {
      // Otherwise it is an array of JSON objects, so we have to prepare it first
      const metadata = (
        await this.uploadAndReplaceFilesWithHashes(data, options)
      ).map((item) => {
        if (typeof item === "string") {
          return item;
        }
        return JSON.stringify(item);
      });

      uris = await this.uploader.uploadBatch(metadata, options);
    }

    if (options?.uploadWithGatewayUrl || this.uploader.uploadWithGatewayUrl) {
      return uris.map((uri) => this.resolveScheme(uri));
    } else {
      return uris;
    }
  }

  private async uploadAndReplaceFilesWithHashes(
    data: unknown[],
    options?: T,
  ): Promise<unknown[]> {
    let cleaned = data;
    // Replace any gateway URLs with their hashes
    cleaned = replaceObjectGatewayUrlsWithSchemes(
      cleaned,
      this.gatewayUrls,
    ) as unknown[];

    // Recurse through data and extract files to upload
    const files = extractObjectFiles(cleaned);

    if (files.length) {
      // Upload all files that came from the object
      const uris = await this.uploader.uploadBatch(files, options);

      // Recurse through data and replace files with hashes
      cleaned = replaceObjectFilesWithUris(cleaned, uris) as unknown[];
    }

    if (options?.uploadWithGatewayUrl || this.uploader.uploadWithGatewayUrl) {
      // If flag is set, replace all schemes with their preferred gateway URL
      // Ex: used for Solana, where services don't resolve schemes for you, so URLs must be usable by default
      cleaned = replaceObjectSchemesWithGatewayUrls(
        cleaned,
        this.gatewayUrls,
      ) as unknown[];
    }

    return cleaned;
  }
}
