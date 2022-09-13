import { FileOrBuffer } from "./data";

export interface UploadProgressEvent {
  /**
   * The number of bytes uploaded.
   */
  progress: number;

  /**
   * The total number of bytes to be uploaded.
   */
  total: number;
}

export interface IStorageUploader {
  uploadBatch(
    data: (string | FileOrBuffer)[],
    onProgress?: (event: UploadProgressEvent) => void,
  ): Promise<string[]>;
}
