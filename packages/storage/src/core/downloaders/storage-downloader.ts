import { IStorageDownloader } from "../../types";

export class StorageDownloader implements IStorageDownloader {
  constructor() {}

  async download(url: string): Promise<any> {}
}
