import { batchUploadProperties } from "../common/utils";
import {
  CleanedUploadData,
  FileOrBuffer,
  FileOrBufferSchema,
  IStorageDownloader,
  IStorageUploader,
  JsonObject,
  UploadDataSchema,
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

  async download(url: string): Promise<string> {
    return this.downloader.download(url);
  }

  async upload(data: JsonObject | FileOrBuffer): Promise<string> {
    const [uri] = await this.uploadBatch([data] as
      | JsonObject[]
      | FileOrBuffer[]);
    return uri;
  }

  async uploadBatch(data: JsonObject[] | FileOrBuffer[]): Promise<string[]> {
    const parsed: JsonObject[] | FileOrBuffer[] = UploadDataSchema.parse(data);
    const { success: isFileArray } = FileOrBufferSchema.safeParse(parsed[0]);

    // If data is an array of files, pass it through to upload directly
    if (isFileArray) {
      return this.uploader.uploadBatch(parsed as FileOrBuffer[]);
    }

    // Otherwise it is an array of JSON objects, so we have to prepare it first
    const metadata = (
      await batchUploadProperties(
        parsed as JsonObject[],
        this.uploader,
        // TODO: Change baseUrl and gatewayUrl
        "https://example.com",
        "ipfs://",
      )
    ).map((item) => JSON.stringify(item));

    return this.uploader.uploadBatch(metadata);
  }
}
