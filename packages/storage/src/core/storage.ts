import {
  extractObjectFiles,
  replaceObjectFilesWithUris,
  replaceObjectGatewayUrlsWithSchemes,
  replaceObjectSchemesWithGatewayUrls,
} from "../common/utils";
import {
  FileOrBuffer,
  FileOrBufferSchema,
  IStorageDownloader,
  IStorageUploader,
  Json,
  JsonObject,
  UploadDataSchema,
  UploadOptions,
} from "../types";
import { StorageDownloader } from "./downloaders/storage-downloader";
import { IpfsUploader } from "./uploaders/ipfs-uploader";

export class ThirdwebStorage {
  private uploader: IStorageUploader;
  private downloader: IStorageDownloader;

  constructor(
    uploader: IStorageUploader = new IpfsUploader(),
    downloader: IStorageDownloader = new StorageDownloader(),
  ) {
    this.uploader = uploader;
    this.downloader = downloader;
  }

  async download(url: string): Promise<Json> {
    const res = await this.downloader.download(url);

    const text = await res.text();

    // Handle both JSON and standard text data types
    try {
      // If we get a JSON object, recursively replace any schemes with gatewayUrls
      const json = JSON.parse(text);
      return replaceObjectSchemesWithGatewayUrls(
        json,
        this.downloader.gatewayUrls,
      );
    } catch {
      return text;
    }
  }

  async upload(
    data: JsonObject | FileOrBuffer,
    options?: UploadOptions,
  ): Promise<string> {
    const [uri] = await this.uploadBatch([data] as
      | JsonObject[]
      | FileOrBuffer[]);
    return uri;
  }

  async uploadBatch(
    data: JsonObject[] | FileOrBuffer[],
    options?: UploadOptions,
  ): Promise<string[]> {
    const parsed: JsonObject[] | FileOrBuffer[] = UploadDataSchema.parse(data);
    const { success: isFileArray } = FileOrBufferSchema.safeParse(parsed[0]);

    // If data is an array of files, pass it through to upload directly
    if (isFileArray) {
      return this.uploader.uploadBatch(parsed as FileOrBuffer[], options);
    }

    // Otherwise it is an array of JSON objects, so we have to prepare it first
    const metadata = (
      await this.uploadAndReplaceFilesWithHashes(parsed as JsonObject[])
    ).map((item) => JSON.stringify(item));

    return this.uploader.uploadBatch(metadata, options);
  }

  private async uploadAndReplaceFilesWithHashes(
    data: JsonObject[],
  ): Promise<JsonObject[]> {
    let cleaned = data;
    if (this.downloader.gatewayUrls) {
      // Replace any gateway URLs with their hashes
      cleaned = replaceObjectGatewayUrlsWithSchemes(
        data,
        this.downloader.gatewayUrls,
      ) as JsonObject[];
    }

    if (this.uploader.uploadWithGatewayUrl) {
      // If flag is set, replace all schemes with their preferred gateway URL
      // Ex: used for Solana, where services don't resolve schemes for you, so URLs must be useable by default
      cleaned = replaceObjectSchemesWithGatewayUrls(
        data,
        this.uploader.gatewayUrls || this.downloader.gatewayUrls,
      ) as JsonObject[];
    }

    // Recurse through data and extract files to upload
    const files = extractObjectFiles(data);

    // Upload all files that came from the object
    const uris = await this.uploader.uploadBatch(files);

    // Recurse through data and replace files with hashes
    return replaceObjectFilesWithUris(data, uris) as JsonObject[];
  }
}
