import {
  extractObjectFiles,
  replaceObjectFilesWithUris,
  replaceObjectGatewayUrlsWithSchemes,
  replaceObjectSchemesWithGatewayUrls,
} from "../common/utils";
import {
  FileOrBuffer,
  FileOrBufferSchema,
  IpfsUploadBatchOptions,
  IStorageDownloader,
  IStorageUploader,
  JsonObject,
  UploadDataSchema,
  UploadOptions,
} from "../types";
import { StorageDownloader } from "./downloaders/storage-downloader";
import { IpfsUploader } from "./uploaders/ipfs-uploader";

export class ThirdwebStorage<T extends UploadOptions = IpfsUploadBatchOptions> {
  private uploader: IStorageUploader<T>;
  private downloader: IStorageDownloader;

  constructor(
    uploader: IStorageUploader<T> = new IpfsUploader(),
    downloader: IStorageDownloader = new StorageDownloader(),
  ) {
    this.uploader = uploader;
    this.downloader = downloader;
  }

  async download(url: string): Promise<Response> {
    return this.downloader.download(url);
  }

  async downloadJSON<TJSON = any>(url: string): Promise<TJSON> {
    const res = await this.download(url);

    // If we get a JSON object, recursively replace any schemes with gatewayUrls
    const json = await res.json();
    return replaceObjectSchemesWithGatewayUrls(
      json,
      this.downloader.gatewayUrls,
    ) as TJSON;
  }

  async upload(data: JsonObject | FileOrBuffer, options?: T): Promise<string> {
    const [uri] = await this.uploadBatch(
      [data] as JsonObject[] | FileOrBuffer[],
      options,
    );
    return uri;
  }

  async uploadBatch(
    data: JsonObject[] | FileOrBuffer[],
    options?: T,
  ): Promise<string[]> {
    const parsed: JsonObject[] | FileOrBuffer[] = UploadDataSchema.parse(data);
    const { success: isFileArray } = FileOrBufferSchema.safeParse(parsed[0]);

    // If data is an array of files, pass it through to upload directly
    if (isFileArray) {
      return this.uploader.uploadBatch(parsed as FileOrBuffer[], options);
    }

    // Otherwise it is an array of JSON objects, so we have to prepare it first
    const metadata = (
      await this.uploadAndReplaceFilesWithHashes(
        parsed as JsonObject[],
        options,
      )
    ).map((item) => JSON.stringify(item));

    return this.uploader.uploadBatch(metadata, options);
  }

  private async uploadAndReplaceFilesWithHashes(
    data: JsonObject[],
    options?: T,
  ): Promise<JsonObject[]> {
    let cleaned = data;
    if (this.uploader.gatewayUrls) {
      // Replace any gateway URLs with their hashes
      cleaned = replaceObjectGatewayUrlsWithSchemes(
        cleaned,
        this.uploader.gatewayUrls,
      ) as JsonObject[];
    }

    if (options?.uploadWithGatewayUrl) {
      // If flag is set, replace all schemes with their preferred gateway URL
      // Ex: used for Solana, where services don't resolve schemes for you, so URLs must be useable by default
      cleaned = replaceObjectSchemesWithGatewayUrls(
        cleaned,
        this.uploader.gatewayUrls || this.downloader.gatewayUrls,
      ) as JsonObject[];
    }

    // Recurse through data and extract files to upload
    const files = extractObjectFiles(cleaned);

    if (!files.length) {
      return cleaned;
    }

    // Upload all files that came from the object
    const uris = await this.uploader.uploadBatch(files);

    // Recurse through data and replace files with hashes
    return replaceObjectFilesWithUris(cleaned, uris) as JsonObject[];
  }
}
