import {
  FileOrBuffer,
  IStorageUploader,
  UploadProgressEvent,
} from "../../types";

export class IpfsUploader implements IStorageUploader {
  constructor() {}

  async uploadBatch(
    data: (string | FileOrBuffer)[],
    onProgress?: (event: UploadProgressEvent) => void,
  ): Promise<string[]> {
    return [""];
  }
}
