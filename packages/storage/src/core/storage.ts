import { prepareGatewayUrls } from "../common";
import {
  extractObjectFiles,
  replaceObjectFilesWithUris,
  replaceObjectGatewayUrlsWithSchemes,
  replaceObjectSchemesWithGatewayUrls,
  replaceSchemeWithGatewayUrl,
} from "../common/utils";
import {
  FileOrBuffer,
  FileOrBufferOrStringArraySchema,
  GatewayUrls,
  IpfsUploadBatchOptions,
  IStorageDownloader,
  IStorageUploader,
  Json,
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
 *     "https://gateway.ipfscdn.io/ipfs/",
 *     "https://cloudflare-ipfs.com/ipfs/",
 *     "https://ipfs.io/ipfs/",
 *   ],
 * };
 * const downloader = new StorageDownloader();
 * const uploader = new IpfsUploader();
 * const storage = new ThirdwebStorage(uploader, downloader, gatewayUrls)
 * ```
 *
 * @public
 */
export class ThirdwebStorage<T extends UploadOptions = IpfsUploadBatchOptions> {
  private uploader: IStorageUploader<T>;
  private downloader: IStorageDownloader;
  public gatewayUrls: GatewayUrls;

  constructor(
    uploader: IStorageUploader<T> = new IpfsUploader(),
    downloader: IStorageDownloader = new StorageDownloader(),
    gatewayUrls?: GatewayUrls,
  ) {
    this.uploader = uploader;
    this.downloader = downloader;
    this.gatewayUrls = prepareGatewayUrls(gatewayUrls);
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
    return replaceSchemeWithGatewayUrl(url, this.gatewayUrls);
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
  async upload(data: Json | FileOrBuffer, options?: T): Promise<string> {
    const [uri] = await this.uploadBatch(
      [data] as Json[] | FileOrBuffer[],
      options,
    );
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
  async uploadBatch(
    data: Json[] | FileOrBuffer[],
    options?: T,
  ): Promise<string[]> {
    if (!data.length) {
      return [];
    }

    const { success: isFileArray } =
      FileOrBufferOrStringArraySchema.safeParse(data);

    // If data is an array of files, pass it through to upload directly
    if (isFileArray) {
      return this.uploader.uploadBatch(data as FileOrBuffer[], options);
    }

    // Otherwise it is an array of JSON objects, so we have to prepare it first
    const metadata = (
      await this.uploadAndReplaceFilesWithHashes(data as Json[], options)
    ).map((item) => {
      if (typeof item === "string") {
        return item;
      }
      return JSON.stringify(item);
    });

    return this.uploader.uploadBatch(metadata, options);
  }

  private async uploadAndReplaceFilesWithHashes(
    data: Json[],
    options?: T,
  ): Promise<Json[]> {
    let cleaned = data;
    // TODO: Gateway URLs should probably be top-level since both uploader and downloader need them
    if (this.gatewayUrls) {
      // Replace any gateway URLs with their hashes
      cleaned = replaceObjectGatewayUrlsWithSchemes(
        cleaned,
        this.gatewayUrls,
      ) as Json[];

      if (options?.uploadWithGatewayUrl || this.uploader.uploadWithGatewayUrl) {
        // If flag is set, replace all schemes with their preferred gateway URL
        // Ex: used for Solana, where services don't resolve schemes for you, so URLs must be useable by default
        cleaned = replaceObjectSchemesWithGatewayUrls(
          cleaned,
          this.gatewayUrls,
        ) as Json[];
      }
    }

    // Recurse through data and extract files to upload
    const files = extractObjectFiles(cleaned);

    if (!files.length) {
      return cleaned;
    }

    // Upload all files that came from the object
    const uris = await this.uploader.uploadBatch(files);

    // Recurse through data and replace files with hashes
    return replaceObjectFilesWithUris(cleaned, uris) as Json[];
  }
}
