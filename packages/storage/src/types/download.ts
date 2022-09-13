export interface IStorageDownloader {
  download(url: string): Promise<any>;
}
