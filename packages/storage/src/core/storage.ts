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
  Json,
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

  async upload(data: Json | FileOrBuffer, options?: T): Promise<string> {
    const [uri] = await this.uploadBatch(
      [data] as Json[] | FileOrBuffer[],
      options,
    );
    return uri;
  }

  async uploadBatch(
    data: Json[] | FileOrBuffer[],
    options?: T,
  ): Promise<string[]> {
    if (!data.length) {
      return [];
    }

    const { success: isFileArray } = FileOrBufferSchema.safeParse(data[0]);

    // If data is an array of files, pass it through to upload directly
    if (isFileArray) {
      return this.uploader.uploadBatch(data as FileOrBuffer[], options);
    }

    // Otherwise it is an array of JSON objects, so we have to prepare it first
    const metadata = (
      await this.uploadAndReplaceFilesWithHashes(data as Json[], options)
    ).map((item) => JSON.stringify(item));

    return this.uploader.uploadBatch(metadata, options);
  }

  private async uploadAndReplaceFilesWithHashes(
    data: Json[],
    options?: T,
  ): Promise<Json[]> {
    let cleaned = data;
    // TODO: Gateway URLs should probably be top-level since both uploader and downloader need them
    if (this.uploader.gatewayUrls || this.downloader.gatewayUrls) {
      // Replace any gateway URLs with their hashes
      cleaned = replaceObjectGatewayUrlsWithSchemes(
        cleaned,
        this.uploader.gatewayUrls || this.downloader.gatewayUrls,
      ) as Json[];

      if (options?.uploadWithGatewayUrl || this.uploader.uploadWithGatewayUrl) {
        // If flag is set, replace all schemes with their preferred gateway URL
        // Ex: used for Solana, where services don't resolve schemes for you, so URLs must be useable by default
        cleaned = replaceObjectSchemesWithGatewayUrls(
          cleaned,
          this.uploader.gatewayUrls || this.downloader.gatewayUrls,
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
