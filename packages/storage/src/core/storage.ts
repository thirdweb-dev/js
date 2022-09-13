import { batchUploadProperties } from "../common/utils";
import {
  CleanedUploadData,
  FileOrBufferSchema,
  IStorageDownloader,
  IStorageUploader,
  UploadData,
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

  async upload(data: UploadData): Promise<string> {
    const [uri] = await this.uploadBatch([data]);
    return uri;
  }

  async uploadBatch(data: UploadData[]): Promise<string[]> {
    const parsed = UploadDataSchema.parse(data);
    const cleaned = parsed.map((item) => {
      const { success } = FileOrBufferSchema.safeParse(item);

      if (success) {
        return item;
      }

      return JSON.stringify(item);
    }) as CleanedUploadData[];

    return this.uploader.uploadBatch(cleaned);
  }
}
